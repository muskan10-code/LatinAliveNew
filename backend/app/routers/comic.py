from fastapi import APIRouter
from pydantic import BaseModel
from app.ai.image_engine import generate_local_image

router = APIRouter()

class ComicImageRequest(BaseModel):
    panel_id: int
    prompt: str

@router.post("/api/generate-image")
def generate_image(req: ComicImageRequest):
    try:
        img = generate_local_image(req.prompt)
        return {"ok": True, "panel_id": req.panel_id, "image_base64": img}
    except Exception as e:
        return {"ok": False, "error": str(e)}
