from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api/plots", tags=["plots"])


@router.get("/", response_model=list[schemas.PlotOut])
def list_plots(db: Session = Depends(get_db)):
    return db.query(models.Plot).all()


@router.get("/{plot_id}", response_model=schemas.PlotOut)
def get_plot(plot_id: int, db: Session = Depends(get_db)):
    plot = db.query(models.Plot).filter(models.Plot.id == plot_id).first()
    if not plot:
        raise HTTPException(status_code=404, detail="Plot not found")
    return plot


@router.post("/", response_model=schemas.PlotOut)
def create_plot(plot: schemas.PlotCreate, db: Session = Depends(get_db)):
    db_plot = models.Plot(**plot.model_dump())
    db.add(db_plot)
    db.commit()
    db.refresh(db_plot)
    return db_plot


@router.get("/search/people", response_model=list[schemas.PersonOut])
def search_people(q: str, db: Session = Depends(get_db)):
    return (
        db.query(models.Person)
        .filter(models.Person.full_name.ilike(f"%{q}%"))
        .all()
    )
