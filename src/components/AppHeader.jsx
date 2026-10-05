import { useState, useEffect } from 'react';

// Animated wave/pulse effect behind the VIGIL logo
const BrainWaveIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="18" r="17" stroke="rgba(56,189,248,0.25)" strokeWidth="1"/>
    <circle cx="18" cy="18" r="10" stroke="rgba(56,189,248,0.4)" strokeWidth="1"/>
    <path d="M10 18 C10 13 13 10 18 10 C23 10 26 13 26 18 C26 23 23 26 18 26" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <path d="M14 18 C14 15.5 15.8 14 18 14 C20.2 14 22 15.5 22 18" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <circle cx="18" cy="18" r="2.5" fill="#38bdf8"/>
    <path d="M6 18h4M26 18h4" stroke="rgba(56,189,248,0.5)" strokeWidth="1" strokeLinecap="round"/>
    <path d="M18 6v4M18 26v4" stroke="rgba(56,189,248,0.5)" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

const AlertPulse = () => (
  <span className="relative flex h-2 w-2">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-60"></span>
    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
  </span>
);

export default function AppHeader({ activeView, setActiveView, cohortStats }) {
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    const tick = setInterval(() => setTime(new Date()), 30000);
    return () => { window.removeEventListener('scroll', onScroll); clearInterval(tick); };
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Patient Queue' },
    { id: 'pipeline', label: 'Diagnostic Pipeline' },
    { id: 'capacity', label: 'Resource Optimizer' },
    { id: 'ethics', label: 'Safety & Ethics' },
  ];

  return (
    <>
      {/* ── Non-diagnostic disclaimer bar ── */}
      <div className="disclaimer-bar no-select" role="banner">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <span>
          <strong>CLINICAL DECISION-SUPPORT TOOL ONLY</strong> — VIGIL AI does not diagnose, prescribe, or replace clinician judgment.
          All recommendations require qualified clinician review before action.
        </span>
        <span style={{ marginLeft: 'auto', opacity: 0.7 }}>
          PRECISION CARE CHALLENGE 2026 · Prototype Build · Synthetic Data Only
        </span>
      </div>

      {/* ── Main Header ── */}
      <header
        style={{
          background: scrolled
            ? 'rgba(4,11,26,0.96)'
            : 'transparent',
          borderBottom: scrolled ? '1px solid rgba(56,189,248,0.12)' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          transition: 'all 0.3s ease',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          padding: '0 28px',
        }}
      >
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 20, height: 64 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <BrainWaveIcon />
            <div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 20, letterSpacing: '0.06em', color: '#e2e8f0' }}>
                VIGIL <span style={{ color: '#38bdf8' }}>AI</span>
              </div>
              <div style={{ fontSize: 9, letterSpacing: '0.14em', color: 'rgba(148,163,184,0.7)', textTransform: 'uppercase', marginTop: -2 }}>
                Alzheimer's Diagnostic Engine
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 28 }}>
            {navItems.map(item => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveView(item.id)}
                style={{
                  background: activeView === item.id ? 'rgba(56,189,248,0.1)' : 'transparent',
                  border: activeView === item.id ? '1px solid rgba(56,189,248,0.3)' : '1px solid transparent',
                  color: activeView === item.id ? '#7dd3fc' : '#94a3b8',
                  borderRadius: 8,
                  padding: '6px 14px',
                  fontSize: 13,
                  fontWeight: activeView === item.id ? 600 : 400,
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  if (activeView !== item.id) e.currentTarget.style.color = '#cbd5e1';
                }}
                onMouseLeave={e => {
                  if (activeView !== item.id) e.currentTarget.style.color = '#94a3b8';
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Stats strip */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 18 }}>
            {cohortStats && (
              <>
                <StatChip label="Screened" value={cohortStats.total} color="#94a3b8" />
                <StatChip label="High Priority" value={cohortStats.high} color="#fb7185" dot />
                <StatChip label="PET Queue" value={cohortStats.petQueue} color="#fbbf24" />
              </>
            )}

            {/* Clock */}
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 12,
              color: 'rgba(148,163,184,0.6)',
              borderLeft: '1px solid rgba(255,255,255,0.06)',
              paddingLeft: 16,
            }}>
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

function StatChip({ label, value, color, dot }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {dot && <AlertPulse />}
      <div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 15, fontWeight: 700, color, lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ fontSize: 9, letterSpacing: '0.1em', color: 'rgba(148,163,184,0.55)', textTransform: 'uppercase', marginTop: 1 }}>
          {label}
        </div>
      </div>
    </div>
  );
}
