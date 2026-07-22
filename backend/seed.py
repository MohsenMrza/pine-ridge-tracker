"""
Quick seed script to populate the database with sample plots/people
so you have something real to look at on the map.

Run this from inside the backend container:
    docker compose exec backend python seed.py

Edit the PEOPLE list below with your actual family info, then re-run.
"""

from datetime import date
from app.database import SessionLocal, Base, engine
from app import models

Base.metadata.create_all(bind=engine)

db = SessionLocal()

# map_x / map_y are percentages (0-100) across the Pine Ridge site plan image
# (frontend/public/cemetery-map.png). These sample values are just placeholders
# near the top of the image -- once you know which garden section your family
# is in, update these to roughly match that area, then fine-tune by eye once
# the map is loaded in the browser.
PEOPLE = [
    {
        "plot": {"section": "A", "row": "3", "plot_number": "14", "map_x": 30, "map_y": 40, "qr_code_id": "A-3-14"},
        "person": {
            "full_name": "Sample Grandparent",
            "birth_date": date(1935, 5, 12),
            "death_date": date(2015, 8, 3),
            "bio": "Replace this with a real biography summarizing their life and accomplishments.",
        },
    },
    {
        "plot": {"section": "A", "row": "3", "plot_number": "15", "map_x": 35, "map_y": 40, "qr_code_id": "A-3-15"},
        "person": {
            "full_name": "Sample Relative",
            "birth_date": date(1940, 2, 20),
            "death_date": date(2020, 11, 9),
            "bio": "Replace this with a real biography summarizing their life and accomplishments.",
        },
    },
]

for entry in PEOPLE:
    plot = models.Plot(**entry["plot"])
    db.add(plot)
    db.flush()  # get plot.id before commit

    person = models.Person(**entry["person"], plot_id=plot.id)
    db.add(person)

db.commit()
db.close()

print(f"Seeded {len(PEOPLE)} plots/people.")
