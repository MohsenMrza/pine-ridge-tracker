# Pine Ridge Grave Tracker

A map-based tool to locate family graves at Pine Ridge Memorial Garden (Ajax),
with plans to add life-story "wiki" pages, relationship-based recommendations,
and a curated du'a library.

## Stack
- **Backend:** FastAPI + PostgreSQL (SQLAlchemy)
- **Frontend:** React + Vite + Leaflet
- **Runs via:** Docker Compose

## Prerequisites (Windows)

1. Install **Docker Desktop for Windows**: https://www.docker.com/products/docker-desktop/
2. Install **Git for Windows** if you don't have it: https://git-scm.com/download/win
3. Restart your machine after installing Docker Desktop, then open it once and confirm it says "Docker is running."

## Running it

```
docker compose up --build
```

- Frontend (the map UI): http://localhost:5173
- Backend API docs: http://localhost:8000/docs

To stop: `Ctrl+C`, then `docker compose down`.

## Seeding data

```
docker compose exec backend python seed.py
```

`backend/seed.py` currently contains **19 real family members** with names
and dates read directly from the plaque photos taken on-site. They don't
have plot/location data yet (see below).

## Current status

- Real names/dates for 19 family members are seeded (no relationships
  tracked yet, per your note that they span multiple family branches).
- **7 of the 19 have real GPS coordinates** pulled from an on-device EXIF
  app. The other 12 are still waiting on their coordinates.
- The illustrated Pine Ridge site plan (`frontend/public/cemetery-map.png`)
  is wired up as the live map.
- Interactive sections: click a garden section to zoom/highlight it. Two
  placeholder sections exist in `frontend/src/sections.js` -- replace them
  with real traced boundaries using `section-tracing-helper.html`.

## About GPS data

Photos uploaded directly to me have their embedded GPS metadata stripped in
transit (a privacy measure, not a setting on your phone -- the earlier
advice to check Camera app > Location tags was a mistaken diagnosis).

The reliable way to get real coordinates: use an on-device EXIF viewer app
(as you're already doing) and copy the values into `backend/seed.py`
directly, or export them as a batch (CSV/KML) if your app supports it.
7 of the 19 people already have real coordinates seeded this way.

## Tools included

- **`pin-placement-helper.html`** -- open in your browser, click a spot on
  the map, get the `map_x`/`map_y` percentages to paste into `seed.py`.
- **`section-tracing-helper.html`** -- open in your browser, click around a
  garden's border to trace it, name it, repeat, then export JSON to paste
  into `frontend/src/sections.js`.

## Next steps (roughly in order)

1. Place map pins for the 19 seeded people using `pin-placement-helper.html`
   (use the photo-timestamp clusters noted as comments in `seed.py` as a
   rough guide to which plaques were near each other).
2. Trace the real garden section boundaries with `section-tracing-helper.html`
   and replace the placeholder sections in `sections.js`.
3. Add photo upload support for `Person.photo_url`.
4. Populate `Relationship` rows once you're ready to track family connections.
5. Populate `DuaEntry` with a curated, tagged set of du'as.
6. Generate QR codes per plot pointing to `https://yourdomain.com/plot/{id}`.
7. Add authentication once you're ready to expand beyond your immediate family.
