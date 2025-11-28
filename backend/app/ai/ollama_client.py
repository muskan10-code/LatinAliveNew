import os
import requests
import json

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")

def ollama_generate_if_available(prompt: str, model: str = "llama3", max_tokens: int = 512, temperature: float = 0.0):
    """
    Calls local Ollama server if available. Returns dictionary:
      { "text": "...", "json": parsed_json } or None if Ollama unreachable.
    """
    try:
        r = requests.post(
            f"{OLLAMA_URL}/api/generate",
            json={
                "model": model,
                "prompt": prompt,
                "max_tokens": max_tokens,
                "temperature": temperature
            },
            timeout=8
        )
        if r.status_code != 200:
            return None
        data = r.json()
        # try to extract textual content (varies by Ollama version)
        text = None
        if isinstance(data, dict):
            choices = data.get("choices") or []
            if choices and isinstance(choices, list):
                msg = choices[0].get("message") or {}
                text = msg.get("content") or data.get("text")
            else:
                text = data.get("text")
        # return both raw text and attempt to parse JSON
        res = {"text": text}
        if text:
            import re
            m = re.search(r"(\[|\{)", text)
            if m:
                try:
                    j = json.loads(text[m.start():])
                    res["json"] = j
                except Exception:
                    pass
        return res
    except Exception:
        return None