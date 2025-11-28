"""
Latin Sentence Analyzer Engine
------------------------------------
Uses:
- spaCy (Latin model)
- SentenceTransformer embeddings
- Vector similarity for meaning lookup
- Rule-based Latin morphology analyzer

This file is imported by the API route:
    app/api/analyzer.py
"""

import os
import pickle
import numpy as np
import pandas as pd
import spacy

from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer

from app.utils.latin_rules import analyze_word_form
from app.config import VECTOR_STORE_PATH, LATIN_DICTIONARY_PATH


# ---------------------------------------------------------
# 1. Load or warm-start spaCy model
# ---------------------------------------------------------
try:
    nlp = spacy.load("la_core_news_sm")
except:
    print("⚠️ spaCy Latin model missing — using blank Latin model.")
    nlp = spacy.blank("la")


# ---------------------------------------------------------
# 2. Load embedding model
# ---------------------------------------------------------
try:
    model_name = "sentence-transformers/all-MiniLM-L6-v2"
    embedder = SentenceTransformer(model_name)
except Exception as e:
    raise RuntimeError(f"❌ Failed loading SentenceTransformer: {e}")


# ---------------------------------------------------------
# 3. Load dictionary CSV
# ---------------------------------------------------------
if not os.path.exists(LATIN_DICTIONARY_PATH):
    raise FileNotFoundError(
        f"Latin dictionary not found at {LATIN_DICTIONARY_PATH}"
    )

latin_words = pd.read_csv(LATIN_DICTIONARY_PATH)

if "latin" not in latin_words.columns or "english" not in latin_words.columns:
    raise ValueError("latin_words.csv must contain columns: 'latin', 'english'")


# ---------------------------------------------------------
# 4. Load or Create Vector Store
# ---------------------------------------------------------
if os.path.exists(VECTOR_STORE_PATH):
    print("📦 Loading prebuilt Latin embeddings vector store...")
    with open(VECTOR_STORE_PATH, "rb") as f:
        word_embeddings = pickle.load(f)

else:
    print("⚠️ No vector store found. Building embeddings...")
    word_embeddings = embedder.encode(
        latin_words["latin"].tolist(),
        convert_to_numpy=True,
    )

    os.makedirs(os.path.dirname(VECTOR_STORE_PATH), exist_ok=True)
    with open(VECTOR_STORE_PATH, "wb") as f:
        pickle.dump(word_embeddings, f)

    print("✅ Vector store built and saved.")


# ---------------------------------------------------------
# Meaning Lookup via Semantic Similarity
# ---------------------------------------------------------
def semantic_lookup(word: str):
    """Return (meaning, lemma) based on closest embedding match."""
    emb = embedder.encode([word], convert_to_numpy=True)
    sims = cosine_similarity(emb, word_embeddings)[0]

    idx = int(np.argmax(sims))
    best_row = latin_words.iloc[idx]

    meaning = best_row["english"]
    lemma = best_row["latin"]

    return meaning, lemma


# ---------------------------------------------------------
# MAIN ANALYZER
# ---------------------------------------------------------
def analyze_sentence(sentence: str):
    """
    Full pipeline:
    - tokenize with spaCy
    - semantic meaning via embedding search
    - rule-based morphology from latin_rules
    """
    doc = nlp(sentence)

    result = []

    for token in doc:
        word = token.text.strip()

        if not word:
            continue

        # Lowercase text for matching
        clean = word.lower()

        # 1. semantic meaning
        meaning, lemma = semantic_lookup(clean)

        # 2. morphology from rules engine
        morphology = analyze_word_form(clean)

        # 3. POS from spaCy (fallback to unknown)
        pos = token.pos_ if token.pos_ else "unknown"

        result.append(
            {
                "word": word,
                "lemma": lemma,
                "part_of_speech": pos,
                "meaning": meaning,
                "analysis": morphology,
            }
        )

    return result
