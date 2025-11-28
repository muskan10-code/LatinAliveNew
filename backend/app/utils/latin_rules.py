# backend/app/utils/latin_rules.py
"""
Simple Latin morphological heuristics used when analyzer_engine can't infer features.
These are intentionally conservative: they produce candidate labels rather than definitive parsing.
"""

def analyze_word_form(word: str):
    w = word.lower().strip()
    # remove punctuation
    endings = {
        "orum": ("genitive", "plural"),
        "arum": ("genitive", "plural"),
        "ibus": ("dative/ablative", "plural"),
        "os": ("accusative", "plural"),
        "is": ("dative/ablative", "plural"),
        "ae": ("genitive/dative/nom(pl?)", "singular_or_plural"),
        "am": ("accusative", "singular"),
        "as": ("accusative", "plural"),
        "us": ("nominative", "singular"),
        "um": ("accusative", "singular"),
        "i": ("genitive or nominative plural", "singular_or_plural"),
        "o": ("dative/ablative or 1st person? check verb", "singular"),
        "t": ("3rd person present", "singular"),
        "nt": ("3rd person plural present", "plural"),
        "re": ("infinitive", "verb-inf")
    }

    for end, feat in endings.items():
        if w.endswith(end):
            return {"ending": end, "features": feat}
    return {"ending": None, "features": "unknown"}
