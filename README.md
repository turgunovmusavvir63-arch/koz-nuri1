# Ko‘zNuri AI — Sprint 2 (OCR + Voice)

Sprint 2 kameradan olingan rasmni FastAPI backend'iga yuboradi, PaddleOCR yordamida matnni aniqlaydi va natijani Next.js interfeysida ko‘rsatadi. Foydalanuvchi natijani brauzer SpeechSynthesis orqali ovoz chiqarib tinglashi mumkin.

## Muhim imkoniyatlar

- Sprint 1 kamera preview va rasmga olish
- FastAPI OCR backend
- PaddleOCR Latin model
- OCR natijasini interfeysda ko‘rsatish
- Brauzer orqali natijani ovoz chiqarish va to‘xtatish
- Rasm turi va hajmi bo‘yicha server tekshiruvlari
- CORS sozlamasi

**Cheklov:** PaddleOCR `latin` modeli o‘zbek lotin yozuvidagi matnlar uchun boshlang‘ich model sifatida ishlatiladi. `O‘`, `G‘`, apostrof variantlari, kirill yozuvi, qo‘lyozma va sifatsiz suratlar uchun aniqlik kafolatlanmaydi. Real dataset bilan sinov va kerak bo‘lsa maxsus model moslashtirish talab qilinadi. O‘zbekcha ovoz mavjudligi foydalanuvchi qurilmasidagi brauzer/OS ovozlariga bog‘liq.

## 1. Frontend'ni lokal ishga tushirish

Node.js 18.17+ talab qilinadi.

```bash
npm install
```

`.env.example` faylidan `.env.local` nusxa yarating. Lokal backend uchun:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Keyin:

```bash
npm run dev
```

Frontend: http://localhost:3000

## 2. Backend'ni lokal ishga tushirish

Python 3.10 tavsiya qilinadi. Windows CMD'da loyiha papkasidan:

```bat
cd backend
py -3.10 -m venv .venv
.venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Linux/macOS:

```bash
cd backend
python3.10 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

PaddleOCR model fayllari birinchi ishga tushishda yuklanishi mumkin. Bu jarayon internet va disk joyi talab qiladi. PaddlePaddle CPU wheel mosligi operatsion tizim/CPU arxitekturasiga bog‘liq; o‘rnatishda xato bo‘lsa, backend deploy muhitini moslashtiring.

Backend tekshiruvi:
- http://127.0.0.1:8000/health
- http://127.0.0.1:8000/docs

## 3. GitHub Desktop orqali yangilash

1. Avval mavjud `koz-nuril` papkangizni backup qiling.
2. Ushbu ZIP'ni alohida papkaga Extract qiling.
3. ZIP ichidagi `app`, `components`, `backend` papkalari va root fayllarni mavjud `koz-nuril` repository papkasiga ko‘chiring va eski fayllar bilan almashtiring.
4. `node_modules`, `.next`, `.env.local`, `backend/.venv` papkalarini GitHub'ga yuklamang.
5. GitHub Desktop'da Changes tekshiring.
6. Summary: `Add Sprint 2 OCR and voice integration`
7. Commit to main → Push origin.

## 4. Backend'ni internetga chiqarish

Backend'ni Vercel frontend'dan alohida Python hosting xizmatiga deploy qiling (masalan, Render yoki Railway). Backend root directory sifatida `backend` ni belgilang.

- Build/install command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Python: 3.10
- Environment variable: `CORS_ORIGINS=https://koz-nuri.vercel.app`

Deploy yakunlangach, backend URL masalan `https://YOUR-BACKEND.example.com` bo‘ladi. Bu faqat namuna; hosting bergan haqiqiy URL'dan foydalaning.

## 5. Vercel frontend environment variable

Vercel → Project → Settings → Environment Variables:

`NEXT_PUBLIC_API_URL` = backend'ning haqiqiy HTTPS URL'i (oxirida slash qo‘ymang).

Production, Preview va Development kerakli muhitlariga qo‘shing. So‘ng yangi deployment qiling.

## 6. Demo sinovi

1. Saytni HTTPS orqali oching.
2. Kameraga ruxsat bering.
3. Yaxshi yorug‘likda, fokuslangan bosma matnni oling.
4. “Rasmdagi matnni aniqlash” tugmasini bosing.
5. OCR natijasini tekshiring.
6. “Matnni o‘qish” tugmasini bosing.

## Xavfsizlik va maxfiylik

Rasm OCR tahlili uchun backend serveriga yuboriladi. Hozirgi MVP rasmlarni doimiy saqlamaydi. Shunga qaramay, maxfiy hujjatlar yoki shaxsiy ma'lumotlar bilan demo sinovini o'tkazmang. Public deployment'dan oldin rate limiting, upload nazorati, logging siyosati va maxfiylik xabarnomasini qo‘shing.

## Keyingi ishlar

- O‘zbek lotin/kirill yozuvi bo‘yicha maxsus test to‘plami
- TTS uchun sifatli o‘zbek ovozini tanlash
- YOLO obyekt aniqlash
- So‘m kupyuralari uchun dataset va model
- Xavfsiz ishlash va real foydalanuvchilar bilan pilot sinov
