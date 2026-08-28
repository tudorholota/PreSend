from pathlib import Path
import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

root_dir = Path(__file__).resolve().parents[1]
model_path = root_dir / "models" / "message_classifier.joblib"

model = joblib.load(model_path)

app = FastAPI(title = "PreSend API", version = "0.1.0")

#Alllow Chrome extension to access the API

app.add_middleware(CORSMiddleware, allow_origins = ["*"], allow_methods = ["*"], allow_headers = ["*"])

class AnalyzerRequest(BaseModel):
    text : str


@app.get("/")

def root():
    return {"name": "PreSend API", "status": "running"}

@app.get('/health')

def health():
    return {"status": "ok"}

@app.post("/analyze")

def analyze(request: AnalyzerRequest):
    text = request.text.strip()

    if not text:
        raise HTTPException(status_code = 400, detail = "Message cannot be empty")

    prediction = model.predict([text])[0]

    probabilities_array = (model.predict_proba([text])[0])

    clases  = (model.named_steps['classifier'].classes_)

    probabilities = {label : float(probability) for label, probability in zip(clases, probabilities_array)}

    confidence = max(probabilities.values())

    return {"text": text, "prediction" : prediction, "confidence": confidence, "probabilities": probabilities}