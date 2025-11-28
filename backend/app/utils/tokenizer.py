# backend/app/utils/tokenizer.py
import re

def simple_tokenize(text: str):
    # very small tokenizer for Latin-like text
    t = text.strip()
    # keep apostrophes as part of words
    tokens = re.findall(r"[A-Za-zÀ-ÖØ-öø-ÿ']+", t)
    return tokens
