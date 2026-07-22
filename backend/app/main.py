from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import plots

# Creates tables automatically on startup for now.
# Once the schema stabilizes, switch to Alembic migrations instead.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pine Ridge Grave Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this once you have a real frontend domain
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(plots.router)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
