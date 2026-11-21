import os
from functools import lru_cache
from typing import Any

import cv2
import numpy as np
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from paddleocr import PaddleOCR

APP_NAME = "Ko‘zNuri AI OCR API"
MAX_FILE_BYTES = 8 * 1024 * 1024
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}

origins_env = os.getenv("CORS_ORIGINS", "*")
origins = ["*"] if origins_env.strip() == "*" else [x.strip() for x in origins_env.split(",") if x.strip()]

app = FastAPI(title=APP_NAME, version="1.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

@lru_cache(maxsize=1)
def get_ocr() -> PaddleOCR:
    # PaddleOCR's Latin recognition model covers many Latin-script languages.
    # Uzbek-specific letters and Cyrillic performance must be verified with real samples.
    return PaddleOCR(use_angle_cls=True, lang="latin", show_log=False)

@app.get("/")
def root():
    return {"ok": True, "service": APP_NAME, "docs": "/docs"}

@app.get("/health")
def health():
    return {"ok": True, "service": APP_NAME, "ocr_model": "PaddleOCR latin (lazy-loaded)"}

@app.post("/api/ocr")
async def read_text(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_TYPES:
        return JSONResponse(status_code=415, content={
            "ok": False, "text": "", "lines": [],
            "message": "Faqat JPG, PNG yoki WEBP rasm yuboring."
        })

    raw = await file.read()
    if not raw:
        return JSONResponse(status_code=400, content={
            "ok": False, "text": "", "lines": [], "message": "Yuborilgan rasm bo‘sh."
        })
    if len(raw) > MAX_FILE_BYTES:
        return JSONResponse(status_code=413, content={
            "ok": False, "text": "", "lines": [], "message": "Rasm hajmi 8 MB dan oshmasligi kerak."
        })

    image_array = np.frombuffer(raw, dtype=np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    if image is None:
        return JSONResponse(status_code=400, content={
            "ok": False, "text": "", "lines": [], "message": "Rasm faylini o‘qib bo‘lmadi."
        })

    try:
        result: Any = get_ocr().ocr(image, cls=True)
        lines = []
        if result and result[0]:
            for item in result[0]:
                if not item or len(item) < 2 or not item[1]:
                    continue
                recognized = str(item[1][0]).strip()
                confidence = float(item[1][1])
                if recognized:
                    lines.append({"text": recognized, "confidence": round(confidence, 4)})

        text = "\n".join(line["text"] for line in lines)
        return {"ok": True, "text": text, "lines": lines, "message": "Matn tahlili yakunlandi."}
    except Exception as exc:
        # Avoid exposing internal server details to public clients.
        print(f"OCR processing error: {type(exc).__name__}: {exc}")
        return JSONResponse(status_code=500, content={
            "ok": False, "text": "", "lines": [],
            "message": "OCR modelida xatolik yuz berdi. Server loglarini tekshiring."
        })
