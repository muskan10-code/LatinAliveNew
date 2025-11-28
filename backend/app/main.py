from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.analyzer import router as analyzer_router
from app.routers.comic import router as comic_router
from app.routers.vocab import router as vocab_router
from app.routers.homework import router as hw_router
from app.routers.health import router as health_router
from app.routers.week2 import router as week2_router
from app.routers.week3 import router as week3_router


app = FastAPI(title="Latin Alive Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(analyzer_router)
app.include_router(comic_router)
app.include_router(vocab_router)
app.include_router(hw_router)
app.include_router(week2_router)
app.include_router(week3_router)

@app.get("/")
def home():
    return {"msg": "LatinAlive backend running"}