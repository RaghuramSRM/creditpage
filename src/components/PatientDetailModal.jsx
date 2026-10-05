import { useState, useEffect, useRef } from 'react';
import { calcRiskScore, getCategory, computeVoI, computeEquityBarrier, simulateWhatIf } from '../utils/prioritizationEngine';

// ── Color helpers ──────────────────────────────────────────────
const catColor = { High: '#fb7185', Medium: '#fbbf24', Low: '#34d399' };
const catBg    = { High: 'rgba(251,113,133,0.12)', Medium: 'rgba(251,191,36,0.10)', Low: 'rgba(52,211,153,0.10)' };
const catBorder= { High: 'rgba(251,113,133,0.35)', Medium: 'rgba(251,191,36,0.35)', Low: 'rgba(52,211,153,0.3)' };

const stageMeta = [
  { label: 'Cognitive Screening', color: '#38bdf8',  icon: '🧠' },
  { label: 'Blood Biomarkers',    color: '#818cf8',  icon: '🩸' },
  { label: 'Structural MRI',      color: '#2dd4bf',  icon: '🔬' },
  { label: 'PET Scan',            color: '#f472b6',  icon: '⚡' },
];

// ── SHAP Explainability Radar ──────────────────────────────────
function ExplainabilityPanel({ shapFactors }) {
  if (!shapFactors?.length) return null;
  const dirColor = { risk: '#fb7185', mild: '#fbbf24', protective: '#34d399' };

  return (
    <div>
      <SectionTitle icon="⚡" label="Explainability — SHAP Factor Attribution" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {shapFactors.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 130, fontSize: 11.5, color: '#94a3b8', flexShrink: 0, textAlign: 'right' }}>
              {f.factor}
            </div>
            <div style={{ fontSize: 11, color: dirColor[f.direction], fontFamily: 'JetBrains Mono, monospace', width: 70, flexShrink: 0 }}>
              {f.value}
            </div>
            <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                width: `${Math.min(100, f.contribution)}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${dirColor[f.direction]}99, ${dirColor[f.direction]})`,
                borderRadius: 4,
                transition: 'width 0.8s ease',
              }} />
            </div>
            <div style={{ width: 38, textAlign: 'right', fontSize: 11, color: dirColor[f.direction], fontFamily: 'JetBrains Mono, monospace' }}>
              {f.contribution.toFixed(0)}%
            </div>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: dirColor[f.direction], flexShrink: 0 }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
        {[['risk', 'Increases risk'],['mild', 'Mild concern'],['protective','Protective']].map(([d,l]) => (
          <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#475569' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: dirColor[d] }}/>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Biomarker Table ────────────────────────────────────────────
function BiomarkerTable({ biomarkers }) {
  if (!biomarkers) return (
    <div style={{ padding: '14px 0', color: '#334155', fontSize: 13, textAlign: 'center' }}>
      No plasma biomarker data available
    </div>
  );

  const rows = [
    { name: 'p-tau217', value: `${biomarkers.ptau217} pg/mL`, ref: '< 0.30', risk: biomarkers.ptau217 > 0.45, mild: biomarkers.ptau217 > 0.30 },
    { name: 'p-tau181', value: `${biomarkers.ptau181} pg/mL`, ref: '< 1.8',  risk: biomarkers.ptau181 > 2.5, mild: biomarkers.ptau181 > 1.8 },
    { name: 'Aβ42/Aβ40', value: biomarkers.ab4240, ref: '> 0.080', risk: biomarkers.ab4240 < 0.057, mild: biomarkers.ab4240 < 0.080 },
    { name: 'NfL', value: `${biomarkers.nfl} pg/mL`, ref: '< 14.0', risk: biomarkers.nfl > 22, mild: biomarkers.nfl > 14 },
    { name: 'GFAP', value: `${biomarkers.gfap} pg/mL`, ref: '< 150', risk: biomarkers.gfap > 200, mild: biomarkers.gfap > 150 },
  ];
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {['Biomarker','Value','Reference','Flag'].map(h => (
            <th key={h} style={{ padding: '6px 10px', textAlign: 'left', fontSize: 10, color: '#334155', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => {
          const col = r.risk ? '#fb7185' : r.mild ? '#fbbf24' : '#34d399';
          return (
            <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <td style={{ padding: '8px 10px', fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>{r.name}</td>
              <td style={{ padding: '8px 10px', fontSize: 13, fontFamily: 'JetBrains Mono, monospace', color: col, fontWeight: 600 }}>{r.value}</td>
              <td style={{ padding: '8px 10px', fontSize: 12, color: '#475569', fontFamily: 'JetBrains Mono, monospace' }}>{r.ref}</td>
              <td style={{ padding: '8px 10px' }}>
                <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: `${col}18`, border: `1px solid ${col}40`, color: col, fontWeight: 600 }}>
                  {r.risk ? '⚠ Elevated' : r.mild ? '△ Borderline' : '✓ Normal'}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// ── MRI Panel ─────────────────────────────────────────────────
function MRIPanel({ mri }) {
  if (!mri) return (
    <div style={{ padding: '14px 0', color: '#334155', fontSize: 13, textAlign: 'center' }}>
      No structural MRI data available
    </div>
  );
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      <MRIMetric label="Hippocampal Volume" value={`${mri.hippocampalPctile}th percentile`} risk={mri.hippocampalPctile < 10} mild={mri.hippocampalPctile < 20} />
      <MRIMetric label="Brain Age Gap" value={`+${mri.brainAgeGap} years`} risk={mri.brainAgeGap > 7} mild={mri.brainAgeGap > 4} />
      <MRIMetric label="Entorhinal Thickness" value={`${mri.entorhinalThickness} mm`} risk={mri.entorhinalThickness < 2.5} mild={mri.entorhinalThickness < 3.0} />
      <MRIMetric label="Entorhinal Atrophy" value={mri.entorhinalAtrophy ? 'Present' : 'Absent'} risk={mri.entorhinalAtrophy} />
      <MRIMetric label="WML Volume" value={`${mri.wmlVolume} mL`} risk={mri.wmlVolume > 18} mild={mri.wmlVolume > 10} />
    </div>
  );
}
function MRIMetric({ label, value, risk, mild }) {
  const col = risk ? '#fb7185' : mild ? '#fbbf24' : '#34d399';
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '10px 14px' }}>
      <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: col, fontFamily: 'JetBrains Mono, monospace' }}>{value}</div>
    </div>
  );
}

// ── PET Panel ─────────────────────────────────────────────────
function PETPanel({ pet }) {
  if (!pet) return (
    <div style={{ padding: '14px 0', color: '#334155', fontSize: 13, textAlign: 'center' }}>
      No PET data available — patient not yet escalated to Stage 4
    </div>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <MRIMetric label="Amyloid Centiloid" value={`${pet.amyloidCentiloid} CL`} risk={pet.amyloidCentiloid > 70} mild={pet.amyloidCentiloid > 30} />
        <MRIMetric label="Amyloid SUVR" value={pet.suvr} risk={pet.suvr > 1.8} mild={pet.suvr > 1.4} />
        <MRIMetric label="Tau Braak Stage" value={`Stage ${pet.tauBraakStage}`} risk={pet.tauBraakStage >= 4} mild={pet.tauBraakStage === 3} />
        <MRIMetric label="FDG Hypometabolism" value={pet.fdgHypometabolism ? 'Present' : 'Absent'} risk={pet.fdgHypometabolism} />
      </div>
      <div style={{
        background: pet.dmtEligible ? 'rgba(52,211,153,0.08)' : 'rgba(251,113,133,0.08)',
        border: `1px solid ${pet.dmtEligible ? 'rgba(52,211,153,0.3)' : 'rgba(251,113,133,0.25)'}`,
        borderRadius: 10, padding: '12px 16px',
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: pet.dmtEligible ? '#34d399' : '#fb7185', marginBottom: 4 }}>
          {pet.dmtEligible ? '✓ DMT Eligible' : '✗ DMT Not Currently Indicated'}
        </div>
        <div style={{ fontSize: 11.5, color: '#64748b' }}>
          {pet.dmtEligible
            ? 'Patient meets amyloid/tau biomarker criteria for anti-amyloid immunotherapy consideration (Lecanemab/Donanemab). Refer to neurology specialist for full eligibility assessment.'
            : 'Current molecular profile does not meet threshold for anti-amyloid DMT candidacy. Continue monitoring and reassess at next follow-up.'}
        </div>
      </div>
    </div>
  );
}

// ── What-If Simulator ──────────────────────────────────────────
function WhatIfSimulator({ patient }) {
  const [moca, setMoca] = useState(patient.moca);
  const [hasBiomarkers, setHasBiomarkers] = useState(!!patient.biomarkers);
  const [ptau217, setPtau217] = useState(patient.biomarkers?.ptau217 ?? 0.25);
  const [ab4240, setAb4240]   = useState(patient.biomarkers?.ab4240  ?? 0.09);
  const [hasMRI, setHasMRI]   = useState(!!patient.mri);
  const [hippPctile, setHippPctile] = useState(patient.mri?.hippocampalPctile ?? 30);

  const simResult = simulateWhatIf(patient, {
    moca,
    biomarkers: hasBiomarkers ? { ...patient.biomarkers, ptau217, ab4240 } : null,
    mri: hasMRI ? { ...patient.mri, hippocampalPctile: hippPctile } : null,
  });

  const deltaColor = simResult.delta > 0 ? '#fb7185' : simResult.delta < 0 ? '#34d399' : '#94a3b8';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
        Modify patient evidence below to observe how priority score and VoI test recommendation change. This is for exploratory clinical use only.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {/* MoCA */}
        <WhatIfSlider label="MoCA Score" value={moca} min={10} max={30} step={1}
          onChange={setMoca} unit="" color="#38bdf8" />

        {/* Toggle biomarkers */}
        <WhatIfToggle label="Add Biomarker Data" value={hasBiomarkers} onChange={setHasBiomarkers} />

        {hasBiomarkers && <>
          <WhatIfSlider label="p-tau217 (pg/mL)" value={ptau217} min={0.05} max={1.0} step={0.01}
            onChange={v => setPtau217(parseFloat(v))} unit=" pg/mL" color="#818cf8" />
          <WhatIfSlider label="Aβ42/Aβ40 Ratio" value={ab4240} min={0.02} max={0.14} step={0.001}
            onChange={v => setAb4240(parseFloat(v))} unit="" color="#818cf8" />
        </>}

        <WhatIfToggle label="Add MRI Data" value={hasMRI} onChange={setHasMRI} />
        {hasMRI && (
          <WhatIfSlider label="Hippocampal Volume (%ile)" value={hippPctile} min={1} max={80} step={1}
            onChange={v => setHippPctile(parseInt(v))} unit="th %ile" color="#2dd4bf" />
        )}
      </div>

      {/* Result card */}
      <div style={{
        background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10, padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Simulated Score</div>
          <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace', color: catColor[simResult.category], lineHeight: 1 }}>
            {simResult.score}
            <span style={{ fontSize: 14, color: deltaColor, marginLeft: 8, fontWeight: 600 }}>
              {simResult.delta > 0 ? '+' : ''}{simResult.delta}
            </span>
          </div>
          <div style={{ fontSize: 12, color: catColor[simResult.category], marginTop: 4 }}>{simResult.category} Priority</div>
        </div>
        <div style={{ borderLeft: '1px solid rgba(255,255,255,0.07)', paddingLeft: 20 }}>
          <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>VoI Next Test</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#7dd3fc' }}>{simResult.voiRecommendation.test}</div>
          <div style={{ fontSize: 11, color: '#475569', marginTop: 3 }}>
            Expected gain: <span style={{ color: '#38bdf8', fontFamily: 'JetBrains Mono' }}>{Math.round(simResult.voiRecommendation.voiGain * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function WhatIfSlider({ label, value, min, max, step, onChange, unit, color }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 11.5, color: '#64748b' }}>{label}</span>
        <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color }}>{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width: '100%', accentColor: color, cursor: 'pointer' }}
      />
    </div>
  );
}
function WhatIfToggle({ label, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 12px' }}>
      <span style={{ fontSize: 12, color: '#64748b' }}>{label}</span>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 36, height: 20, borderRadius: 10, border: 'none',
          background: value ? '#0284c7' : 'rgba(255,255,255,0.1)',
          position: 'relative', transition: 'background 0.2s ease',
        }}
      >
        <div style={{
          position: 'absolute', top: 3, left: value ? 18 : 3,
          width: 14, height: 14, borderRadius: '50%', background: '#fff',
          transition: 'left 0.2s ease',
        }} />
      </button>
    </div>
  );
}

// ── Section title helper ───────────────────────────────────────
function SectionTitle({ icon, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#38bdf8' }}>{label}</span>
    </div>
  );
}

// ── VoI Panel ─────────────────────────────────────────────────
function VoIPanel({ patient }) {
  const voi = computeVoI(patient, patient.score);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Recommended */}
      <div style={{
        background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.2)',
        borderRadius: 10, padding: '14px 16px',
      }}>
        <div style={{ fontSize: 10, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6, fontWeight: 700 }}>
          ★ Recommended Next Test
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#7dd3fc', marginBottom: 4 }}>{voi.recommended.test}</div>
        <div style={{ fontSize: 11.5, color: '#64748b', lineHeight: 1.6 }}>{voi.recommended.rationale}</div>
        <div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
          <KV label="Expected Info Gain" value={`${Math.round(voi.recommended.voiGain * 100)}%`} color="#38bdf8" />
          <KV label="Estimated Cost" value={`$${voi.recommended.cost?.toLocaleString() ?? '—'}`} color="#94a3b8" />
          <KV label="Est. Wait" value={`${voi.recommended.waitDays ?? '—'} days`} color="#94a3b8" />
          {voi.recommended.distanceKm && <KV label="Distance" value={`${voi.recommended.distanceKm} km`} color="#fbbf24" />}
        </div>
      </div>

      {/* All tests ranked */}
      {voi.all.length > 1 && (
        <div>
          <div style={{ fontSize: 10, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            All Available Tests — by Expected Information Gain
          </div>
          {voi.all.map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 100, fontSize: 12, color: '#64748b' }}>{t.test}</div>
              <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${Math.round(t.voiGain * 100)}%`, height: '100%', background: i === 0 ? '#38bdf8' : '#334155', borderRadius: 4 }} />
              </div>
              <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: i === 0 ? '#38bdf8' : '#475569', width: 36 }}>
                {Math.round(t.voiGain * 100)}%
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function KV({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize: 9, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: color || '#e2e8f0', fontFamily: 'JetBrains Mono, monospace' }}>{value}</div>
    </div>
  );
}

// ── Equity Panel ──────────────────────────────────────────────
function EquityPanel({ patient }) {
  const barrier = computeEquityBarrier(patient);
  const barColor = barrier > 60 ? '#fbbf24' : barrier > 30 ? '#38bdf8' : '#34d399';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>
        Equity-aware allocation considers access barriers alongside clinical risk.
        A high Access Barrier score does <strong style={{ color: '#e2e8f0' }}>not</strong> reduce clinical priority — it flags patients
        who may need additional logistical support to access recommended tests.
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
          background: `conic-gradient(${barColor} ${barrier * 3.6}deg, rgba(255,255,255,0.06) 0deg)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', background: '#0b1828',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column',
          }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: barColor, fontFamily: 'JetBrains Mono, monospace' }}>{barrier}</span>
            <span style={{ fontSize: 8, color: '#334155' }}>/ 100</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: barColor }}>
            {barrier > 60 ? 'High' : barrier > 30 ? 'Moderate' : 'Low'} Access Barrier
          </div>
          <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>{patient.region.name} region</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <MRIMetric label="Nearest MRI Center" value={`${patient.region.distMRI} km`} risk={patient.region.distMRI > 60} mild={patient.region.distMRI > 25} />
        <MRIMetric label="Nearest PET Center" value={`${patient.region.distPET} km`} risk={patient.region.distPET > 100} mild={patient.region.distPET > 40} />
        <MRIMetric label="Est. Access Cost" value={`$${patient.region.accessCost}`} risk={patient.region.accessCost > 300} mild={patient.region.accessCost > 120} />
      </div>

      {barrier > 40 && (
        <div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: 8, padding: '10px 14px' }}>
          <div style={{ fontSize: 11, color: '#fbbf24', fontWeight: 600, marginBottom: 4 }}>⚠ Access Support Recommended</div>
          <div style={{ fontSize: 11.5, color: '#64748b' }}>
            Consider patient transport assistance, telehealth pre-consultation, or referral to a regional hub with multiple modalities available in a single visit.
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Modal ────────────────────────────────────────────────

export default function PatientDetailModal({ patient, onClose }) {
  const [tab, setTab] = useState('overview');
  const overlayRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!patient) return null;

  const colCat = catColor[patient.category];
  const tabs = [
    { id: 'overview',  label: 'Overview' },
    { id: 'voi',       label: 'VoI Engine' },
    { id: 'biomarkers',label: 'Biomarkers' },
    { id: 'mri',       label: 'MRI' },
    { id: 'pet',       label: 'PET' },
    { id: 'whatif',    label: 'What-If' },
    { id: 'equity',    label: 'Equity' },
  ];

  return (
    <div
      className="modal-overlay animate-fade-in"
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div style={{
        width: '92vw', maxWidth: 860, maxHeight: '90vh',
        background: '#0a1628', border: '1px solid rgba(56,189,248,0.2)',
        borderRadius: 18, display: 'flex', flexDirection: 'column',
        boxShadow: '0 0 60px rgba(56,189,248,0.12), 0 40px 100px rgba(0,0,0,0.8)',
        animation: 'fade-in-up 0.3s ease both',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'flex-start', gap: 16,
        }}>
          {/* Score ring */}
          <div style={{ flexShrink: 0 }}>
            <svg width={72} height={72} style={{ transform: 'rotate(-90deg)' }}>
              {(() => {
                const r2 = 31; const c2 = 2 * Math.PI * r2;
                const d2 = (patient.score / 100) * c2;
                return <>
                  <circle cx="36" cy="36" r={r2} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6"/>
                  <circle cx="36" cy="36" r={r2} fill="none" stroke={colCat} strokeWidth="6"
                    strokeDasharray={`${d2} ${c2}`} strokeLinecap="round"
                    style={{ filter: `drop-shadow(0 0 8px ${colCat}88)` }}/>
                  <text x="36" y="36" textAnchor="middle" dominantBaseline="central"
                    fill={colCat} fontSize="16" fontWeight="800"
                    style={{ transform: 'rotate(90deg)', transformOrigin: '36px 36px', fontFamily: 'JetBrains Mono, monospace' }}>
                    {patient.score}
                  </text>
                </>;
              })()}
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 18, fontWeight: 700, color: '#e2e8f0' }}>
                {patient.id}
              </span>
              <span style={{
                background: catBg[patient.category], border: `1px solid ${catBorder[patient.category]}`,
                color: colCat, padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                {patient.category} Priority
              </span>
              <span style={{ fontSize: 12, color: '#475569' }}>{patient.age}y · {patient.gender} · {patient.ethnicity}</span>
            </div>
            <div style={{ marginTop: 6, fontSize: 12, color: '#475569' }}>
              Education: {patient.education} · APOE-ε4: {patient.apoe4Count}× alleles · Region: {patient.region.name}
            </div>
            <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, color: '#334155' }}>Comorbidities:</span>
              {patient.comorbidities.length === 0
                ? <span style={{ fontSize: 11, color: '#334155' }}>None reported</span>
                : patient.comorbidities.map(c => (
                  <span key={c} className="tag-pill">{c}</span>
                ))}
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: '#38bdf8', fontWeight: 600 }}>
              ★ VoI Recommendation: {patient.nextTest}
              <span style={{ fontSize: 11, color: '#475569', fontWeight: 400, marginLeft: 8 }}>
                Expected gain: {Math.round(patient.voiGain * 100)}%
              </span>
            </div>
          </div>
          {/* Close */}
          <button
            id="close-patient-modal"
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 10px', color: '#64748b', flexShrink: 0 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 20px', overflowX: 'auto' }}>
          {tabs.map(t => (
            <button
              key={t.id}
              id={`tab-${t.id}`}
              onClick={() => setTab(t.id)}
              style={{
                background: 'none', border: 'none', padding: '10px 14px',
                fontSize: 12.5, fontWeight: tab === t.id ? 600 : 400,
                color: tab === t.id ? '#38bdf8' : '#475569',
                borderBottom: tab === t.id ? '2px solid #38bdf8' : '2px solid transparent',
                transition: 'all 0.15s ease', whiteSpace: 'nowrap',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="modal-scroll" style={{ flex: 1, padding: '20px 24px' }}>
          {tab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Cognitive scores */}
              <div>
                <SectionTitle icon="🧠" label="Cognitive Assessment" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                  <MRIMetric label="MoCA" value={patient.moca} risk={patient.moca < 22} mild={patient.moca < 26} />
                  <MRIMetric label="MMSE" value={patient.mmse} risk={patient.mmse < 24} mild={patient.mmse < 27} />
                  <MRIMetric label="FAQ" value={patient.faq} risk={patient.faq > 8} mild={patient.faq > 4} />
                  <MRIMetric label="CDR-SB" value={patient.cdr} risk={patient.cdr >= 1} mild={patient.cdr > 0} />
                </div>
                {patient.mocaDecline1yr > 0 && (
                  <div style={{ marginTop: 8, fontSize: 12, color: patient.mocaDecline1yr > 3 ? '#fb7185' : '#fbbf24' }}>
                    ↓ MoCA 1-year decline: {patient.mocaDecline1yr} points/year
                  </div>
                )}
              </div>
              <div className="divider" />
              <ExplainabilityPanel shapFactors={patient.shapFactors} />
            </div>
          )}

          {tab === 'voi'        && <VoIPanel patient={patient} />}
          {tab === 'biomarkers' && <BiomarkerTable biomarkers={patient.biomarkers} />}
          {tab === 'mri'        && <MRIPanel mri={patient.mri} />}
          {tab === 'pet'        && <PETPanel pet={patient.pet} />}
          {tab === 'whatif'     && <WhatIfSimulator patient={patient} />}
          {tab === 'equity'     && <EquityPanel patient={patient} />}
        </div>

        {/* Footer disclaimer */}
        <div style={{
          padding: '10px 24px', borderTop: '1px solid rgba(255,255,255,0.05)',
          fontSize: 10.5, color: '#1e3a5f', textAlign: 'center',
        }}>
          VIGIL AI · Clinical Decision-Support Only · Not a Diagnosis · Clinician Review Required Before Action
        </div>
      </div>
    </div>
  );
}
