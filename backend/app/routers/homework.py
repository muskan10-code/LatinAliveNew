from fastapi import APIRouter

router = APIRouter()

@router.get("/api/homework/week1")
def week1_hw():
    return {
        "ok": True,
        "tasks": [
            "Translate 5 simple Latin sentences",
            "Identify nouns and verbs",
            "Match 10 vocabulary words",
        ]
    }
