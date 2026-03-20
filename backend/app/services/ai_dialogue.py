import subprocess
import json

def check_latin_dialogue(text: str):
    prompt = f"""
You are a Latin teacher.
Check the following Latin text.
1. Correct grammar if needed
2. Explain errors simply
3. Suggest improved Latin

Text:
{text}
"""

    result = subprocess.run(
        ["ollama", "run", "llama3"],
        input=prompt,
        text=True,
        capture_output=True
    )

    return {
        "feedback": result.stdout.strip()
    }
