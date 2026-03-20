from pydantic import BaseModel
from typing import List

class ComicPanel(BaseModel):
    panel_id: int
    latin_text: str
    image_prompt: str

class ComicProject(BaseModel):
    group_name: str
    title: str
    panels: List[ComicPanel]
