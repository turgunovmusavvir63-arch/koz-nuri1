import CameraWorkspace from "@/components/CameraWorkspace";

export default function Home() {
  return <main className="app-shell">
    <header className="topbar">
      <a className="brand" href="/" aria-label="Ko‘zNuri AI bosh sahifa">
        <span className="brand-mark"><EyeIcon /></span>
        <span><strong>Ko‘zNuri <em>AI</em></strong><small>VISION ASSISTANT</small></span>
      </a>
      <div className="topbar-right">
        <span className="status-dot" /> <span className="status-text">MVP DEMO</span>
        <span className="version">v1.0</span>
      </div>
    </header>

    <section className="hero">
      <div className="eyebrow"><span className="eyebrow-line" /> INKLYUZIV TEXNOLOGIYA</div>
      <h1>Atrofingizni <span>ovoz orqali</span><br className="desktop-break" /> his qiling.</h1>
      <p className="hero-copy">Ko‘zNuri AI — kundalik hayotda ko‘mak beruvchi o‘zbek tilidagi aqlli ko‘rish yordamchisi.</p>
    </section>

    <CameraWorkspace />

    <section className="feature-strip" aria-label="Keyingi imkoniyatlar">
      <div className="feature-item"><span className="feature-icon">▤</span><div><strong>Matn o‘qish</strong><small>OCR — keyingi sprint</small></div></div>
      <div className="feature-item"><span className="feature-icon">◈</span><div><strong>So‘mni tanish</strong><small>AI model — keyingi sprint</small></div></div>
      <div className="feature-item"><span className="feature-icon">⌖</span><div><strong>Obyektlar</strong><small>Computer Vision — keyingi sprint</small></div></div>
    </section>

    <footer className="footer">
      <span>© 2026 Ko‘zNuri AI</span>
      <span>Inson uchun yaratilgan texnologiya.</span>
    </footer>
  </main>;
}

function EyeIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.4-6.2 9.5-6.2 9.5 6.2 9.5 6.2-3.4 6.2-9.5 6.2S2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3.1"/></svg>;
}
