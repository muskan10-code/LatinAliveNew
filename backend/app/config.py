# backend/app/config.py

import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

LATIN_DICTIONARY_PATH = os.path.join(BASE_DIR, "data", "latin_words.csv")

VECTOR_STORE_PATH = os.path.join(
    BASE_DIR, "ai", "vector_store", "latin_embeddings.pkl"
)
