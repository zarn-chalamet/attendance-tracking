from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from deepface import DeepFace
import uvicorn, os, tempfile

model_name = "VGG-Face"  # keep using this model name

app = FastAPI(title="Face Verification Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "ok", "service": "Face Verification", "endpoints": ["/api/face/verify", "/docs"]}

@app.post("/api/face/verify")
async def verify_faces(reference_file: UploadFile = File(...), live_file: UploadFile = File(...)):
    ref_path = live_path = None
    try:
        # cross-platform temp files
        ref_tmp = tempfile.NamedTemporaryFile(suffix=os.path.splitext(reference_file.filename or "")[-1] or ".jpg", delete=False)
        ref_path = ref_tmp.name; ref_tmp.write(await reference_file.read()); ref_tmp.close()

        live_tmp = tempfile.NamedTemporaryFile(suffix=os.path.splitext(live_file.filename or "")[-1] or ".jpg", delete=False)
        live_path = live_tmp.name; live_tmp.write(await live_file.read()); live_tmp.close()

        # NOTE: no model= here (for older DeepFace versions)
        result = DeepFace.verify(
            img1_path=ref_path,
            img2_path=live_path,
            model_name=model_name,
            enforce_detection=False
        )

        verified = bool(result.get("verified", False))
        dist = result.get("distance", None)
        confidence = (1.0 - float(dist)) if (verified and dist is not None) else 0.0
        return {"verified": verified, "distance": dist, "confidence": confidence}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        for p in (ref_path, live_path):
            try:
                if p and os.path.exists(p): os.remove(p)
            except Exception:
                pass

if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8080"))
    uvicorn.run("main:app", host="0.0.0.0", port=port)