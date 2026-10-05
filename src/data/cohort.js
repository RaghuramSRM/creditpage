// ============================================================
// VIGIL AI — Synthetic Patient Cohort Dataset
// Calibrated to ADNI & OASIS-3 Statistical Distributions
// All data is synthetic and non-identifiable
// ============================================================

// Utility helpers
const rand = (min, max, dec = 1) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(dec));

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const REGIONS = [
  { name: 'Urban Core', distMRI: 3, distPET: 8, accessCost: 40 },
  { name: 'Suburban', distMRI: 12, distPET: 22, accessCost: 80 },
  { name: 'Semi-Rural', distMRI: 28, distPET: 45, accessCost: 140 },
  { name: 'Rural', distMRI: 55, distPET: 90, accessCost: 260 },
  { name: 'Remote', distMRI: 110, distPET: 180, accessCost: 480 },
];

const COMORBIDITIES_POOL = [
  'Hypertension', 'Type 2 Diabetes', 'Hyperlipidemia', 'Depression',
  'Atrial Fibrillation', 'Hypothyroidism', 'Chronic Kidney Disease',
  'Obstructive Sleep Apnea', 'Anxiety Disorder', 'Vascular Disease',
  'TIA History', 'Vitamin B12 Deficiency',
];

const ETHNICITIES = ['White', 'Black or African American', 'Hispanic/Latino', 'Asian', 'Mixed/Other'];
const GENDERS = ['Female', 'Male', 'Non-binary'];
const EDUCATIONS = [
  '< High School', 'High School Diploma', 'Some College', "Bachelor's Degree", 'Graduate Degree'
];
const STAGES = ['Screening', 'Blood Biomarkers', 'MRI', 'PET'];
const VOI_TESTS = ['Blood Biomarkers', 'MRI', 'PET Scan'];

// ── Risk factor weight definitions ─────────────────────────────
const calcRiskScore = (p) => {
  let score = 0;

  // Cognitive domain (max ~40 pts)
  const mocaContrib = Math.max(0, (26 - p.moca) * 2.2);
  const mmseContrib = Math.max(0, (28 - p.mmse) * 1.4);
  const faqContrib  = Math.min(p.faq * 2.5, 18);
  const cdrContrib  = p.cdr * 12;
  score += mocaContrib + mmseContrib + faqContrib + cdrContrib;

  // Plasma biomarkers (max ~25 pts)
  if (p.biomarkers) {
    if (p.biomarkers.ptau217 > 0.45)   score += 12;
    else if (p.biomarkers.ptau217 > 0.30) score += 7;
    if (p.biomarkers.ab4240 < 0.057)   score += 9;
    else if (p.biomarkers.ab4240 < 0.08) score += 5;
    if (p.biomarkers.nfl > 18)          score += 6;
    if (p.biomarkers.gfap > 180)        score += 5;
  }

  // MRI structural (max ~20 pts)
  if (p.mri) {
    const hippContrib = Math.max(0, (20 - p.mri.hippocampalPctile) * 0.7);
    score += Math.min(hippContrib, 14);
    if (p.mri.brainAgeGap > 6)         score += 6;
    else if (p.mri.brainAgeGap > 3)    score += 3;
    if (p.mri.entorhinalAtrophy)        score += 5;
  }

  // Genetics (max ~12 pts)
  score += p.apoe4Count * 6;

  // Comorbidities
  const riskComorbidities = ['Hypertension', 'Type 2 Diabetes', 'Depression', 'TIA History', 'Vascular Disease'];
  const comorbCount = p.comorbidities.filter(c => riskComorbidities.includes(c)).length;
  score += Math.min(comorbCount * 2.5, 10);

  // Age modifier
  if (p.age >= 80)       score += 8;
  else if (p.age >= 75)  score += 5;
  else if (p.age >= 70)  score += 2;

  // Education (protective)
  const eduIdx = EDUCATIONS.indexOf(p.education);
  score -= eduIdx * 1.2;

  // Equity modifier (accessibility penalty — does NOT reduce clinical need, increases urgency flag)
  // Not reflected in raw score but in equityFlag

  // Clamp 0–100
  return Math.min(100, Math.max(0, Math.round(score)));
};

const getCategory = (score) => {
  if (score >= 70) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
};

const getVoIRecommendation = (p, score) => {
  // Determine which stage patient is at and what the next best test is
  if (!p.biomarkers && score >= 40) return { nextTest: 'Blood Biomarkers', voiGain: rand(0.55, 0.82, 2), rationale: 'Plasma p-tau217 and Aβ42/40 can significantly refine amyloid/tau pathology probability.' };
  if (p.biomarkers && !p.mri && score >= 55) return { nextTest: 'MRI', voiGain: rand(0.60, 0.88, 2), rationale: 'Structural MRI hippocampal volumetrics can confirm neurodegeneration pattern consistent with Alzheimer\'s trajectory.' };
  if (p.mri && !p.pet && score >= 70) return { nextTest: 'PET Scan', voiGain: rand(0.70, 0.94, 2), rationale: 'Amyloid PET provides highest diagnostic certainty and determines DMT eligibility for anti-amyloid therapy.' };
  if (score < 40) return { nextTest: 'Annual Re-Screening', voiGain: rand(0.05, 0.18, 2), rationale: 'Current risk level does not justify advanced diagnostic escalation. Annual cognitive monitoring recommended.' };
  return { nextTest: 'Blood Biomarkers', voiGain: rand(0.45, 0.65, 2), rationale: 'Baseline biomarker panel to establish trajectory and refine risk stratification.' };
};

const getShapFactors = (p, score) => {
  const factors = [];
  const mocaBase = Math.max(0, (26 - p.moca) * 2.2);
  const faqBase  = Math.min(p.faq * 2.5, 18);

  factors.push({ factor: 'MoCA Score', value: p.moca, contribution: parseFloat((mocaBase / Math.max(score, 1) * 100).toFixed(1)), direction: p.moca < 24 ? 'risk' : p.moca < 27 ? 'mild' : 'protective' });
  factors.push({ factor: 'CDR-SB', value: p.cdr, contribution: parseFloat((p.cdr * 12 / Math.max(score, 1) * 100).toFixed(1)), direction: p.cdr >= 1 ? 'risk' : p.cdr > 0 ? 'mild' : 'protective' });
  factors.push({ factor: 'FAQ Score', value: p.faq, contribution: parseFloat((faqBase / Math.max(score, 1) * 100).toFixed(1)), direction: p.faq > 5 ? 'risk' : p.faq > 2 ? 'mild' : 'protective' });
  factors.push({ factor: 'APOE-ε4 Alleles', value: `${p.apoe4Count}×`, contribution: parseFloat((p.apoe4Count * 6 / Math.max(score, 1) * 100).toFixed(1)), direction: p.apoe4Count === 2 ? 'risk' : p.apoe4Count === 1 ? 'mild' : 'protective' });
  factors.push({ factor: 'Age', value: `${p.age}y`, contribution: parseFloat(((p.age >= 80 ? 8 : p.age >= 75 ? 5 : 2) / Math.max(score, 1) * 100).toFixed(1)), direction: p.age >= 75 ? 'risk' : p.age >= 70 ? 'mild' : 'protective' });

  if (p.biomarkers) {
    factors.push({ factor: 'Plasma p-tau217', value: `${p.biomarkers.ptau217} pg/mL`, contribution: parseFloat(((p.biomarkers.ptau217 > 0.45 ? 12 : 7) / Math.max(score, 1) * 100).toFixed(1)), direction: p.biomarkers.ptau217 > 0.45 ? 'risk' : 'mild' });
    factors.push({ factor: 'Aβ42/Aβ40 Ratio', value: p.biomarkers.ab4240, contribution: parseFloat(((p.biomarkers.ab4240 < 0.057 ? 9 : 5) / Math.max(score, 1) * 100).toFixed(1)), direction: p.biomarkers.ab4240 < 0.057 ? 'risk' : 'protective' });
  }

  if (p.mri) {
    factors.push({ factor: 'Hippocampal Volume', value: `${p.mri.hippocampalPctile}th %ile`, contribution: parseFloat((Math.min((20 - p.mri.hippocampalPctile) * 0.7, 14) / Math.max(score, 1) * 100).toFixed(1)), direction: p.mri.hippocampalPctile < 10 ? 'risk' : p.mri.hippocampalPctile < 25 ? 'mild' : 'protective' });
    factors.push({ factor: 'Brain Age Gap', value: `+${p.mri.brainAgeGap}y`, contribution: parseFloat(((p.mri.brainAgeGap > 6 ? 6 : 3) / Math.max(score, 1) * 100).toFixed(1)), direction: p.mri.brainAgeGap > 6 ? 'risk' : 'mild' });
  }

  return factors.sort((a, b) => b.contribution - a.contribution).slice(0, 7);
};

const genComorbidities = () => {
  const n = Math.floor(Math.random() * 4);
  const shuffled = [...COMORBIDITIES_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
};

// ── Generate a single patient record ───────────────────────────
const generatePatient = (id, forceHigh = false, forceLow = false) => {
  const age = forceHigh ? rand(72, 88, 0) : forceLow ? rand(58, 72, 0) : rand(58, 90, 0);
  const apoe4Count = forceHigh
    ? pick([1, 2, 2])
    : forceLow
    ? pick([0, 0, 0, 1])
    : pick([0, 0, 0, 1, 1, 2]);

  const moca = forceHigh
    ? rand(16, 23, 0)
    : forceLow
    ? rand(25, 30, 0)
    : rand(16, 30, 0);

  const mmse = Math.min(30, Math.max(18, Math.round(moca + rand(-2, 3))));
  const faq  = forceHigh ? rand(6, 20, 0) : forceLow ? rand(0, 3, 0) : rand(0, 20, 0);
  const cdr  = forceHigh ? pick([0.5, 1, 1, 2]) : forceLow ? pick([0, 0, 0.5]) : pick([0, 0, 0.5, 1, 2]);

  const hasBiomarkers = forceHigh || Math.random() > 0.4;
  const hasMRI = forceHigh || (hasBiomarkers && Math.random() > 0.45);
  const hasPET = forceHigh && Math.random() > 0.55;

  const biomarkers = hasBiomarkers ? {
    ptau217:  forceHigh ? rand(0.38, 0.92, 3) : forceLow ? rand(0.12, 0.28, 3) : rand(0.10, 0.92, 3),
    ptau181:  forceHigh ? rand(2.1, 5.8, 2)   : forceLow ? rand(0.8, 1.8, 2)  : rand(0.8, 5.8, 2),
    ab4240:   forceHigh ? rand(0.042, 0.062, 3) : forceLow ? rand(0.072, 0.12, 3) : rand(0.040, 0.130, 3),
    nfl:      forceHigh ? rand(14, 38, 1)      : forceLow ? rand(6, 14, 1)    : rand(6, 38, 1),
    gfap:     forceHigh ? rand(130, 380, 0)    : forceLow ? rand(60, 130, 0)  : rand(60, 380, 0),
  } : null;

  const mri = hasMRI ? {
    hippocampalPctile:  forceHigh ? rand(2, 12, 0) : forceLow ? rand(30, 75, 0) : rand(2, 80, 0),
    entorhinalThickness: forceHigh ? rand(2.1, 3.0, 2) : rand(2.8, 4.4, 2),
    entorhinalAtrophy:  forceHigh ? true : Math.random() > 0.55,
    brainAgeGap:        forceHigh ? rand(5, 14, 1) : forceLow ? rand(0, 3, 1) : rand(-1, 14, 1),
    wmlVolume:          forceHigh ? rand(6, 28, 1) : rand(1, 28, 1),
  } : null;

  const pet = hasPET ? {
    amyloidCentiloid:   rand(55, 142, 0),
    tauBraakStage:      pick([3, 4, 5]),
    fdgHypometabolism:  Math.random() > 0.4,
    dmtEligible:        Math.random() > 0.35,
    suvr:               rand(1.55, 2.45, 2),
  } : null;

  const region = pick(REGIONS);
  const comorbidities = genComorbidities();
  const gender = pick(GENDERS);
  const education = pick(EDUCATIONS);
  const ethnicity = pick(ETHNICITIES);

  const currentStage = hasPET ? 3 : hasMRI ? 2 : hasBiomarkers ? 1 : 0;
  const mocaDecline = rand(-0.5, 4.5, 1); // per year

  const basePatient = {
    id: `VGL-${String(id).padStart(4, '0')}`,
    age: parseInt(age),
    gender,
    ethnicity,
    education,
    apoe4Count,
    moca: parseInt(moca),
    mmse,
    faq: parseFloat(faq),
    cdr,
    mocaDecline1yr: parseFloat(mocaDecline),
    comorbidities,
    biomarkers,
    mri,
    pet,
    region,
    currentStage,
    lastScreened: `${2026 - Math.floor(Math.random() * 2)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    clinicianNotes: '',
    flagged: false,
  };

  const score = calcRiskScore(basePatient);
  const category = getCategory(score);
  const voi = getVoIRecommendation(basePatient, score);
  const shapFactors = getShapFactors(basePatient, score);

  return {
    ...basePatient,
    score,
    category,
    nextTest: voi.nextTest,
    voiGain: voi.voiGain,
    voiRationale: voi.rationale,
    shapFactors,
  };
};

// ── Generate full cohort ───────────────────────────────────────
const generateCohort = () => {
  const patients = [];
  // Force distribution: ~25% high, ~40% medium, ~35% low
  for (let i = 1; i <= 12; i++) patients.push(generatePatient(i, true, false));
  for (let i = 13; i <= 32; i++) patients.push(generatePatient(i, false, false));
  for (let i = 33; i <= 50; i++) patients.push(generatePatient(i, false, true));
  return patients.sort((a, b) => b.score - a.score);
};

export const PATIENT_COHORT = generateCohort();

export const COHORT_STATS = (() => {
  const total = PATIENT_COHORT.length;
  const high = PATIENT_COHORT.filter(p => p.category === 'High').length;
  const medium = PATIENT_COHORT.filter(p => p.category === 'Medium').length;
  const low = PATIENT_COHORT.filter(p => p.category === 'Low').length;
  const petQueue = PATIENT_COHORT.filter(p => p.nextTest === 'PET Scan').length;
  const dmtEligible = PATIENT_COHORT.filter(p => p.pet?.dmtEligible).length;
  const avgScore = Math.round(PATIENT_COHORT.reduce((s, p) => s + p.score, 0) / total);
  const remoteHighRisk = PATIENT_COHORT.filter(
    p => p.category === 'High' && (p.region.name === 'Remote' || p.region.name === 'Rural')
  ).length;
  return { total, high, medium, low, petQueue, dmtEligible, avgScore, remoteHighRisk };
})();

export { STAGES, EDUCATIONS, ETHNICITIES };
