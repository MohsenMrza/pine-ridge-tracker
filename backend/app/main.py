from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import plots

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pine Ridge Grave Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(plots.router)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
