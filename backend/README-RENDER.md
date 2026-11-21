# Ko‘zNuri AI — Render backend

This backend is intended to run as a **Render Docker Web Service**. Do not deploy this
PaddleOCR backend as a Vercel serverless function: its dependencies exceed Vercel's
500 MB function bundle limit.

## Render setup

1. Push the contents of this `backend` folder to GitHub.
2. In Render, create **New → Web Service** and connect the `koz-nuril` repository.
3. Set **Root Directory** to `backend`.
4. Choose **Docker** as the runtime/environment.
5. Create the service. Render will build `Dockerfile` and start FastAPI.
6. After deployment, test `https://YOUR-RENDER-SERVICE.onrender.com/health`.

Expected health response:

```json
{
  "ok": true,
  "service": "Ko‘zNuri AI OCR API",
  "ocr_model": "PaddleOCR latin (lazy-loaded)"
}
```

## Environment variables

Set `CORS_ORIGINS` in Render to the exact frontend origin, for example:

`https://koz-nuri.vercel.app`

For a comma-separated allowlist, use:

`https://koz-nuri.vercel.app,https://www.example.com`

For a temporary demo only, leaving it unset allows `*`.

## API

- `GET /health` — checks that the API process is running. It does not load OCR weights.
- `POST /api/ocr` — multipart form upload with field name `file`; accepts JPEG, PNG, WEBP up to 8 MB.
- `GET /docs` — interactive API documentation.

The first OCR request may be slower because PaddleOCR downloads its model files on first use.
The model uses PaddleOCR's Latin model; Uzbek special letters, Cyrillic, and handwriting need
separate real-world accuracy testing.

## Important

- The Docker image is based on Python 3.10 to align with the pinned PaddlePaddle 2.6.2 package.
- `runtime.txt`, `.python-version`, and `Procfile` are intentionally not used for this Docker deployment.
- This package only replaces the backend folder. Keep your Next.js frontend project unchanged.
