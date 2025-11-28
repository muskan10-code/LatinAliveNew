from fastapi import APIRouter
import pandas as pd

router = APIRouter()

latin_words = pd.read_csv("app/data/latin_words.csv")

@router.get("/api/vocab/{word}")
def get_vocab(word: str):
    matches = latin_words[latin_words["latin"] == word.lower()]
    if matches.empty:
        return {"ok": False, "meaning": "not found"}
    row = matches.iloc[0]
    return {
        "ok": True,
        "latin": row["latin"],
        "english": row["english"]
    }
