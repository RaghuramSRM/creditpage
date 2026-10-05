// VIGIL AI — Animated Hero / Landing View

function BrainAnimation() {
  return (
    <div style={{ position: 'relative', width: 260, height: 260, margin: '0 auto' }}>
      {/* Pulsing rings */}
      {[1, 2, 3].map((i) => (
        <div key={i} style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          border: `1px solid rgba(56,189,248,${0.12 - i * 0.03})`,
          animation: `wave-pulse 3s ${i * 0.8}s ease-out infinite`,
        }} />
      ))}

      {/* Orbit rings */}
      <div style={{
        position: 'absolute', inset: 30,
        borderRadius: '50%',
        border: '1px dashed rgba(56,189,248,0.15)',
        animation: 'rotate-slow 12s linear infinite',
      }}>
        <div style={{ position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)', width: 8, height: 8, borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 12px #38bdf8' }} />
      </div>
      <div style={{
        position: 'absolute', inset: 60,
        borderRadius: '50%',
        border: '1px dashed rgba(129,140,248,0.2)',
        animation: 'rotate-slow 8s linear infinite reverse',
      }}>
        <div style={{ position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)', width: 6, height: 6, borderRadius: '50%', background: '#818cf8', boxShadow: '0 0 10px #818cf8' }} />
      </div>

      {/* Center brain SVG */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 120, height: 120, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(56,189,248,0.03) 70%, transparent 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 40px rgba(56,189,248,0.2), 0 0 80px rgba(56,189,248,0.08)',
          animation: 'pulse-glow 4s ease-in-out infinite',
        }}>
          <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
            <path d="M20 34C20 26 25 20 34 20C43 20 48 26 48 34C48 42 43 48 34 48" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" fill="none"/>
            <path d="M28 34C28 30 30.5 28 34 28C37.5 28 40 30 40 34C40 38 37.5 40 34 40" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            <circle cx="34" cy="34" r="4" fill="#38bdf8" opacity="0.8"/>
            <path d="M14 34h8M46 34h8" stroke="rgba(56,189,248,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M34 14v8M34 46v8" stroke="rgba(56,189,248,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M20 20L26 26M42 42L48 48" stroke="rgba(129,140,248,0.3)" strokeWidth="1" strokeLinecap="round"/>
            <path d="M48 20L42 26M26 42L20 48" stroke="rgba(129,140,248,0.3)" strokeWidth="1" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

function FeaturePill({ color, icon, text }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      background: `${color}0d`, border: `1px solid ${color}25`,
      borderRadius: 99, padding: '6px 14px',
    }}>
      <span style={{ fontSize: 13 }}>{icon}</span>
      <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{text}</span>
    </div>
  );
}

export default function HeroLanding({ onEnter }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden', padding: '40px 24px',
    }}>
      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        backgroundImage: 'linear-gradient(rgba(56,189,248,1) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
      }} />

      {/* Glow orbs */}
      <div style={{
        position: 'absolute', top: '15%', left: '20%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)',
        filter: 'blur(40px)',
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', right: '20%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(129,140,248,0.06) 0%, transparent 70%)',
        filter: 'blur(40px)',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', textAlign: 'center', maxWidth: 760 }}>
        {/* Badge */}
        <div className="animate-fade-in-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
          <div style={{
            background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)',
            borderRadius: 99, padding: '5px 14px', fontSize: 11, fontWeight: 600,
            color: '#38bdf8', letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            Precision Care Challenge 2026
          </div>
        </div>

        {/* Brain animation */}
        <div className="animate-fade-in delay-100 animate-float" style={{ marginBottom: 32 }}>
          <BrainAnimation />
        </div>

        {/* Title */}
        <div className="animate-fade-in-up delay-200">
          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 56, fontWeight: 800, lineHeight: 1.05,
            marginBottom: 8, letterSpacing: '-0.02em',
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #e2e8f0 0%, #7dd3fc 50%, #818cf8 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              VIGIL AI
            </span>
          </h1>
          <div style={{ fontSize: 18, color: '#64748b', marginBottom: 6, fontWeight: 400 }}>
            Equity-Aware Value-of-Information Engine
          </div>
          <div style={{ fontSize: 14.5, color: '#334155', letterSpacing: '0.04em' }}>
            Alzheimer's Diagnostic Escalation · Precision Care Challenge 2026
          </div>
        </div>

        {/* Tagline */}
        <p className="animate-fade-in-up delay-300" style={{
          marginTop: 20, fontSize: 15, color: '#475569', lineHeight: 1.8, maxWidth: 620, margin: '20px auto 0',
        }}>
          VIGIL AI does not simply predict who is at risk — it determines{' '}
          <strong style={{ color: '#7dd3fc' }}>who should be prioritized</strong>,{' '}
          <strong style={{ color: '#818cf8' }}>what test should come next</strong>, and{' '}
          <strong style={{ color: '#2dd4bf' }}>why</strong>.
        </p>

        {/* Feature pills */}
        <div className="animate-fade-in-up delay-400" style={{
          display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', margin: '28px auto',
        }}>
          <FeaturePill color="#38bdf8"  icon="🧠" text="Multi-stage Risk Scoring" />
          <FeaturePill color="#818cf8"  icon="⚡" text="Value-of-Information Engine" />
          <FeaturePill color="#2dd4bf"  icon="🔍" text="SHAP Explainability" />
          <FeaturePill color="#f472b6"  icon="⚖️" text="Equity-Aware Allocation" />
          <FeaturePill color="#fbbf24"  icon="🔬" text="4-Stage Diagnostic Pipeline" />
          <FeaturePill color="#34d399"  icon="👨‍⚕️" text="Clinician Decision-Support" />
        </div>

        {/* CTA */}
        <div className="animate-fade-in-up delay-500" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            id="enter-dashboard"
            onClick={onEnter}
            style={{
              background: 'linear-gradient(135deg, #0284c7, #0e7490)',
              border: 'none', borderRadius: 12,
              padding: '14px 32px', fontSize: 15, fontWeight: 700, color: '#fff',
              boxShadow: '0 0 30px rgba(2,132,199,0.35), 0 8px 25px rgba(0,0,0,0.4)',
              transition: 'all 0.25s ease',
              fontFamily: 'Space Grotesk, sans-serif',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 0 45px rgba(2,132,199,0.5), 0 12px 35px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(2,132,199,0.35), 0 8px 25px rgba(0,0,0,0.4)';
            }}
          >
            Enter Clinician Dashboard →
          </button>
        </div>

        {/* Non-diagnostic disclaimer */}
        <div className="animate-fade-in-up delay-600" style={{ marginTop: 28, fontSize: 11, color: '#1e3a5f' }}>
          Clinical Decision-Support Tool Only · Not a Diagnosis · Synthetic Data · Precision Care Challenge 2026
        </div>
      </div>
    </div>
  );
}
