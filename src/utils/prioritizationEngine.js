// ============================================================
// VIGIL AI — Prioritization Engine
// Sequential Value-of-Information Diagnostic Engine
// ============================================================

/** Recalculate risk score dynamically from patient fields */
export const calcRiskScore = (patient) => {
  let score = 0;
  const p = patient;

  // Cognitive domain
  score += Math.max(0, (26 - p.moca) * 2.2);
  score += Math.max(0, (28 - p.mmse) * 1.4);
  score += Math.min((p.faq || 0) * 2.5, 18);
  score += (p.cdr || 0) * 12;

  // Plasma biomarkers
  if (p.biomarkers) {
    if (p.biomarkers.ptau217 > 0.45)    score += 12;
    else if (p.biomarkers.ptau217 > 0.30) score += 7;
    if (p.biomarkers.ab4240 < 0.057)    score += 9;
    else if (p.biomarkers.ab4240 < 0.08) score += 5;
    if (p.biomarkers.nfl > 18)           score += 6;
    if (p.biomarkers.gfap > 180)         score += 5;
  }

  // MRI structural
  if (p.mri) {
    score += Math.min(Math.max(0, (20 - p.mri.hippocampalPctile) * 0.7), 14);
    if (p.mri.brainAgeGap > 6)          score += 6;
    else if (p.mri.brainAgeGap > 3)     score += 3;
    if (p.mri.entorhinalAtrophy)         score += 5;
  }

  // Genetics
  score += (p.apoe4Count || 0) * 6;

  // Comorbidities
  const riskComorb = ['Hypertension', 'Type 2 Diabetes', 'Depression', 'TIA History', 'Vascular Disease'];
  const cc = (p.comorbidities || []).filter(c => riskComorb.includes(c)).length;
  score += Math.min(cc * 2.5, 10);

  // Age
  if (p.age >= 80)       score += 8;
  else if (p.age >= 75)  score += 5;
  else if (p.age >= 70)  score += 2;

  // Education (protective)
  const EDUS = ['< High School', 'High School Diploma', 'Some College', "Bachelor's Degree", 'Graduate Degree'];
  score -= (EDUS.indexOf(p.education) || 0) * 1.2;

  return Math.min(100, Math.max(0, Math.round(score)));
};

export const getCategory = (score) => {
  if (score >= 70) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
};

/**
 * Value-of-Information Engine
 * Determines which available next test yields the greatest expected
 * reduction in diagnostic uncertainty, given current evidence state.
 */
export const computeVoI = (patient, score) => {
  const p = patient;
  const tests = [];

  // ── Blood Biomarkers ──────────────────────────────────────────
  if (!p.biomarkers) {
    let gain = 0;
    if (score >= 60)       gain = 0.75 + (score - 60) / 200;
    else if (score >= 40)  gain = 0.55 + (score - 40) / 150;
    else                   gain = 0.22;
    tests.push({
      test: 'Blood Biomarkers',
      voiGain: parseFloat(Math.min(gain, 0.95).toFixed(2)),
      available: true,
      cost: 180,
      waitDays: 3,
      rationale: 'Plasma p-tau217 and Aβ42/40 ratio can markedly reduce amyloid/tau pathology uncertainty with a non-invasive, lower-cost test before committing to imaging.',
    });
  }

  // ── MRI ───────────────────────────────────────────────────────
  if (!p.mri) {
    let gain = 0;
    if (p.biomarkers?.ptau217 > 0.40) gain = 0.80 + (score - 55) / 250;
    else if (score >= 60)              gain = 0.62 + (score - 60) / 200;
    else if (score >= 40)              gain = 0.40;
    else                               gain = 0.18;
    tests.push({
      test: 'MRI',
      voiGain: parseFloat(Math.min(gain, 0.94).toFixed(2)),
      available: true,
      cost: 850,
      waitDays: 12,
      distanceKm: p.region.distMRI,
      rationale: 'Structural hippocampal volumetrics and entorhinal thickness measurement can confirm neurodegeneration consistent with Alzheimer trajectory and quantify progression stage.',
    });
  }

  // ── PET ───────────────────────────────────────────────────────
  if (!p.pet && (p.mri || p.biomarkers)) {
    let gain = 0;
    if (p.mri?.hippocampalPctile < 10) gain = 0.88 + (score - 70) / 300;
    else if (score >= 70)               gain = 0.78;
    else if (score >= 55)               gain = 0.58;
    else                                gain = 0.25;
    tests.push({
      test: 'PET Scan',
      voiGain: parseFloat(Math.min(gain, 0.97).toFixed(2)),
      available: score >= 70,
      cost: 4800,
      waitDays: 28,
      distanceKm: p.region.distPET,
      rationale: 'Amyloid/Tau PET provides definitive molecular confirmation and determines eligibility for disease-modifying therapies (Lecanemab/Donanemab). Highest certainty but highest resource cost.',
    });
  }

  // Rank by gain
  tests.sort((a, b) => b.voiGain - a.voiGain);

  const recommended = tests[0] || {
    test: 'Annual Re-Screening',
    voiGain: 0.10,
    available: true,
    cost: 0,
    waitDays: 365,
    rationale: 'Current risk level does not justify advanced diagnostic escalation. Annual cognitive monitoring is the most appropriate next step.',
  };

  return { recommended, all: tests };
};

/**
 * Equity Score (0–100, higher = more accessibility barriers)
 * This represents access difficulty, NOT clinical need reduction.
 */
export const computeEquityBarrier = (patient) => {
  const r = patient.region;
  let barrier = 0;
  if (r.distPET > 150) barrier += 40;
  else if (r.distPET > 80) barrier += 25;
  else if (r.distPET > 30) barrier += 15;
  else barrier += 5;
  if (r.accessCost > 300) barrier += 35;
  else if (r.accessCost > 150) barrier += 22;
  else if (r.accessCost > 80) barrier += 10;
  return Math.min(100, barrier);
};

/**
 * Composite Queue Priority
 * Accounts for clinical score + equity urgency
 */
export const compositeQueueScore = (patient) => {
  const equityBarrier = computeEquityBarrier(patient);
  // High equity barrier on high-risk patients boosts queue urgency slightly
  const equityBonus = patient.category === 'High' ? equityBarrier * 0.08 : 0;
  return Math.min(100, patient.score + equityBonus);
};

/**
 * What-If Simulation
 * Given a base patient and a set of modified fields, return updated scores.
 */
export const simulateWhatIf = (basePatient, modifications) => {
  const modified = { ...basePatient, ...modifications };
  if (modifications.biomarkers !== undefined) {
    modified.biomarkers = modifications.biomarkers;
  }
  if (modifications.mri !== undefined) {
    modified.mri = modifications.mri;
  }
  const newScore = calcRiskScore(modified);
  const newCategory = getCategory(newScore);
  const voi = computeVoI(modified, newScore);
  return {
    score: newScore,
    category: newCategory,
    delta: newScore - basePatient.score,
    voiRecommendation: voi.recommended,
  };
};
