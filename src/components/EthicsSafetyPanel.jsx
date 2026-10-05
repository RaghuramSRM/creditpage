// Ethics & Safety Panel — VIGIL AI Transparency Center

const PRINCIPLES = [
  {
    id: 'non-diagnostic',
    icon: '🚫',
    title: 'Non-Diagnostic by Design',
    color: '#38bdf8',
    desc: 'VIGIL AI does not diagnose Alzheimer\'s disease, any neurological condition, or any other medical condition. All outputs are clinical decision-support recommendations that require qualified clinician review and cannot be acted upon autonomously.',
    status: 'COMPLIANT',
    statusColor: '#34d399',
  },
  {
    id: 'clinician-loop',
    icon: '👨‍⚕️',
    title: 'Clinician in the Loop',
    color: '#818cf8',
    desc: 'Every recommendation, escalation, and resource allocation suggestion requires explicit clinician approval. The system surfaces information; final decisions remain exclusively with qualified healthcare professionals.',
    status: 'COMPLIANT',
    statusColor: '#34d399',
  },
  {
    id: 'explainability',
    icon: '🔍',
    title: 'Explainable AI (XAI)',
    color: '#2dd4bf',
    desc: 'All priority scores are accompanied by SHAP-inspired factor attribution, enabling clinicians to understand which clinical variables contributed most to a patient\'s prioritization. No black-box outputs.',
    status: 'IMPLEMENTED',
    statusColor: '#34d399',
  },
  {
    id: 'data-privacy',
    icon: '🔒',
    title: 'Data Privacy & De-identification',
    color: '#f472b6',
    desc: 'VIGIL AI uses only synthetic patient records calibrated to ADNI & OASIS-3 statistical distributions. No real patient identifiers, biometric data, or protected health information (PHI) is used in this prototype.',
    status: 'VERIFIED',
    statusColor: '#34d399',
  },
  {
    id: 'equity',
    icon: '⚖️',
    title: 'Equity-Aware Allocation',
    color: '#fbbf24',
    desc: 'Geographic and socioeconomic access barriers are surfaced alongside clinical priority scores. Equity metrics do not reduce clinical priority but inform queue management to prevent high-risk patients from falling through access gaps.',
    status: 'ACTIVE',
    statusColor: '#34d399',
  },
  {
    id: 'bias',
    icon: '📊',
    title: 'Bias Awareness',
    color: '#fb7185',
    desc: 'The synthetic training cohort includes diverse demographic representation across age, gender, ethnicity, and education level. Bias metrics should be evaluated across all demographic groups before clinical deployment.',
    status: 'PROTOTYPE',
    statusColor: '#fbbf24',
  },
  {
    id: 'validation',
    icon: '🧪',
    title: 'Clinical Validation Required',
    color: '#94a3b8',
    desc: 'This prototype has not undergone clinical validation or regulatory review. Before any real-world deployment, the system must be validated on real-world clinical cohorts, peer-reviewed, and assessed under applicable regulatory frameworks (FDA, CE, MHRA).',
    status: 'NOT VALIDATED',
    statusColor: '#fbbf24',
  },
  {
    id: 'limitations',
    icon: '⚠️',
    title: 'Known Limitations',
    color: '#fbbf24',
    desc: 'Public datasets may not represent all clinical populations. Missing biomarker or imaging data reduces scoring confidence. The VoI model is a mathematical heuristic and not a calibrated Bayesian network in this prototype. Performance on real-world data may differ from synthetic cohort results.',
    status: 'DOCUMENTED',
    statusColor: '#34d399',
  },
];

const DATASETS = [
  {
    name: 'ADNI',
    full: 'Alzheimer\'s Disease Neuroimaging Initiative',
    url: 'https://adni.loni.usc.edu',
    usedFor: 'MRI volumetrics, cognitive scores, PET Centiloid, plasma biomarker reference ranges',
    license: 'Open-access (DUA required for real data)',
    synthetic: true,
  },
  {
    name: 'OASIS-3',
    full: 'Open Access Series of Imaging Studies — Longitudinal Multimodal Neuroimaging',
    url: 'https://sites.wustl.edu/oasisbrains',
    usedFor: 'Longitudinal cognitive trajectories, hippocampal volumetrics, CDR-SB distributions',
    license: 'Open-access (CC BY 4.0)',
    synthetic: true,
  },
];

const SCORE_METHOD = [
  { label: 'Cognitive Domain', description: 'MoCA, MMSE, FAQ, CDR-SB', weight: '~40%', color: '#38bdf8' },
  { label: 'Plasma Biomarkers', description: 'p-tau217, Aβ42/40, NfL, GFAP', weight: '~25%', color: '#818cf8' },
  { label: 'Structural MRI', description: 'Hippocampal %ile, Brain Age Gap', weight: '~20%', color: '#2dd4bf' },
  { label: 'Genetic Risk', description: 'APOE-ε4 allele count', weight: '~7%', color: '#f472b6' },
  { label: 'Comorbidities', description: 'Hypertension, T2DM, Depression, TIA', weight: '~5%', color: '#fbbf24' },
  { label: 'Age + Education', description: 'Age risk modifier, education protective factor', weight: '~3%', color: '#94a3b8' },
];

function PrincipleCard({ p }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 12, padding: '16px 18px',
      display: 'flex', gap: 14,
    }}>
      <div style={{ fontSize: 22, flexShrink: 0, paddingTop: 2 }}>{p.icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: '#e2e8f0' }}>{p.title}</span>
          <span style={{
            fontSize: 9, padding: '2px 7px', borderRadius: 4,
            background: `${p.statusColor}18`, border: `1px solid ${p.statusColor}35`,
            color: p.statusColor, fontWeight: 700, letterSpacing: '0.08em',
          }}>
            {p.status}
          </span>
        </div>
        <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.7 }}>{p.desc}</div>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#38bdf8', marginBottom: 14 }}>
      {children}
    </div>
  );
}

export default function EthicsSafetyPanel() {
  return (
    <div style={{ padding: '24px 28px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div className="animate-fade-in-up" style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#e2e8f0', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 8 }}>
          Safety, Ethics & Transparency Centre
        </h1>
        <p style={{ fontSize: 13.5, color: '#475569', maxWidth: 720, lineHeight: 1.7 }}>
          VIGIL AI is designed with safety and transparency as primary requirements.
          This section documents the ethical principles, data provenance, scoring methodology,
          and known limitations that every clinical user should understand before using the system.
        </p>
      </div>

      {/* Master disclaimer */}
      <div className="animate-fade-in-up delay-100" style={{
        background: 'rgba(251,191,36,0.07)', border: '2px solid rgba(251,191,36,0.3)',
        borderRadius: 14, padding: '18px 22px', marginBottom: 28,
      }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#fbbf24', marginBottom: 8, letterSpacing: '0.03em' }}>
          ⚠ Important — Read Before Use
        </div>
        <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.75 }}>
          VIGIL AI is a <strong style={{ color: '#e2e8f0' }}>Clinical Decision-Support System (CDSS)</strong> only.
          It <strong style={{ color: '#fb7185' }}>does not diagnose Alzheimer's disease</strong>, predict individual patient outcomes,
          or provide treatment recommendations. Outputs must be reviewed by a qualified clinician and must not be
          used as the sole basis for any diagnostic or treatment decision. All data in this prototype is <strong style={{ color: '#e2e8f0' }}>synthetic
          and non-identifiable</strong>. This system has not been clinically validated or regulatory-cleared.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, alignItems: 'start' }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Safety principles */}
          <div className="animate-fade-in-up delay-200">
            <SectionTitle>Ethical & Safety Principles</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PRINCIPLES.map(p => <PrincipleCard key={p.id} p={p} />)}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Scoring methodology */}
          <div className="glass-card animate-fade-in-up delay-300" style={{ padding: '20px' }}>
            <SectionTitle>Priority Score Methodology (0–100)</SectionTitle>
            <p style={{ fontSize: 12, color: '#475569', marginBottom: 14, lineHeight: 1.65 }}>
              The VIGIL AI priority score is a composite weighted indicator. It represents
              <strong style={{ color: '#e2e8f0' }}> priority for further diagnostic evaluation</strong>, not
              probability of Alzheimer's disease. Thresholds: 0–39 Low · 40–69 Medium · 70–100 High.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {SCORE_METHOD.map(m => (
                <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: m.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>{m.label}</div>
                    <div style={{ fontSize: 11, color: '#475569' }}>{m.description}</div>
                  </div>
                  <div style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: m.color,
                    background: `${m.color}12`, border: `1px solid ${m.color}25`,
                    borderRadius: 5, padding: '2px 7px',
                  }}>
                    {m.weight}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* VoI explanation */}
          <div className="glass-card animate-fade-in-up delay-400" style={{ padding: '20px' }}>
            <SectionTitle>Value-of-Information (VoI) Engine</SectionTitle>
            <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.7, marginBottom: 12 }}>
              The VoI engine asks: <em style={{ color: '#7dd3fc' }}>"Which available test would provide the greatest expected
              reduction in diagnostic uncertainty for this specific patient?"</em>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                ['Expected Info Gain', 'Estimated % reduction in diagnostic uncertainty if the test is performed'],
                ['Sequential Logic', 'Tests are only recommended when prior-stage evidence justifies the cost/risk escalation'],
                ['Prototype Approximation', 'VoI is approximated heuristically in this prototype; a full implementation would use calibrated Bayesian networks'],
              ].map(([t, d]) => (
                <div key={t} style={{ background: 'rgba(56,189,248,0.04)', border: '1px solid rgba(56,189,248,0.12)', borderRadius: 7, padding: '8px 12px' }}>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: '#38bdf8', marginBottom: 3 }}>{t}</div>
                  <div style={{ fontSize: 11, color: '#475569' }}>{d}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Data sources */}
          <div className="glass-card animate-fade-in-up delay-500" style={{ padding: '20px' }}>
            <SectionTitle>Data Provenance</SectionTitle>
            {DATASETS.map(d => (
              <div key={d.name} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 10, padding: '12px 14px', marginBottom: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#7dd3fc', fontFamily: 'JetBrains Mono, monospace' }}>{d.name}</span>
                  <span style={{
                    fontSize: 9, padding: '1px 6px', borderRadius: 4,
                    background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)',
                    color: '#34d399', fontWeight: 600,
                  }}>
                    SYNTHETIC ONLY
                  </span>
                </div>
                <div style={{ fontSize: 11.5, color: '#64748b', marginBottom: 4 }}>{d.full}</div>
                <div style={{ fontSize: 11, color: '#475569' }}><strong style={{ color: '#334155' }}>Used for:</strong> {d.usedFor}</div>
                <div style={{ fontSize: 11, color: '#475569' }}><strong style={{ color: '#334155' }}>License:</strong> {d.license}</div>
              </div>
            ))}
            <div style={{ fontSize: 11, color: '#1e3a5f', marginTop: 6 }}>
              No real patient data from ADNI or OASIS is included in this application.
              Statistical parameters were used only to calibrate synthetic data generation.
            </div>
          </div>

          {/* Future validation */}
          <div className="glass-card animate-fade-in-up delay-600" style={{ padding: '20px' }}>
            <SectionTitle>Path to Clinical Deployment</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                ['1. Prospective Validation', 'Validate on real ADNI/OASIS cohorts under institutional DUAs'],
                ['2. Bias Auditing', 'Evaluate fairness metrics across all demographic strata'],
                ['3. Clinical Pilot', 'Prospective observational study at partnering neurology centre'],
                ['4. Regulatory Review', 'FDA 510(k) / CE MDR / UKCA assessment as clinical CDSS'],
                ['5. EHR Integration', 'HL7 FHIR-compliant integration with hospital information systems'],
                ['6. Continuous Monitoring', 'Post-deployment performance drift monitoring and model refresh'],
              ].map(([t, d]) => (
                <div key={t} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#334155', marginTop: 6, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>{t}</div>
                    <div style={{ fontSize: 11, color: '#334155' }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
