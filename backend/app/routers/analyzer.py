from fastapi import APIRouter
from pydantic import BaseModel
from app.ai.analyzer_engine import analyze_sentence

router = APIRouter()

class AnalyzeRequest(BaseModel):
    text: str

@router.post("/api/analyze")
def analyze(req: AnalyzeRequest):
    result = analyze_sentence(req.text)
    return {"ok": True, "raw": result}
