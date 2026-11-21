# Ko‘zNuri AI — FastAPI + PaddleOCR backend

IMPORTANT: The existing Render service shown in the previous deployment logs is a Node.js
service. Its runtime cannot be made into Docker merely by changing Build/Start commands.
Create a NEW Render Web Service and choose Docker.

## Render deployment (new service)

1. Push this project to GitHub (the `backend` folder must be in the repository root).
2. Render Dashboard → New → Web Service → connect this GitHub repository.
3. Set Root Directory to `backend`.
4. Select Docker as the runtime/environment (not Node).
5. Dockerfile Path: `./Dockerfile`.
6. Do not enter custom Build Command or Start Command. Let the Dockerfile handle both.
7. Add environment variable:
   CORS_ORIGINS = https://koz-nuri.vercel.app
8. Deploy. Wait for the Docker image build and service startup to finish.

Test:
- https://YOUR-NEW-SERVICE.onrender.com/health
- https://YOUR-NEW-SERVICE.onrender.com/docs

`/health` should return JSON with `ok: true`. `/docs` should show FastAPI Swagger UI.

## Vercel frontend

In Vercel → project → Settings → Environment Variables, set:
NEXT_PUBLIC_API_URL = https://YOUR-NEW-SERVICE.onrender.com

Do not append `/health`, `/docs`, `/api/ocr`, or a trailing slash.
Apply it to Production (and Preview if needed), then redeploy the frontend.

## API
- GET `/` and `/health`
- GET `/docs`
- POST `/api/ocr`, multipart field `file`; JPEG/PNG/WEBP, maximum 8 MB.

The OCR model is PaddleOCR Latin and is initialized on the first OCR request. The first request
can take longer while model files are downloaded. Uzbek apostrophe variants, Cyrillic,
handwriting, and poor-quality images require separate accuracy testing.
