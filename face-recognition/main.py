from fastapi import FastAPI, UploadFile, File
from deepface import DeepFace

app = FastAPI(title="Face Verification Service")

@app.post("/api/face/verify")
async def verify_faces(reference_file: UploadFile = File(...), live_file: UploadFile = File(...)):
    ref_path = "reference.jpg"
    live_path = "live.jpg"

    with open(ref_path, "wb") as f:
        f.write(await reference_file.read())
    with open(live_path, "wb") as f:
        f.write(await live_file.read())

    try:
        result = DeepFace.verify(ref_path, live_path, enforce_detection=False)
        return {
            "verified": result["verified"],
            "distance": result["distance"],
            "confidence": 1 - result["distance"] if result["verified"] else 0
        }
    except Exception as e:
        return {"error": str(e)}
