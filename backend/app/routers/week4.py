from fastapi import APIRouter
from app.models.project import ComicProject
from app.services.ai_dialogue import check_latin_dialogue
from app.services.glossary import extract_glossary
from app.services.audio import generate_audio
import json
import uuid

router = APIRouter(prefix="/api/week4", tags=["Week4"])

@router.post("/dialogue-feedback")
def dialogue_feedback(payload: dict):
    return check_latin_dialogue(payload["text"])

@router.post("/build-glossary")
def glossary(project: ComicProject):
    return {"glossary": extract_glossary([p.dict() for p in project.panels])}

@router.post("/audio")
def audio(payload: dict):
    path = generate_audio(payload["text"])
    return {"audio_file": path}

@router.post("/submit")
def submit_project(project: ComicProject):
    project_id = str(uuid.uuid4())
    with open(f"app/data/portfolios/{project_id}.json", "w") as f:
        json.dump(project.dict(), f, indent=2)
    return {"ok": True, "project_id": project_id}
