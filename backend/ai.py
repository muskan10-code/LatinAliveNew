# backend/ai.py
import re
from typing import List, Dict

# Small hard-coded dictionary for common classroom words (Week 1)
_DICTIONARY = {
    "puella": {"lemma": "puella", "part": "noun", "meaning": "girl"},
    "puellae": {"lemma": "puella", "part": "noun", "meaning": "girl (pl/gen/dat)"},
    "agricola": {"lemma": "agricola", "part": "noun", "meaning": "farmer"},
    "est": {"lemma": "sum", "part": "verb", "meaning": "is"},
    "amat": {"lemma": "amo", "part": "verb", "meaning": "loves"},
    "videt": {"lemma": "video", "part": "verb", "meaning": "sees"},
    "et": {"lemma": "et", "part": "conjunction", "meaning": "and"},
    "in": {"lemma": "in", "part": "preposition", "meaning": "in/into"},
    "puer": {"lemma": "puer", "part": "noun", "meaning": "boy"},
    "salutat": {"lemma": "saluto", "part": "verb", "meaning": "greets"},
}

def simple_analyze_sentence(sentence: str) -> List[Dict]:
    s = sentence.strip()
    s = re.sub(r"[^\w\s']", " ", s, flags=re.UNICODE)
    tokens = [t for t in s.split() if t]
    results = []
    for tok in tokens:
        low = tok.lower()
        entry = _DICTIONARY.get(low)
        if entry:
            analysis = guess_morphology(low)
            results.append({
                "word": tok,
                "lemma": entry["lemma"],
                "part_of_speech": entry["part"],
                "meaning": entry.get("meaning", "Unknown"),
                "analysis": analysis
            })
        else:
            results.append({
                "word": tok,
                "lemma": low,
                "part_of_speech": guess_pos_from_ending(low),
                "meaning": "Unknown",
                "analysis": guess_morphology(low)
            })
    return results

def guess_pos_from_ending(word: str) -> str:
    if word.endswith(("are","ere","ire","e")):
        return "verb (inf)"
    if word.endswith(("a","us","um","er","or")):
        return "noun"
    if word.endswith(("ae","i","orum","arum")):
        return "noun (plural/declension)"
    return "unknown"

def guess_morphology(word: str):
    if word.endswith("a"):
        return {"case": "nominative", "number": "singular"}
    if word.endswith("ae"):
        return {"case": "gen/dat/nom", "number": "singular_or_plural"}
    if word.endswith("am"):
        return {"case": "accusative", "number": "singular"}
    if word.endswith("us"):
        return {"case": "nominative", "number": "singular"}
    if word.endswith("i"):
        return {"case": "genitive_or_plural", "number": "singular_or_plural"}
    if word.endswith("t"):
        return {"person": "3rd", "number": "singular", "tense": "present"}
    if word.endswith("o"):
        return {"person": "1st", "number": "singular", "tense": "present"}
    return {"note": "no-match"}
