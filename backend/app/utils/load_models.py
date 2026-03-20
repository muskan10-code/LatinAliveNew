import os
from sentence_transformers import SentenceTransformer
import logging

logger = logging.getLogger(__name__)

_EMBED_MODEL = None

def get_embedding_model(name: str = "sentence-transformers/all-MiniLM-L6-v2"):
    global _EMBED_MODEL
    if _EMBED_MODEL is None:
        logger.info("Loading embedding model: %s", name)
        _EMBED_MODEL = SentenceTransformer(name)
    return _EMBED_MODEL
