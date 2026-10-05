// Diagnostic Pipeline View — 4-Stage Visual Escalation Tracker

const STAGE_META = [
  {
    stage: 0,
    label: 'Stage 1',
    title: 'Cognitive Screening',
    color: '#38bdf8',
    bgColor: 'rgba(56,189,248,0.08)',
    border: 'rgba(56,189,248,0.25)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
      </svg>
    ),
    inputs: ['MoCA / MMSE', 'FAQ — Functional Activities', 'CDR-SB', 'Comorbidity Profile', 'Demographic Factors'],
    outputs: ['Initial Risk Score (0–100)', 'Priority Category (High / Medium / Low)', 'VoI Test Recommendation'],
    escalation: 'Score ≥ 40 → Blood Biomarker Panel',
    desc: 'Population-level cognitive screening establishes baseline risk. VIGIL AI generates an initial priority score and determines whether the expected information gain from blood biomarker testing justifies escalation.',
  },
  {
    stage: 1,
    label: 'Stage 2',
    title: 'Blood Biomarkers',
    color: '#818cf8',
    bgColor: 'rgba(129,140,248,0.08)',
    border: 'rgba(129,140,248,0.25)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 11a2 2 0 1 1-4 0 4 4 0 0 1 4-4"/>
        <path d="M6 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8L12 2z"/>
      </svg>
    ),
    inputs: ['Plasma p-tau217', 'Plasma p-tau181', 'Aβ42/Aβ40 Ratio', 'NfL (Neurofilament Light)', 'GFAP'],
    outputs: ['Refined Risk Score', 'Amyloid/Tau Pathology Probability', 'Updated VoI Ranking'],
    escalation: 'Score ≥ 55 + p-tau217 > 0.30 → Structural MRI',
    desc: 'Non-invasive plasma biomarkers refine the amyloid/tau pathology estimate. Abnormal p-tau217 and low Aβ42/40 significantly increase the VoI of structural MRI, justifying resource escalation.',
  },
  {
    stage: 2,
    label: 'Stage 3',
    title: 'Structural MRI',
    color: '#2dd4bf',
    bgColor: 'rgba(45,212,191,0.08)',
    border: 'rgba(45,212,191,0.25)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="3"/>
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 8v-2M12 18v-2M8 12H6M18 12h-2"/>
      </svg>
    ),
    inputs: ['Hippocampal Volume (percentile)', 'Entorhinal Cortex Thickness', 'Brain Age Gap Index', 'WML Volume', 'Entorhinal Atrophy'],
    outputs: ['Neurodegeneration Confirmation', 'Updated Score', 'PET Eligibility Assessment'],
    escalation: 'Score ≥ 70 + Hippocampal %ile < 15 → PET Scan',
    desc: 'Structural MRI volumetrics detect neurodegeneration patterns characteristic of Alzheimer\'s disease. Hippocampal atrophy below the 10th percentile combined with high plasma tau provides the strongest clinical signal for PET escalation.',
  },
  {
    stage: 3,
    label: 'Stage 4',
    title: 'PET Scan & DMT',
    color: '#f472b6',
    bgColor: 'rgba(244,114,182,0.08)',
    border: 'rgba(244,114,182,0.25)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    inputs: ['Amyloid PET SUVR / Centiloid', 'Tau Braak Stage', 'FDG-PET Hypometabolism Pattern', 'DMT Eligibility Criteria'],
    outputs: ['Molecular Confirmation', 'Diagnostic Certainty Score', 'Anti-Amyloid mAb Eligibility (Lecanemab/Donanemab)'],
    escalation: 'PET-positive + Eligible → Specialist Neurology Referral + DMT Pathway',
    desc: 'Amyloid and tau PET imaging provide definitive molecular confirmation and determine whether a patient meets criteria for disease-modifying therapy. Only high-priority patients with confirmed neurodegeneration are escalated to this resource-intensive stage.',
  },
];

function StageCard({ meta, patients, onSelectPatient, isActive }) {
  const inStage = patients.filter(p => p.currentStage === meta.stage);
  const high = inStage.filter(p => p.category === 'High');

  return (
    <div
      style={{
        background: isActive ? meta.bgColor : 'rgba(255,255,255,0.02)',
        border: `1px solid ${isActive ? meta.border : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 16,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        transition: 'all 0.3s ease',
        flex: 1,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10, flexShrink: 0,
          background: `${meta.color}18`,
          border: `1px solid ${meta.color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: meta.color,
        }}>
          {meta.icon}
        </div>
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: meta.color, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 2 }}>
            {meta.label}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0' }}>{meta.title}</div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 24, fontWeight: 800, color: meta.color, lineHeight: 1 }}>
            {inStage.length}
          </div>
          <div style={{ fontSize: 10, color: '#475569' }}>patients</div>
        </div>
      </div>

      {/* Description */}
      <div style={{ fontSize: 11.5, color: '#475569', lineHeight: 1.65 }}>{meta.desc}</div>

      <div className="divider" />

      {/* Inputs / Outputs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: '#334155', textTransform: 'uppercase', marginBottom: 6 }}>Inputs</div>
          {meta.inputs.map(i => (
            <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: 4 }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: meta.color, marginTop: 5, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: '#64748b' }}>{i}</span>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: '#334155', textTransform: 'uppercase', marginBottom: 6 }}>Outputs</div>
          {meta.outputs.map(o => (
            <div key={o} style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: 4 }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#38bdf8', marginTop: 5, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: '#64748b' }}>{o}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Escalation rule */}
      <div style={{
        background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 8, padding: '8px 12px', fontSize: 11, color: '#334155',
      }}>
        <span style={{ color: '#38bdf8', fontWeight: 600 }}>→ Escalation: </span>
        {meta.escalation}
      </div>

      {/* Patients in this stage */}
      {inStage.length > 0 && (
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: '#334155', textTransform: 'uppercase', marginBottom: 6 }}>
            Patients at this stage
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 160, overflowY: 'auto' }}>
            {inStage.slice(0, 6).map(p => {
              const col = p.category === 'High' ? '#fb7185' : p.category === 'Medium' ? '#fbbf24' : '#34d399';
              return (
                <button
                  key={p.id}
                  id={`pipeline-patient-${p.id}`}
                  onClick={() => onSelectPatient(p)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: 6, padding: '5px 10px', textAlign: 'left',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                >
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: col, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#64748b' }}>{p.id}</span>
                  <span style={{ fontSize: 11, color: col, marginLeft: 'auto' }}>{p.score}</span>
                </button>
              );
            })}
            {inStage.length > 6 && (
              <div style={{ fontSize: 10, color: '#334155', textAlign: 'center', paddingTop: 4 }}>
                +{inStage.length - 6} more
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Flow arrow
function Arrow() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', flexShrink: 0 }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M5 12H19M13 6l6 6-6 6" stroke="rgba(56,189,248,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

export default function DiagnosticPipelineView({ patients, onSelectPatient }) {
  const stageCounts = [0, 1, 2, 3].map(s => patients.filter(p => p.currentStage === s).length);
  const totalInPipeline = patients.length;

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Intro */}
      <div className="animate-fade-in-up" style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#e2e8f0', fontFamily: 'Space Grotesk, sans-serif' }}>
            4-Stage Diagnostic Escalation Pipeline
          </h1>
        </div>
        <div style={{ fontSize: 13.5, color: '#475569', maxWidth: 780, lineHeight: 1.7 }}>
          The VIGIL AI sequential escalation framework ensures that only patients with sufficient
          clinical justification progress to resource-intensive diagnostic tests. Each stage gate
          is controlled by the Value-of-Information engine, which quantifies the expected reduction
          in diagnostic uncertainty before recommending escalation.
        </div>
      </div>

      {/* Pipeline funnel stat bar */}
      <div className="glass-card animate-fade-in-up delay-200" style={{ padding: '16px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 0 }}>
        {stageCounts.map((count, i) => {
          const meta = STAGE_META[i];
          const pct = Math.round((count / totalInPipeline) * 100);
          return (
            <div key={i} style={{ flex: 1, borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none', padding: '0 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: meta.color }} />
                <span style={{ fontSize: 10, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{meta.label}</span>
              </div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 22, fontWeight: 800, color: meta.color }}>{count}</div>
              <div style={{ fontSize: 10, color: '#475569' }}>{pct}% of cohort</div>
              <div style={{ marginTop: 6, height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: meta.color, borderRadius: 2, opacity: 0.7 }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Stage cards */}
      <div className="animate-fade-in-up delay-300" style={{ display: 'flex', alignItems: 'stretch', gap: 0, overflowX: 'auto', paddingBottom: 8 }}>
        {STAGE_META.map((meta, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 260 }}>
            <StageCard meta={meta} patients={patients} onSelectPatient={onSelectPatient} isActive />
            {i < STAGE_META.length - 1 && <Arrow />}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="animate-fade-in-up delay-400" style={{ marginTop: 20, fontSize: 11, color: '#1e3a5f', textAlign: 'center' }}>
        Click any patient ID to view full detail. Escalation decisions are generated by the VoI engine and require clinician review before action.
      </div>
    </div>
  );
}
