import { useState, useMemo } from 'react';
import { computeEquityBarrier } from '../utils/prioritizationEngine';

// ── Helpers ────────────────────────────────────────────────────

const colorByCategory = {
  High:   { text: '#fda4af', bg: 'rgba(251,113,133,0.1)',   border: 'rgba(251,113,133,0.35)' },
  Medium: { text: '#fcd34d', bg: 'rgba(251,191,36,0.1)',    border: 'rgba(251,191,36,0.35)' },
  Low:    { text: '#6ee7b7', bg: 'rgba(52,211,153,0.1)',    border: 'rgba(52,211,153,0.3)' },
};

const colorByTest = {
  'Blood Biomarkers': '#818cf8',
  'MRI':              '#38bdf8',
  'PET Scan':         '#f472b6',
  'Annual Re-Screening': '#94a3b8',
};

function ScoreRing({ score, category, size = 48 }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const col = category === 'High' ? '#fb7185' : category === 'Medium' ? '#fbbf24' : '#34d399';
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={col} strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 5px ${col}88)`, transition: 'stroke-dasharray 0.8s ease' }}
      />
      <text
        x={size / 2} y={size / 2}
        textAnchor="middle" dominantBaseline="central"
        fill={col} fontSize="11" fontWeight="700"
        style={{ transform: 'rotate(90deg)', transformOrigin: `${size / 2}px ${size / 2}px`, fontFamily: 'JetBrains Mono, monospace' }}
      >
        {score}
      </text>
    </svg>
  );
}

function VoIBar({ gain }) {
  const pct = Math.round(gain * 100);
  const col = gain > 0.75 ? '#34d399' : gain > 0.5 ? '#fbbf24' : '#94a3b8';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: col, borderRadius: 4, transition: 'width 0.6s ease' }} />
      </div>
      <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: col, minWidth: 28 }}>{pct}%</span>
    </div>
  );
}

function StagePips({ currentStage }) {
  const stages = ['Cognitive', 'Biomarkers', 'MRI', 'PET'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      {stages.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <div
            title={s}
            style={{
              width: 8, height: 8, borderRadius: '50%',
              background: i <= currentStage ? '#38bdf8' : 'rgba(255,255,255,0.1)',
              border: i <= currentStage ? '1px solid rgba(56,189,248,0.6)' : '1px solid rgba(255,255,255,0.08)',
              flexShrink: 0,
              boxShadow: i <= currentStage ? '0 0 6px rgba(56,189,248,0.5)' : 'none',
            }}
          />
          {i < stages.length - 1 && (
            <div style={{ width: 10, height: 1, background: i < currentStage ? 'rgba(56,189,248,0.4)' : 'rgba(255,255,255,0.07)' }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Metrics Strip ──────────────────────────────────────────────

function MetricCard({ label, value, sub, color, icon }) {
  return (
    <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{
        width: 42, height: 42, borderRadius: 10, flexShrink: 0,
        background: `${color}15`, border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 800, color, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>{label}</div>
        {sub && <div style={{ fontSize: 10, color, opacity: 0.65, marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ── Patient Row ────────────────────────────────────────────────

function PatientRow({ patient, onClick, rank }) {
  const col = colorByCategory[patient.category];
  const testColor = colorByTest[patient.nextTest] || '#94a3b8';
  const equityBarrier = computeEquityBarrier(patient);
  const isRemoteHigh = patient.category === 'High' && equityBarrier > 40;

  return (
    <tr
      id={`patient-row-${patient.id}`}
      onClick={onClick}
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        transition: 'background 0.15s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(56,189,248,0.04)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {/* Rank */}
      <td style={{ padding: '12px 8px 12px 20px', width: 40 }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#334155' }}>#{rank}</span>
      </td>

      {/* ID + flags */}
      <td style={{ padding: '12px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>
            {patient.id}
          </span>
          {isRemoteHigh && (
            <span title="High-risk patient with limited diagnostic access" style={{
              fontSize: 9, padding: '1px 6px', borderRadius: 4,
              background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.3)',
              color: '#fcd34d', fontWeight: 600, letterSpacing: '0.05em',
            }}>ACCESS GAP</span>
          )}
        </div>
        <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>
          {patient.age}y · {patient.gender} · {patient.ethnicity}
        </div>
      </td>

      {/* Score ring */}
      <td style={{ padding: '12px 16px' }}>
        <ScoreRing score={patient.score} category={patient.category} size={44} />
      </td>

      {/* Category */}
      <td style={{ padding: '12px 8px' }}>
        <span style={{
          background: col.bg, border: `1px solid ${col.border}`, color: col.text,
          padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600,
          letterSpacing: '0.05em', textTransform: 'uppercase',
        }}>
          {patient.category}
        </span>
      </td>

      {/* MoCA / MMSE */}
      <td style={{ padding: '12px 8px' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>
          <span style={{ color: patient.moca < 22 ? '#fb7185' : patient.moca < 26 ? '#fbbf24' : '#6ee7b7' }}>
            {patient.moca}
          </span>
          <span style={{ color: '#334155' }}> / </span>
          <span style={{ color: '#64748b', fontSize: 11 }}>{patient.mmse}</span>
        </div>
        <div style={{ fontSize: 10, color: '#475569' }}>MoCA / MMSE</div>
      </td>

      {/* APOE */}
      <td style={{ padding: '12px 8px' }}>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
          color: patient.apoe4Count === 2 ? '#fb7185' : patient.apoe4Count === 1 ? '#fbbf24' : '#6ee7b7',
        }}>
          ε4×{patient.apoe4Count}
        </span>
      </td>

      {/* Stage pips */}
      <td style={{ padding: '12px 8px' }}>
        <StagePips currentStage={patient.currentStage} />
      </td>

      {/* VoI Recommended Test */}
      <td style={{ padding: '12px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: testColor, flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: testColor, fontWeight: 500 }}>{patient.nextTest}</span>
        </div>
        <VoIBar gain={patient.voiGain} />
      </td>

      {/* Equity / Distance */}
      <td style={{ padding: '12px 16px' }}>
        <div style={{ fontSize: 12, color: equityBarrier > 50 ? '#fbbf24' : '#64748b' }}>
          {patient.region.distPET} km
        </div>
        <div style={{ fontSize: 10, color: '#334155' }}>{patient.region.name}</div>
      </td>

      {/* Arrow */}
      <td style={{ padding: '12px 20px 12px 0', textAlign: 'right' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </td>
    </tr>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────

export default function NeurologistDashboard({ patients, cohortStats, onSelectPatient }) {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStage, setFilterStage] = useState('All');
  const [sortBy, setSortBy] = useState('score');
  const [apoeFilter, setApoeFilter] = useState('All');

  const filtered = useMemo(() => {
    let list = [...patients];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(p =>
        p.id.toLowerCase().includes(q) ||
        p.gender.toLowerCase().includes(q) ||
        p.ethnicity.toLowerCase().includes(q) ||
        p.region.name.toLowerCase().includes(q)
      );
    }
    if (filterCategory !== 'All') list = list.filter(p => p.category === filterCategory);
    if (apoeFilter !== 'All') list = list.filter(p => p.apoe4Count === parseInt(apoeFilter));
    if (filterStage !== 'All') {
      const stageIdx = ['Screening', 'Biomarkers', 'MRI', 'PET'].indexOf(filterStage);
      if (stageIdx >= 0) list = list.filter(p => p.currentStage === stageIdx);
    }
    if (sortBy === 'score') list.sort((a, b) => b.score - a.score);
    else if (sortBy === 'voi') list.sort((a, b) => b.voiGain - a.voiGain);
    else if (sortBy === 'equity') list.sort((a, b) => computeEquityBarrier(b) - computeEquityBarrier(a));
    else if (sortBy === 'moca') list.sort((a, b) => a.moca - b.moca);
    return list;
  }, [patients, search, filterCategory, filterStage, sortBy, apoeFilter]);

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1400, margin: '0 auto' }}>

      {/* ── Metrics Strip ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 28 }}
           className="animate-fade-in-up">
        <MetricCard
          label="Total Screened"
          value={cohortStats.total}
          color="#38bdf8"
          icon={<UserIcon />}
        />
        <MetricCard
          label="High Priority"
          value={cohortStats.high}
          sub="Immediate escalation"
          color="#fb7185"
          icon={<AlertIcon />}
        />
        <MetricCard
          label="Medium Priority"
          value={cohortStats.medium}
          sub="Biomarker workup"
          color="#fbbf24"
          icon={<ClockIcon />}
        />
        <MetricCard
          label="PET Queue"
          value={cohortStats.petQueue}
          sub="Advanced imaging"
          color="#f472b6"
          icon={<ScanIcon />}
        />
        <MetricCard
          label="Access Gap"
          value={cohortStats.remoteHighRisk}
          sub="High-risk, limited access"
          color="#fbbf24"
          icon={<MapIcon />}
        />
      </div>

      {/* ── Filters & Search ── */}
      <div className="glass-card animate-fade-in-up delay-200" style={{ padding: '14px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            id="patient-search"
            type="text"
            placeholder="Search patients…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, padding: '7px 12px 7px 32px', color: '#e2e8f0',
              fontFamily: 'Inter, sans-serif', fontSize: 13, width: 200,
              outline: 'none', cursor: 'text',
            }}
          />
        </div>

        {/* Category filter */}
        <FilterGroup label="Priority" options={['All', 'High', 'Medium', 'Low']} value={filterCategory} onChange={setFilterCategory} id="filter-priority" />
        <FilterGroup label="Stage" options={['All', 'Screening', 'Biomarkers', 'MRI', 'PET']} value={filterStage} onChange={setFilterStage} id="filter-stage" />
        <FilterGroup label="APOE-ε4" options={['All', '0', '1', '2']} value={apoeFilter} onChange={setApoeFilter} id="filter-apoe" />

        {/* Sort */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sort</span>
          <FilterGroup label="" options={['score', 'voi', 'equity', 'moca']} value={sortBy} onChange={setSortBy} id="sort-by"
            labelMap={{ score: 'Risk Score', voi: 'VoI Gain', equity: 'Access Gap', moca: 'MoCA' }} />
        </div>

        {/* Count */}
        <span style={{ fontSize: 12, color: '#475569', borderLeft: '1px solid rgba(255,255,255,0.06)', paddingLeft: 12 }}>
          {filtered.length} patients
        </span>
      </div>

      {/* ── Patient Table ── */}
      <div className="glass-card animate-fade-in-up delay-300" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {['#', 'Patient ID', 'Score', 'Priority', 'MoCA/MMSE', 'APOE', 'Stage', 'VoI — Next Test', 'PET Distance', ''].map((h, i) => (
                  <th key={i} style={{
                    padding: i === 0 ? '11px 8px 11px 20px' : i === 8 ? '11px 20px 11px 0' : '11px 8px',
                    textAlign: i === 8 ? 'right' : 'left',
                    fontSize: 10, fontWeight: 600, color: '#334155',
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    background: 'rgba(0,0,0,0.15)',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ padding: 40, textAlign: 'center', color: '#334155', fontSize: 14 }}>
                    No patients match the current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((p, i) => (
                  <PatientRow
                    key={p.id}
                    patient={p}
                    rank={i + 1}
                    onClick={() => onSelectPatient(p)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer note */}
      <div style={{ marginTop: 16, fontSize: 11, color: '#1e3a5f', textAlign: 'center' }}>
        Dataset: Synthetic cohort calibrated to ADNI & OASIS-3 statistical distributions · All records are de-identified and non-diagnostic
      </div>
    </div>
  );
}

// ── Filter Group Component ─────────────────────────────────────
function FilterGroup({ label, options, value, onChange, id, labelMap }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {label && <span style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>}
      <div style={{ display: 'flex', gap: 3 }}>
        {options.map(opt => (
          <button
            key={opt}
            id={`${id}-${opt}`}
            onClick={() => onChange(opt)}
            style={{
              background: value === opt ? 'rgba(56,189,248,0.12)' : 'transparent',
              border: value === opt ? '1px solid rgba(56,189,248,0.35)' : '1px solid rgba(255,255,255,0.07)',
              color: value === opt ? '#7dd3fc' : '#64748b',
              borderRadius: 6, padding: '5px 10px',
              fontSize: 11.5, fontWeight: value === opt ? 600 : 400,
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.15s ease',
            }}
          >
            {labelMap ? labelMap[opt] : opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Tiny SVG icons ─────────────────────────────────────────────
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const AlertIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fb7185" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const ScanIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/>
    <line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/>
  </svg>
);
const MapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
    <line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
  </svg>
);
