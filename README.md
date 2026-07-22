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
   - During install, make sure WSL 2 backend is enabled (Docker Desktop will prompt you if it's missing — just follow its instructions).
2. Install **Git for Windows** if you don't have it: https://git-scm.com/download/win
3. Restart your machine after installing Docker Desktop, then open Docker Desktop once and make sure it says "Docker is running" before continuing.

You do **not** need to install Python, Node, or Postgres directly — Docker handles all of that inside containers.

## Running it

Open **PowerShell** (or Git Bash) in the project folder and run:

```
docker compose up --build
```

First run will take a few minutes (downloading images, installing dependencies).

Once it's running:
- Frontend (the map UI): http://localhost:5173
- Backend API docs: http://localhost:8000/docs
- Postgres: available on localhost:5432 (user: `pineridge`, password: `pineridge_dev_password`, db: `pineridge`) — mainly useful if you want to inspect the DB directly with a tool like DBeaver or pgAdmin.

To stop everything: press `Ctrl+C` in that terminal, then run `docker compose down`.

## Seeding sample data

Once the containers are up, open a **second** PowerShell window in the project folder and run:

```
docker compose exec backend python seed.py
```

This inserts two sample plots/people so you have something to see on the map.
Edit `backend/seed.py` with your actual family's info and re-run it anytime
(safe to run multiple times — it just adds more rows).

## What's here so far

- `Plot` and `Person` database tables (see `backend/app/models.py`)
- `Relationship` and `DuaEntry` tables are already scaffolded for future features
- `GET /api/plots/` — list all plots + the people buried there
- `GET /api/plots/search/people?q=name` — search by name
- A Leaflet map using a **placeholder** cemetery image
  (`frontend/public/cemetery-map.svg`) — swap this file out once you have
  the real Pine Ridge site plan, and adjust `map_x`/`map_y` values
  (0-100 percentage across the image) for each plot to match.
- Clicking a pin shows the people buried there, with bio text if present.
- A basic name search box filters pins on the map.

## Next steps (roughly in order)

1. Replace the placeholder map with the real Pine Ridge site plan image.
2. Build a small internal admin page (or just edit via `/docs` for now) to
   add your family's real plots and people.
3. Add photo upload support for `Person.photo_url`.
4. Populate `Relationship` rows and build a "related graves" recommendation
   endpoint (e.g. `GET /api/people/{id}/related`).
5. Populate `DuaEntry` with a curated, tagged set of du'as and surface them
   on each person's page based on relationship type.
6. Generate QR codes per plot pointing to `https://yourdomain.com/plot/{id}`
   for physical placement at the graves.
7. Add authentication once you're ready to expand beyond your immediate family.
