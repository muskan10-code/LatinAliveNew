# vector_store README

Put a CSV at app/data/latin_words.csv with columns:
latin,english

Then run:
python scripts/build_embeddings.py

This will create:
app/ai/vector_store/latin_embeddings.pkl
