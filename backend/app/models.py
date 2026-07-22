from sqlalchemy import Column, Integer, String, Float, Text, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Plot(Base):
    __tablename__ = "plots"

    id = Column(Integer, primary_key=True, index=True)
    section = Column(String, nullable=True)
    row = Column(String, nullable=True)
    plot_number = Column(String, nullable=True)

    # Real-world GPS (optional, for outdoor navigation later)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    # Position on the custom overlay map image (percentage-based, 0-100)
    map_x = Column(Float, nullable=True)
    map_y = Column(Float, nullable=True)

    qr_code_id = Column(String, unique=True, nullable=True)

    people = relationship("Person", back_populates="plot")


class Person(Base):
    __tablename__ = "people"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False, index=True)
    birth_date = Column(Date, nullable=True)
    death_date = Column(Date, nullable=True)
    bio = Column(Text, nullable=True)
    photo_url = Column(String, nullable=True)

    plot_id = Column(Integer, ForeignKey("plots.id"), nullable=True)
    plot = relationship("Plot", back_populates="people")


class Relationship(Base):
    __tablename__ = "relationships"

    id = Column(Integer, primary_key=True, index=True)
    person_a_id = Column(Integer, ForeignKey("people.id"), nullable=False)
    person_b_id = Column(Integer, ForeignKey("people.id"), nullable=False)
    relationship_type = Column(String, nullable=False)  # e.g. "spouse", "parent", "sibling"


class DuaEntry(Base):
    __tablename__ = "dua_entries"

    id = Column(Integer, primary_key=True, index=True)
    arabic_text = Column(Text, nullable=True)
    transliteration = Column(Text, nullable=True)
    translation = Column(Text, nullable=True)
    tags = Column(String, nullable=True)  # comma-separated for now, e.g. "parents,general"
    source_reference = Column(String, nullable=True)
