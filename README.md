# Pine Ridge Grave Tracker

A map-based tool to locate family graves at Pine Ridge Memorial Garden (Ajax),
with plans to add life-story "wiki" pages, relationship-based recommendations,
and a curated du'a library.

## Stack
- **Backend:** FastAPI + PostgreSQL (SQLAlchemy)
- **Frontend:** React + Vite + Leaflet, using real OpenStreetMap tiles
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

`backend/seed.py` contains **19 real family members** with names and dates
read directly from the plaque photos taken on-site. Running this script
**clears all existing people/plots first**, so it's always safe to re-run
after editing it -- no more stale test pins piling up.

## Current status

- Real names/dates for all 19 family members are seeded (no relationships
  tracked yet, per your note that they span multiple family branches).
- **7 of the 19 have real GPS coordinates**, pulled from an on-device EXIF
  app. They show as pins on the map. The other 12 are still waiting on
  their coordinates.
- The map is now real OpenStreetMap tiles centered on Pine Ridge, plotting
  people directly at their real GPS position (see "Why we switched" below).

## Why we switched from the illustrated map to real GPS tiles

We initially used the illustrated Pine Ridge "garden" brochure map as a
custom image overlay. Once real GPS coordinates came in, calibrating them
against that image revealed the family's actual graves sit **outside the
area that brochure map covers** -- it only shows the ornamental garden
section near the entrance/pond, not the in-ground burial fields further
south where your family is. Rather than forcing real coordinates onto the
wrong image, the app now uses a real geographic map (OpenStreetMap tiles)
with actual GPS pins. This is simpler, accurate, and scales cleanly as more
coordinates come in.

The illustrated map file (`frontend/public/cemetery-map.png`) and the two
helper tools below are no longer used by the live app, but are kept in the
repo in case you want a stylized overview map as a secondary/decorative
view later.

## About GPS data

Photos uploaded directly to me have their embedded GPS metadata stripped in
transit (a privacy measure, not a setting on your phone). The reliable way
to get real coordinates: use an on-device EXIF viewer app (as you're
already doing) and copy the values into `backend/seed.py` directly, or
export them as a batch (CSV/KML) if your app supports it.

## Legacy tools (not currently used by the live app)

- **`pin-placement-helper.html`** -- click a spot on the illustrated map,
  get percentage coordinates. Only useful if you bring back an image-based
  overlay map.
- **`section-tracing-helper.html`** -- trace garden section boundaries on
  the illustrated map. Same caveat as above.

## Next steps (roughly in order)

1. Get GPS coordinates for the remaining 12 people and add them to `seed.py`.
2. Add photo upload support for `Person.photo_url`.
3. Populate `Relationship` rows once you're ready to track family connections.
4. Populate `DuaEntry` with a curated, tagged set of du'as.
5. Generate QR codes per plot pointing to `https://yourdomain.com/plot/{id}`.
6. Add authentication once you're ready to expand beyond your immediate family.
