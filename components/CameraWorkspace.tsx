"use client";

import { useEffect, useRef, useState } from "react";

type CameraState = "idle" | "starting" | "active" | "error";

export default function CameraWorkspace() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraState, setCameraState] = useState<CameraState>("idle");
  const [cameraError, setCameraError] = useState("");
  const [capturedImage, setCapturedImage] = useState("");
  const [announcement, setAnnouncement] = useState("Kamera ishga tushirilishini kutmoqda.");
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  async function startCamera() {
    setCameraError("");
    setCameraState("starting");
    setCapturedImage("");
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Bu brauzer kamera API'sini qo‘llab-quvvatlamaydi. HTTPS yoki localhost orqali oching.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraState("active");
      setAnnouncement("Kamera tayyor. Endi rasmga olishingiz mumkin.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Kamerani ishga tushirib bo‘lmadi.";
      setCameraError(message);
      setCameraState("error");
      setAnnouncement("Kamera ishga tushmadi.");
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraState("idle");
    setAnnouncement("Kamera to‘xtatildi.");
  }

  function capturePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth) {
      setCameraError("Rasm olishdan oldin kamerani ishga tushiring.");
      return;
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    setCapturedImage(canvas.toDataURL("image/jpeg", 0.88));
    setAnnouncement("Rasm muvaffaqiyatli olindi. Bu Sprint 1 versiyasida AI tahlili hali ulanmagan.");
  }

  function speak(text = announcement) {
    if (!("speechSynthesis" in window)) {
      setCameraError("Brauzeringiz ovoz chiqarish funksiyasini qo‘llab-quvvatlamaydi.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "uz-UZ";
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }

  return <section className="workspace" aria-label="Kamera ish maydoni">
    <div className="workspace-heading">
      <div><span className="section-kicker">01 / LIVE VISION</span><h2>Kamera maydoni</h2></div>
      <span className={`camera-pill ${cameraState}`}><i />{cameraState === "active" ? "Kamera faol" : cameraState === "starting" ? "Ulanmoqda..." : cameraState === "error" ? "Xatolik" : "Kamera o‘chiq"}</span>
    </div>

    <div className="workspace-grid">
      <div className="camera-card">
        <div className="camera-toolbar"><span><span className="tiny-live" /> LIVE PREVIEW</span><span>KO‘ZNURI / CAMERA</span></div>
        <div className="camera-stage">
          <video ref={videoRef} className={cameraState === "active" ? "video-visible" : "video-hidden"} playsInline muted />
          {cameraState !== "active" && <div className="camera-placeholder">
            <div className="camera-placeholder-icon"><CameraIcon /></div>
            <strong>{cameraState === "starting" ? "Kamera ulanmoqda" : "Kamera hali yoqilmagan"}</strong>
            <p>{cameraState === "error" ? "Brauzer ruxsatlarini tekshiring." : "Boshlash tugmasini bosing va kameraga ruxsat bering."}</p>
          </div>}
          <div className="viewfinder viewfinder-a" /><div className="viewfinder viewfinder-b" />
          <span className="stage-label">PREVIEW</span>
        </div>
        <canvas ref={canvasRef} className="hidden-canvas" />
        <div className="camera-actions">
          {cameraState === "active" ? <>
            <button className="button button-primary" onClick={capturePhoto}><CameraIcon /> Rasmga olish</button>
            <button className="button button-quiet" onClick={stopCamera}>To‘xtatish</button>
          </> : <button className="button button-primary" onClick={startCamera} disabled={cameraState === "starting"}><CameraIcon /> {cameraState === "starting" ? "Ulanmoqda..." : "Kamerani boshlash"}</button>}
        </div>
        {cameraError && <p className="error-message" role="alert">{cameraError}</p>}
      </div>

      <aside className="result-column">
        <div className="result-card">
          <div className="card-heading"><span className="section-kicker">02 / CAPTURE</span><span className="small-tag">IMAGE</span></div>
          <h3>Olingan rasm</h3>
          {capturedImage ? <img className="captured-image" src={capturedImage} alt="Kamera orqali olingan tasvir" /> :
            <div className="empty-image"><span>▧</span><small>Hozircha rasm yo‘q</small></div>}
          {capturedImage && <button className="text-button" onClick={() => { setCapturedImage(""); setAnnouncement("Rasm o‘chirildi."); }}>Rasmni o‘chirish</button>}
        </div>
        <div className="result-card voice-card">
          <div className="card-heading"><span className="section-kicker">03 / VOICE OUTPUT</span><span className="voice-wave">〰</span></div>
          <h3>Ovozli xabar</h3>
          <p className="announcement" aria-live="polite">{announcement}</p>
          <button className="button button-secondary full-button" onClick={() => speak()}><SpeakerIcon /> {speaking ? "O‘qilmoqda..." : "Ovoz chiqarish"}</button>
          <p className="micro-note">Ovoz brauzerning mavjud nutq sintezi orqali chiqariladi. O‘zbekcha ovoz mavjudligi qurilmaga bog‘liq.</p>
        </div>
      </aside>
    </div>
    <div className="demo-notice"><span>ⓘ</span><p><strong>Demo haqida:</strong> Hozircha kamera preview, rasmga olish va ovoz chiqarish ishlaydi. Rasmni AI orqali tanish OCR/YOLO integratsiyasi keyingi sprintda ulanadi. Bu prototip navigatsiya yoki xavfsizlik kafolati bermaydi.</p></div>
  </section>;
}

function CameraIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7.5h3l1.5-2h7l1.5 2h3a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-16A1.5 1.5 0 0 1 3.5 18v-9A1.5 1.5 0 0 1 5 7.5Z"/><circle cx="12" cy="13" r="3.5"/></svg>;
}
function SpeakerIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h4l5 4V6l-5 4H4Z"/><path d="M16 9a5 5 0 0 1 0 6M18.5 6.5a8.5 8.5 0 0 1 0 11"/></svg>;
}
