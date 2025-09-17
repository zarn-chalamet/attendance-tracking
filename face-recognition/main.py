from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from deepface import DeepFace
from io import BytesIO
import numpy as np
import cv2

app = FastAPI(title="Face Verification Service")

# Allow your frontend origin(s) here:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

def read_imagefile(file: UploadFile):
    image_bytes = file.file.read()
    np_arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    return img

@app.post("/api/face/verify")
async def verify_faces(reference_file: UploadFile = File(...), live_file: UploadFile = File(...)):
    try:
        # Read images directly from memory
        ref_img = read_imagefile(reference_file)
        live_img = read_imagefile(live_file)

        # Run DeepFace verification without saving
        result = DeepFace.verify(ref_img, live_img, enforce_detection=False)

        return {
            "verified": result["verified"],
            "distance": result["distance"],
            "confidence": 1 - result["distance"] if result["verified"] else 0
        }
    except Exception as e:
        return {"error": str(e)}
