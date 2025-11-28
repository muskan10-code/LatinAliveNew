from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
import json

from app.ai.ollama_client import ollama_generate_if_available
from app.ai.analyzer_engine import analyze_sentence  # fallback/local analyzer

router = APIRouter(prefix="/api/week3", tags=["week3"])

class AnalyzeFableRequest(BaseModel):
    fable_text: str
    student_rewrite: Optional[str] = None

class SimplifyRequest(BaseModel):
    latin_text: str

class DialogueRequest(BaseModel):
    english_text: str
    tone: Optional[str] = "neutral"

class CheckDialogueRequest(BaseModel):
    dialogue: str

class QuizRequest(BaseModel):
    seed: Optional[int] = None

@router.post("/analyze-fable")
def analyze_fable(req: AnalyzeFableRequest):
    if not req.fable_text.strip():
        raise HTTPException(status_code=400, detail="fable_text required")

    # Prompt designed to extract structure and notes
    prompt = f"""
You are an expert Latin literature teacher. Analyze the following SHORT LATIN FABLE.
Return VALID JSON ONLY with keys:
- characters: [list of names/roles]
- setting: short phrase
- conflict: short phrase
- resolution: short phrase
- moral: short sentence
- sentence_analysis: array of objects for each sentence with keys: sentence, syntax_notes, vocabulary_notes
Now analyze this fable:
{req.fable_text}
"""
    resp = ollama_generate_if_available(prompt, model="llama3", max_tokens=700, temperature=0.0)
    if resp and isinstance(resp, dict) and (resp.get("json") or resp.get("text")):
        # try to return parsed JSON if available
        if resp.get("json"):
            out = resp["json"]
        else:
            # try to extract json from text
            text = resp.get("text", "")
            try:
                import re
                m = re.search(r"(\{|\[)", text)
                if m:
                    out = json.loads(text[m.start():])
                else:
                    out = {"raw_text": text}
            except Exception:
                out = {"raw_text": text}
        # if student rewrite provided, analyze it too
        if req.student_rewrite:
            out["student_rewrite_analysis"] = analyze_sentence(req.student_rewrite)
        return {"ok": True, "analysis": out}

    # fallback: use local analyzer and heuristics
    try:
        sentences = [s.strip() for s in req.fable_text.split(".") if s.strip()]
        sentence_analysis = []
        for s in sentences:
            tokens = analyze_sentence(s)
            sentence_analysis.append({"sentence": s, "syntax_notes": tokens, "vocabulary_notes": []})
        # simple placeholder extraction
        out = {
            "characters": [],
            "setting": "",
            "conflict": "See sentence analysis",
            "resolution": "",
            "moral": "",
            "sentence_analysis": sentence_analysis
        }
        if req.student_rewrite:
            out["student_rewrite_analysis"] = analyze_sentence(req.student_rewrite)
        return {"ok": True, "analysis": out}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/simplify-latin")
def simplify_latin(req: SimplifyRequest):
    if not req.latin_text.strip():
        raise HTTPException(status_code=400, detail="latin_text required")
    prompt = f"""
You are a helpful Latin teacher. Rewrite this LATIN sentence in simpler Latin (shorter words, simpler grammar).
Return only the simplified Latin text.

Original:
{req.latin_text}
"""
    resp = ollama_generate_if_available(prompt, model="llama3", max_tokens=200, temperature=0.2)
    if resp and resp.get("text"):
        return {"ok": True, "simplified": resp["text"].strip()}
    # fallback: return original
    return {"ok": True, "simplified": req.latin_text}


@router.post("/dialogue-helper")
def dialogue_helper(req: DialogueRequest):
    if not req.english_text.strip():
        raise HTTPException(status_code=400, detail="english_text required")
    prompt = f"""
You are a Latin dialogue generator for classroom comics. Convert the following English short dialogue/request to short Latin lines appropriate for learners.
Tone: {req.tone}
Return JSON array of strings (each string is one line of dialogue).
English:
{req.english_text}
"""
    resp = ollama_generate_if_available(prompt, model="llama3", max_tokens=300, temperature=0.6)
    if resp and (resp.get("json") or resp.get("text")):
        if resp.get("json"):
            return {"ok": True, "dialogue": resp["json"]}
        else:
            # try to parse lines
            text = resp.get("text", "").strip()
            lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
            return {"ok": True, "dialogue": lines}
    return {"ok": True, "dialogue": [req.english_text]}


@router.post("/check-comic-dialogue")
def check_comic_dialogue(req: CheckDialogueRequest):
    if not req.dialogue.strip():
        raise HTTPException(status_code=400, detail="dialogue required")
    # Use analyzer to parse the dialogue lines
    analysis = analyze_sentence(req.dialogue)
    return {"ok": True, "analysis": analysis}


@router.get("/quiz")
def get_quiz(seed: Optional[int] = None):
    # serve quiz file located in data folder
    import os
    import csv
    THIS_DIR = os.path.dirname(__file__)
    data_file = os.path.join(THIS_DIR, "..", "data", "week3_quiz.json")
    if not os.path.exists(data_file):
        return {"ok": False, "error": "Quiz data missing"}
    with open(data_file, "r", encoding="utf-8") as f:
        items = json.load(f)
    # optionally shuffle using seed
    import random
    if seed is not None:
        random.Random(seed).shuffle(items)
    else:
        random.shuffle(items)
    # return first 8 items
    return {"ok": True, "questions": items[:8]}
