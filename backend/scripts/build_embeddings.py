"""
Create embeddings for each Latin word in app/data/latin_words.csv
Saves them to app/ai/vector_store/latin_embeddings.pkl
"""
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pickle
from app.utils.load_models import get_embedding_model
import pandas as pd

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV = os.path.join(BASE, "app", "data", "latin_words.csv")
OUTDIR = os.path.join(BASE, "app", "ai", "vector_store")
OUTFILE = os.path.join(OUTDIR, "latin_embeddings.pkl")

os.makedirs(OUTDIR, exist_ok=True)

if not os.path.exists(CSV):
    raise SystemExit("CSV not found at " + CSV + ". Create app/data/latin_words.csv with columns latin,english")

df = pd.read_csv(CSV, dtype=str).fillna("")
words = df["latin"].tolist()
model = get_embedding_model()
print("Computing embeddings for", len(words), "words...")
emb = model.encode(words, show_progress_bar=True)
with open(OUTFILE, "wb") as f:
    pickle.dump(emb, f)
print("Saved embeddings to", OUTFILE)
