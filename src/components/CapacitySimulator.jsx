import { useState, useMemo } from 'react';
import { PATIENT_COHORT } from '../data/cohort';
import { computeEquityBarrier } from '../utils/prioritizationEngine';

const CAP_DEFAULTS = { mriPerWeek: 8, petPerWeek: 3, bioPerWeek: 30 };

function StatBox({ label, value, unit, color, sub }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 10, padding: '14px 18px',
    }}>
      <div style={{ fontSize: 10, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 22, fontWeight: 800, color }}>{value}<span style={{ fontSize: 12, fontWeight: 400, color: '#475569', marginLeft: 4 }}>{unit}</span></div>
      {sub && <div style={{ fontSize: 10.5, color: '#475569', marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function CapacitySlider({ label, value, min, max, step, onChange, color, unit, id }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
        <span style={{ fontSize: 12.5, color: '#94a3b8' }}>{label}</span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 700, color }}>
          {value} {unit}
        </span>
      </div>
      <input
        id={id}
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseInt(e.target.value))}
        style={{ width: '100%', accentColor: color }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#334155', marginTop: 2 }}>
        <span>{min}</span><span>{max}</span>
      </div>
    </div>
  );
}

function QueueTable({ patients, onSelectPatient, limit }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {patients.slice(0, limit).map((p, i) => {
        const col = p.category === 'High' ? '#fb7185' : p.category === 'Medium' ? '#fbbf24' : '#34d399';
        const barrier = computeEquityBarrier(p);
        return (
          <button
            key={p.id}
            id={`capacity-patient-${p.id}`}
            onClick={() => onSelectPatient(p)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 7, padding: '7px 12px', textAlign: 'left',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
          >
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#334155', width: 20 }}>#{i + 1}</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#64748b', width: 90 }}>{p.id}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: col, fontFamily: 'JetBrains Mono, monospace', width: 30 }}>{p.score}</span>
            <span style={{ fontSize: 11, color: '#475569', flex: 1 }}>{p.nextTest}</span>
            <span style={{ fontSize: 11, color: barrier > 40 ? '#fbbf24' : '#334155' }}>
              {p.region.distPET}km
            </span>
            {barrier > 40 && <span style={{ fontSize: 9, color: '#fbbf24', padding: '1px 5px', border: '1px solid rgba(251,191,36,0.3)', borderRadius: 4 }}>ACCESS</span>}
          </button>
        );
      })}
    </div>
  );
}

export default function CapacitySimulator({ patients, onSelectPatient }) {
  const [mriPerWeek, setMriPerWeek] = useState(CAP_DEFAULTS.mriPerWeek);
  const [petPerWeek, setPetPerWeek] = useState(CAP_DEFAULTS.petPerWeek);
  const [bioPerWeek, setBioPerWeek] = useState(CAP_DEFAULTS.bioPerWeek);
  const [weeksAhead, setWeeksAhead] = useState(4);

  const mriQueue = useMemo(() => patients.filter(p => p.nextTest === 'MRI').sort((a, b) => b.score - a.score), [patients]);
  const petQueue = useMemo(() => patients.filter(p => p.nextTest === 'PET Scan').sort((a, b) => b.score - a.score), [patients]);
  const bioQueue = useMemo(() => patients.filter(p => p.nextTest === 'Blood Biomarkers').sort((a, b) => b.score - a.score), [patients]);

  const mriWait = Math.ceil(mriQueue.length / mriPerWeek);
  const petWait = Math.ceil(petQueue.length / petPerWeek);
  const bioWait = Math.ceil(bioQueue.length / bioPerWeek);

  const mriInWindow = Math.min(mriQueue.length, mriPerWeek * weeksAhead);
  const petInWindow = Math.min(petQueue.length, petPerWeek * weeksAhead);
  const bioInWindow = Math.min(bioQueue.length, bioPerWeek * weeksAhead);

  const mriBacklog = mriQueue.length - mriInWindow;
  const petBacklog = petQueue.length - petInWindow;
  const bioBacklog = bioQueue.length - bioInWindow;

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div className="animate-fade-in-up" style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#e2e8f0', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 8 }}>
          Diagnostic Resource Optimizer
        </h1>
        <p style={{ fontSize: 13.5, color: '#475569', maxWidth: 740, lineHeight: 1.7 }}>
          Configure your facility's weekly diagnostic capacity and observe how VIGIL AI
          optimally queues patients using a Value-of-Information approach. Patients with
          the highest expected information gain are prioritized, with equity-flagged patients
          surfaced for additional scheduling consideration.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Controls */}
        <div className="glass-card animate-fade-in-up delay-200" style={{ padding: '20px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#38bdf8', textTransform: 'uppercase', marginBottom: 16 }}>
            Facility Capacity Configuration
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <CapacitySlider
              id="slider-mri"
              label="MRI scans / week"
              value={mriPerWeek} min={1} max={20} step={1}
              onChange={setMriPerWeek} color="#2dd4bf" unit="scans/wk"
            />
            <CapacitySlider
              id="slider-pet"
              label="PET scans / week"
              value={petPerWeek} min={1} max={10} step={1}
              onChange={setPetPerWeek} color="#f472b6" unit="scans/wk"
            />
            <CapacitySlider
              id="slider-bio"
              label="Biomarker panels / week"
              value={bioPerWeek} min={5} max={60} step={5}
              onChange={setBioPerWeek} color="#818cf8" unit="panels/wk"
            />
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
              <CapacitySlider
                id="slider-weeks"
                label="Planning horizon"
                value={weeksAhead} min={1} max={12} step={1}
                onChange={setWeeksAhead} color="#38bdf8" unit="weeks"
              />
            </div>
          </div>

          <div style={{ marginTop: 20, padding: '12px 14px', background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: 8 }}>
            <div style={{ fontSize: 10.5, color: '#38bdf8', fontWeight: 600, marginBottom: 4 }}>VoI Optimization Active</div>
            <div style={{ fontSize: 11, color: '#475569', lineHeight: 1.6 }}>
              Patients are queued by expected information gain, not raw risk score.
              This ensures scarce imaging slots are allocated to patients where the
              test would most reduce diagnostic uncertainty.
            </div>
          </div>
        </div>

        {/* Queue panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Summary row */}
          <div className="animate-fade-in-up delay-300" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <StatBox label="MRI Queue" value={mriQueue.length} unit="patients" color="#2dd4bf" sub={`Clears in ${mriWait} wk${mriWait !== 1 ? 's' : ''} at current capacity`} />
            <StatBox label="PET Queue" value={petQueue.length} unit="patients" color="#f472b6" sub={`Clears in ${petWait} wk${petWait !== 1 ? 's' : ''} at current capacity`} />
            <StatBox label="Biomarker Queue" value={bioQueue.length} unit="patients" color="#818cf8" sub={`Clears in ${bioWait} wk${bioWait !== 1 ? 's' : ''} at current capacity`} />
          </div>

          {/* In-window vs backlog */}
          <div className="animate-fade-in-up delay-400" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { label: 'MRI', inWindow: mriInWindow, backlog: mriBacklog, color: '#2dd4bf', queue: mriQueue },
              { label: 'PET', inWindow: petInWindow, backlog: petBacklog, color: '#f472b6', queue: petQueue },
              { label: 'Biomarker', inWindow: bioInWindow, backlog: bioBacklog, color: '#818cf8', queue: bioQueue },
            ].map(({ label, inWindow, backlog, color, queue }) => (
              <div key={label} className="glass-card" style={{ padding: '16px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color, textTransform: 'uppercase', marginBottom: 10 }}>
                  {label} ({weeksAhead}wk window)
                </div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                  <div style={{ flex: 1, textAlign: 'center', background: `${color}12`, border: `1px solid ${color}25`, borderRadius: 7, padding: '8px' }}>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 20, fontWeight: 800, color }}>{inWindow}</div>
                    <div style={{ fontSize: 10, color: '#475569' }}>Scheduled</div>
                  </div>
                  <div style={{ flex: 1, textAlign: 'center', background: 'rgba(251,113,133,0.06)', border: '1px solid rgba(251,113,133,0.18)', borderRadius: 7, padding: '8px' }}>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 20, fontWeight: 800, color: '#fb7185' }}>{backlog}</div>
                    <div style={{ fontSize: 10, color: '#475569' }}>Backlog</div>
                  </div>
                </div>
                {/* Next scheduled patients */}
                <div style={{ fontSize: 9, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>
                  Next in queue (by VoI)
                </div>
                <QueueTable patients={queue} onSelectPatient={onSelectPatient} limit={4} />
              </div>
            ))}
          </div>

          {/* Access gap alert */}
          {(() => {
            const accessGapHigh = patients.filter(p => p.category === 'High' && computeEquityBarrier(p) > 50);
            if (accessGapHigh.length === 0) return null;
            return (
              <div className="animate-fade-in-up delay-500" style={{
                background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.25)',
                borderRadius: 12, padding: '16px 20px',
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#fbbf24', marginBottom: 6 }}>
                  ⚠ Equity Alert — {accessGapHigh.length} High-Priority Patient{accessGapHigh.length > 1 ? 's' : ''} with Significant Access Barriers
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10, lineHeight: 1.6 }}>
                  The following patients are clinically high priority but face substantial geographic or cost barriers
                  to reaching the recommended diagnostic center. Consider transport assistance, telehealth pre-consultation,
                  or a hub-and-spoke referral arrangement.
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {accessGapHigh.map(p => (
                    <button
                      key={p.id}
                      id={`equity-patient-${p.id}`}
                      onClick={() => onSelectPatient(p)}
                      style={{
                        background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)',
                        borderRadius: 7, padding: '5px 12px', fontSize: 12, color: '#fcd34d', fontFamily: 'JetBrains Mono, monospace',
                      }}
                    >
                      {p.id} · {p.region.distPET}km · Score {p.score}
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
