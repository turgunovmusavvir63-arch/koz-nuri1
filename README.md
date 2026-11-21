# Ko‘zNuri AI — Sprint 2 (OCR + Voice)

This project contains a Next.js camera frontend and a FastAPI + PaddleOCR backend.

## Frontend (Vercel)
- Build: `npm install` then `npm run build`
- Set `NEXT_PUBLIC_API_URL` to the deployed FastAPI service base URL, e.g.
  `https://YOUR-NEW-SERVICE.onrender.com` (no path and no trailing slash).
- Redeploy after changing the environment variable.

## Backend (Render)
The backend must run as a **new Docker Web Service**. The old Render service in the
previous logs was detected as Node.js; changing its commands does not convert its runtime.

1. Render → New → Web Service → connect this repository.
2. Root Directory: `backend`
3. Runtime/Environment: Docker
4. Dockerfile Path: `./Dockerfile`
5. Leave custom Build Command and Start Command unset.
6. Environment variable: `CORS_ORIGINS=https://koz-nuri.vercel.app`
7. Deploy and test `/health` and `/docs`.

Detailed instructions: `backend/README-RENDER.md`.

## Local development
Frontend:
```bash
npm install
npm run dev
```
Create `.env.local` with `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000`.

Backend:
```bash
cd backend
python -m pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

## Limitations
PaddleOCR Latin is an initial OCR model. Uzbek-specific apostrophes, Cyrillic, handwriting,
and low-quality images need real sample testing. Browser Uzbek speech availability depends
on the user's device and installed voices. This prototype is not a certified navigation or
safety system.
