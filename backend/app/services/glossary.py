def extract_glossary(panels):
    vocab = set()

    for p in panels:
        words = p["latin_text"].lower().split()
        vocab.update(words)

    return sorted(list(vocab))
