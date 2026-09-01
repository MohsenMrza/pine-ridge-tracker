"""
Seed script populated with real names/dates read from the plaque photos
taken at Pine Ridge on 2026-08-20, plus real GPS coordinates for the first
7 people (pulled from an on-device EXIF app, since photos uploaded here
have their embedded GPS metadata stripped in transit -- see README).

NOTES:
- map_x / map_y (position on the illustrated map) are still None for
  everyone. GPS coordinates don't automatically map to a position on the
  illustrated map image -- that still needs pin-placement-helper.html, OR
  a future calibration step that converts GPS -> map_x/map_y automatically
  once a couple of reference points are matched between the two.
- Photo timestamps are included as comments for the people without GPS yet
  -- entries photographed only seconds apart were very likely physically
  adjacent, which helps with manual pin placement in the meantime.
- Relationships were intentionally left out per your note.

Run from inside the backend container:
    docker compose exec backend python seed.py
"""

from datetime import date
from app.database import SessionLocal, Base, engine
from app import models

Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Clear existing data first so re-running this script doesn't pile up
# duplicates or leave old test/placeholder entries behind.
db.query(models.Person).delete()
db.query(models.Plot).delete()
db.commit()

# People with confirmed real GPS coordinates (from your EXIF app / Samsung Notes)
PEOPLE_WITH_GPS = [
    {
        "full_name": "Mohammed Asifuddin Khan",
        "birth_date": date(1934, 12, 10),
        "death_date": date(2011, 5, 7),
        "latitude": 43.885833,
        "longitude": -79.066389,
    },
    {
        "full_name": "Mukhtar Unissa Begum",
        "birth_date": date(1927, 11, 7),
        "death_date": date(2021, 1, 16),
        "latitude": 43.885833,
        "longitude": -79.066389,
    },
    {
        "full_name": "Dr. Mohammed Sadiq Ali Ahmed",
        "birth_date": date(1927, 1, 1),
        "death_date": date(2009, 1, 1),
        "latitude": 43.885556,
        "longitude": -79.066944,
    },
    {
        "full_name": "Dr. Hamda Ahmed",
        "birth_date": date(1928, 1, 1),
        "death_date": date(1994, 1, 1),
        "latitude": 43.885556,
        "longitude": -79.066944,
    },
    {
        "full_name": "Afzalunnisa Hussain",
        "birth_date": date(1920, 8, 12),
        "death_date": date(2008, 2, 13),
        "latitude": 43.885278,
        "longitude": -79.067222,
    },
    {
        "full_name": "Syed Kazim Hussain",
        "birth_date": date(1912, 7, 21),
        "death_date": date(1997, 4, 10),
        "latitude": 43.885278,
        "longitude": -79.0675,
    },
    {
        "full_name": "Mohammed Viqar Hussain Khan",
        "birth_date": date(1934, 8, 12),
        "death_date": date(2013, 2, 12),
        "latitude": 43.886389,
        "longitude": -79.068333,
    },
]

# People without GPS yet -- waiting on the rest of the EXIF app screenshots
PEOPLE_WITHOUT_GPS = [
    # 14:51:28
    {"full_name": "Cameran Mirza Peng", "birth_date": date(1955, 1, 1), "death_date": date(2022, 1, 1)},
    # 14:53:59
    {"full_name": "Mohammad Mazheruddin Khan", "birth_date": date(1926, 3, 25), "death_date": date(2016, 11, 2)},
    # 14:56:14
    {"full_name": "Muneer Bano Ahmed-Pasha", "birth_date": date(1920, 1, 1), "death_date": date(2016, 1, 1)},
    # 14:56:57 (43s after above -- likely same cluster)
    {"full_name": "Mohammed Kabeeruddin Khan", "birth_date": date(1936, 6, 12), "death_date": date(2016, 8, 16)},
    # 15:02:19
    {"full_name": "Sikander Uddin Khan", "birth_date": date(1927, 1, 18), "death_date": date(2006, 10, 29)},
    # 15:09:32 -- 15:09:53 (four plaques within ~20s of each other -- same cluster)
    {"full_name": "Syed Attaullah Khan", "birth_date": date(1925, 8, 7), "death_date": date(2016, 1, 16)},
    {"full_name": "Mohammadi Begum Khan", "birth_date": date(1930, 7, 11), "death_date": date(1999, 12, 22)},
    {"full_name": "Karamat Khan", "birth_date": date(1963, 3, 9), "death_date": date(2016, 6, 24)},
    {"full_name": "Asif Hussain Khan", "birth_date": date(1933, 6, 11), "death_date": date(2020, 3, 14)},
    # 15:10:49
    {"full_name": "Iqbal Quadri", "birth_date": date(1926, 1, 1), "death_date": date(2013, 1, 1)},
    # 15:11:08 -- 15:11:15 (same cluster)
    {"full_name": "M. Fazaluddin Khan", "birth_date": date(1929, 1, 25), "death_date": date(2017, 7, 4)},
    {"full_name": "Mohammed Imtiazuddin Khan", "birth_date": date(1960, 1, 1), "death_date": date(2014, 1, 1)},
]

plots_by_coord = {}

for entry in PEOPLE_WITH_GPS:
    coord = (entry["latitude"], entry["longitude"])
    plot = plots_by_coord.get(coord)
    if plot is None:
        plot = models.Plot(latitude=entry["latitude"], longitude=entry["longitude"])
        db.add(plot)
        db.flush()  # get plot.id before commit
        plots_by_coord[coord] = plot

    person = models.Person(
        full_name=entry["full_name"],
        birth_date=entry["birth_date"],
        death_date=entry["death_date"],
        plot_id=plot.id,
    )
    db.add(person)

for entry in PEOPLE_WITHOUT_GPS:
    person = models.Person(**entry)
    db.add(person)

db.commit()
db.close()

total = len(PEOPLE_WITH_GPS) + len(PEOPLE_WITHOUT_GPS)
print(f"Seeded {total} people ({len(PEOPLE_WITH_GPS)} with real GPS coordinates).")
