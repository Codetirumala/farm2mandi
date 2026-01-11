```markdown
# farm-mandi

Farm2Mandi — AI-driven agricultural market recommendation system (scaffold).

This repository contains a minimal backend (Node + Express) and a Vite + React frontend scaffold. The backend includes stubbed endpoints for authentication, price prediction, mandi recommendation, transport options, and vehicle tracking. Replace the stubbed logic with your trained LSTM and XGBoost models and integrate logistics provider where noted.

## Quick start (Windows PowerShell)

Backend:

    cd backend
    npm install
    npm run dev

Frontend:

    cd frontend
    npm install
    npm run dev

The backend runs by default on port 5000. The frontend uses Vite (port 5173 by default). Update `VITE_API_BASE` in a `.env` file in `frontend/` if your backend runs on a different host/port.

## What I scaffolded

- `backend/` - Express API with routes in `routes/` and a simple `users.json` store. See `backend/README.md` for details.
- `frontend/` - Vite + React app with pages: Welcome, Register, Login, Forgot, Input, Prediction, Recommendation, Map placeholder, Transport, Tracking, About.

## Next steps

- Wire your trained LSTM model into `backend/routes/predict.js` to return real predictions.
- Replace stubbed XGBoost ranking logic with your model and add geospatial distance calculations.
- Integrate a proper database (Postgres/Mongo) instead of `users.json`.
- Add map integration (react-leaflet or Google Maps) in `frontend/src/pages/MapView.jsx`.

Enjoy! If you want, I can now run `npm install` for backend and start it here, or scaffold a `Dockerfile`/CI for the project.

```
# farm-mandi