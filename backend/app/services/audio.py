from gtts import gTTS
import uuid
import os

def generate_audio(text: str):
    filename = f"audio_{uuid.uuid4()}.mp3"
    path = f"app/data/portfolios/{filename}"

    tts = gTTS(text=text, lang="la")
    tts.save(path)

    return path
