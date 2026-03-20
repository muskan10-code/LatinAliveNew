import re

def simple_tokenize(text: str):
    t = text.strip()
    # keep apostrophes as part of words
    tokens = re.findall(r"[A-Za-zÀ-ÖØ-öø-ÿ']+", t)
    return tokens
