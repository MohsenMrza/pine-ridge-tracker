# Pine Ridge Grave Tracker

A map-based tool to locate family graves at Pine Ridge Memorial Garden (Ajax),
with plans to add life-story "wiki" pages, relationship-based recommendations,
and a curated du'a library.

## Stack
- **Backend:** FastAPI + PostgreSQL (SQLAlchemy)
- **Frontend:** React + Vite + Leaflet, using a custom local coordinate
  system (no external map tiles, no dependency on any particular image)
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

`backend/seed.py` contains **19 real family members**. Running this script
**clears all existing people/plots first**, so it's always safe to re-run
after editing it.

## How the map works now

`frontend/src/geo.js` converts real GPS coordinates into a simple **local
coordinate system measured in meters** from a fixed origin point on the
property (a flat-earth approximation -- more than accurate enough at the
scale of a single cemetery). Every grave pin, and all the decorative map
art in `frontend/src/MapBackground.jsx`, are drawn in that same coordinate
space.

Why this matters for you specifically:

- **No dependency on any particular image or map tile source.** You can
  design or commission fully custom map art -- hand-drawn, animated,
  branded however you like -- and it will line up correctly with real
  grave locations, because placement comes from real-world distance math,
  not from matching pixels to a picture.
- **New coordinates just work.** As you get more GPS coordinates -- from
  your own EXIF app, or from Pine Ridge staff -- add them to `seed.py` (or
  post them via the API) and they'll appear in the correct spot
  automatically. No recalibration step, ever.
- **Works offline**, since there's no dependency on a live map tile
  server -- useful given spotty signal at the cemetery.

`MapBackground.jsx` currently draws a simple stylized placeholder (a green
field, a couple of paths, tree clusters, and the real pond position) so the
app looks intentional today. Replace or extend it with your own custom
artwork whenever you're ready -- see the comments in that file.

## About GPS data

Photos uploaded directly to me have their embedded GPS metadata stripped in
transit (a privacy measure, not a setting on your phone). The reliable way
to get real coordinates: use an on-device EXIF viewer app (as you're
already doing) and copy the values into `backend/seed.py`, or export them
as a batch (CSV/KML) if your app supports it.

## Legacy files (not used by the current map)

The earlier illustrated-brochure-map approach is no longer active:

- `frontend/public/cemetery-map.png` -- the brochure image (turned out to
  only cover the ornamental garden near the entrance, not the actual
  burial fields)
- `pin-placement-helper.html`, `section-tracing-helper.html` -- tools for
  placing pins/sections on that image
- `frontend/src/sections.js` -- placeholder section polygon data

These are kept in the repo in case they're useful reference later, but
nothing in the live app currently uses them.

## Next steps (roughly in order)

1. Get GPS coordinates for the remaining 12 people and add them to `seed.py`.
2. Design or commission custom map artwork to replace `MapBackground.jsx`'s
   placeholder shapes.
3. Add photo upload support for `Person.photo_url`.
4. Populate `Relationship` rows once you're ready to track family connections.
5. Populate `DuaEntry` with a curated, tagged set of du'as.
6. Generate QR codes per plot pointing to `https://yourdomain.com/plot/{id}`.
7. Add authentication once you're ready to expand beyond your immediate family.
