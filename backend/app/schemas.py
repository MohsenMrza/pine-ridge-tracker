from datetime import date
from typing import Optional
from pydantic import BaseModel, ConfigDict


class PersonOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    birth_date: Optional[date] = None
    death_date: Optional[date] = None
    bio: Optional[str] = None
    photo_url: Optional[str] = None


class PlotOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    section: Optional[str] = None
    row: Optional[str] = None
    plot_number: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    map_x: Optional[float] = None
    map_y: Optional[float] = None
    qr_code_id: Optional[str] = None
    people: list[PersonOut] = []


class PlotCreate(BaseModel):
    section: Optional[str] = None
    row: Optional[str] = None
    plot_number: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    map_x: float
    map_y: float
    qr_code_id: Optional[str] = None


class PersonCreate(BaseModel):
    full_name: str
    birth_date: Optional[date] = None
    death_date: Optional[date] = None
    bio: Optional[str] = None
    photo_url: Optional[str] = None
    plot_id: Optional[int] = None
