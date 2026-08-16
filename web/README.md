# CareApp Web

Greenfield React + TypeScript frontend for Caring Angels Homecare.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- React Router

## Run

```bash
# Terminal 1 — backend
cd Backend
uvicorn main:app --reload

# Terminal 2 — frontend
cd web
npm install
npm run dev
```

Open http://localhost:5173

- `/` — marketing homepage
- `/login` — sign in (admin / caregiver / client)
- `/admin` — admin portal (protected)

Copy `.env.example` to `.env` if you need to change the API URL (default `http://127.0.0.1:8000`).

## Structure

```
src/
  components/   # shared UI + layouts
  contexts/     # auth
  features/     # pages by domain
  services/     # API layer
  types/        # TypeScript types
```

## Admin pages (v1)

| Route | Status |
|-------|--------|
| Dashboard | Live stats for clients/caregivers; shift stats when API exists |
| Activities | Full CRUD |
| Caregivers | Full CRUD |
| Clients | Full CRUD + care team modal |
| Shifts | Placeholder |
| Users | Placeholder |
| Settings | Placeholder |

Brand tokens (navy, red, cream) come from the Figma marketing homepage design.
