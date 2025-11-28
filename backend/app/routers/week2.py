# backend/app/routers/week2.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
import random
import requests
import os
import json

from app.ai.analyzer_engine import analyze_sentence  # fallback analyzer
from app.ai.ollama_client import ollama_generate_if_available

router = APIRouter(prefix="/api/week2", tags=["week2"])

# --- Models ---
class ScrambleRequest(BaseModel):
    passage: str
    seed: Optional[int] = None

class CheckRequest(BaseModel):
    sentence: str

class RebuildSubmit(BaseModel):
    original_passage: str
    reconstructed: str

class EscapeRequest(BaseModel):
    step: int
    answer: Optional[str] = None

# --- Helpers ---
def _split_sentences(passage: str) -> List[str]:
    # Super-simple sentence splitter (good for classroom passages)
    import re
    s = re.split(r'(?<=[.!?])\s+', passage.strip())
    return [seg.strip() for seg in s if seg.strip()]

def _scramble_sentence_words(sentence: str, seed: Optional[int] = None) -> str:
    words = sentence.split()
    if seed is not None:
        random.Random(seed).shuffle(words)
    else:
        random.shuffle(words)
    return " ".join(words)

# --- Endpoints ---

@router.post("/scramble")
def scramble(req: ScrambleRequest):
    sentences = _split_sentences(req.passage)
    seed = req.seed or random.randint(1, 1_000_000)
    scrambled = []
    for i, s in enumerate(sentences):
        scrambled.append({
            "index": i,
            "original": s,
            "scrambled": _scramble_sentence_words(s, seed + i)
        })
    return {"ok": True, "seed": seed, "items": scrambled}

@router.post("/check")
def check(req: CheckRequest):
    text = req.sentence.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Empty sentence")

    # 1) Try Ollama LLM with a structured prompt for syntactic analysis
    try:
        prompt = (
            "You are an expert Latin syntax teacher. "
            "Analyze this LATIN sentence word-by-word and return VALID JSON ONLY. "
            "For each token return: word, lemma, part_of_speech (NOUN/VERB/ADJ/PRON/CASE/ETC), "
            "role_candidates (subject/object/predicate/adverbial or null), and a boolean 'grammatical' "
            "indicating whether the sentence as written is grammatical. "
            f"Sentence:\n{ text }\n\nReturn JSON array of tokens, and an overall 'grammatical' flag."
        )
        resp = ollama_generate_if_available(prompt, max_tokens=512, temperature=0.0)
        if resp and isinstance(resp, dict) and resp.get("json"):
            return {"ok": True, "raw": resp["json"]}
        # if resp is textual - attempt to parse JSON
        text_resp = resp.get("text") if resp else None
        if text_resp:
            import re
            m = re.search(r"(\[|\{)", text_resp)
            if m:
                try:
                    parsed = json.loads(text_resp[m.start():])
                    return {"ok": True, "raw": parsed}
                except Exception:
                    # fall back to local analyzer
                    pass
    except Exception:
        # fall through to fallback
        pass

    # 2) Fallback: use local analyzer (analyze_sentence)
    try:
        parsed = analyze_sentence(text)
        # wrap in simple format: tokens + overall grammatical guess (always True for fallback)
        return {"ok": True, "raw": {"tokens": parsed, "grammatical": True}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/rebuild/score")
def rebuild_score(sub: RebuildSubmit):
    """Score student's reconstruction against original passage.
       Simple scoring: sentence-level exact match + token overlap; returns score 0-100 and feedback.
    """
    orig_sentences = _split_sentences(sub.original_passage)
    recon_sentences = _split_sentences(sub.reconstructed)

    # Align by count (best-effort)
    total = max(len(orig_sentences), 1)
    score_sum = 0
    feedback = []
    for i in range(len(orig_sentences)):
        orig = orig_sentences[i]
        recon = recon_sentences[i] if i < len(recon_sentences) else ""
        # exact match
        if orig.strip() == recon.strip():
            s = 100
            fb = "Exact match"
        else:
            # token overlap
            orig_tokens = set(orig.split())
            recon_tokens = set(recon.split())
            overlap = len(orig_tokens.intersection(recon_tokens))
            denom = max(len(orig_tokens), 1)
            s = int((overlap / denom) * 100)
            fb = f"Token overlap {overlap}/{denom}"
        score_sum += s
        feedback.append({"index": i, "orig": orig, "recon": recon, "score": s, "note": fb})

    overall = int(score_sum / total)
    return {"ok": True, "overall_score": overall, "details": feedback}

@router.post("/escape-clue")
def escape_clue(req: EscapeRequest):
    """
    A simple multi-step escape-room challenge:
    step 1: provide scrambled sentence -> student must reconstruct
    step 2: student submits reconstruction -> we check syntax and return next clue
    step 3: final prize message
    """
    step = req.step or 1
    if step == 1:
        # provide a scrambled clue (simplified hard-coded for demo; you can produce dynamic ones)
        sample = "Puella in horto ambulat."
        scrambled = _scramble_sentence_words(sample, seed=42)
        return {"ok": True, "step": 1, "clue": scrambled, "hint": "Rebuild the sentence (use nominative subject + verb + location)."}
    elif step == 2:
        if not req.answer:
            raise HTTPException(status_code=400, detail="Answer required for step 2")
        # check reconstruction using /check
        check_resp = check(CheckRequest(sentence=req.answer))
        is_grammatical = False
        # read returned structure
        if isinstance(check_resp.get("raw"), dict):
            is_grammatical = check_resp["raw"].get("grammatical", False)
        return {"ok": True, "step": 2, "correct": is_grammatical, "next_hint": "If correct, ask for the code word from the teacher."}
    else:
        return {"ok": True, "step": 3, "message": "You escaped! Show this code to your teacher: LATIN-EO-2025"}
