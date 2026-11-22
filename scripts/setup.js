"use strict";

// ZENTRALER SETUP-BLOCK: Hier lässt sich die Aufgabe anpassen.
const CONFIG = Object.freeze({
  testingMode: false, // true = 4 Übungstrials und 2 Trials pro Hauptblock
  blocks: 5,
  trialsPerBlock: 60,
  percentCongruent: 50, // 0–100; Anzahl je Block wird auf ganze Trials gerundet.
  practiceTrials: 2,
  practiceMinAccuracy: 0.8, // Mindestens 80 % pro Übungsdurchgangsblock
  stimulusFontSizePx: 64, // Schriftgröße der Pfeile in Pixeln
  feedbackFontSizePx: 40, // Eigene Schriftgröße des Übungsfeedbacks in Pixeln
  arrowGapPx: 4, // Zusätzlicher Abstand zwischen den Pfeilen in Pixeln
  fixationMs: 500, // 0 = kein Fixationskreuz
  stimulusMs: null, // null = sichtbar bis Antwort oder Antwortfrist; sonst Dauer in ms
  responseWindowMs: 3000, // Antwortfrist ab Reizbeginn
  practiceFeedbackMs: 600,
  interTrialMs: 500, // Leeres Intervall vor dem nächsten Fixationskreuz
  instructionScreenMs: null, // null = selbstbestimmt mit Leertaste
  breakScreenMs: null, // null = selbstbestimmte Pausen
  debriefingScreenMs: null // null = Abschluss mit Leertaste
});

if (typeof CONFIG.testingMode !== "boolean") throw new Error("testingMode muss true oder false sein.");
const RUN = Object.freeze({
  practiceTrials: CONFIG.testingMode ? 4 : CONFIG.practiceTrials,
  trialsPerBlock: CONFIG.testingMode ? 2 : CONFIG.trialsPerBlock
});

for (const key of ["blocks", "trialsPerBlock", "practiceTrials"]) {
  if (!Number.isInteger(CONFIG[key]) || CONFIG[key] < 1) {
    throw new Error(`${key} muss eine positive ganze Zahl sein.`);
  }
}
if (!Number.isFinite(CONFIG.percentCongruent) || CONFIG.percentCongruent < 0 || CONFIG.percentCongruent > 100) {
  throw new Error("percentCongruent muss zwischen 0 und 100 liegen.");
}
if (!Number.isFinite(CONFIG.practiceMinAccuracy) || CONFIG.practiceMinAccuracy < 0 || CONFIG.practiceMinAccuracy > 1) {
  throw new Error("practiceMinAccuracy muss zwischen 0 und 1 liegen.");
}
for (const key of ["responseWindowMs", "practiceFeedbackMs", "stimulusFontSizePx", "feedbackFontSizePx"]) {
  if (!Number.isFinite(CONFIG[key]) || CONFIG[key] <= 0) throw new Error(`${key} muss positiv sein.`);
}
for (const key of ["fixationMs", "interTrialMs", "arrowGapPx"]) {
  if (!Number.isFinite(CONFIG[key]) || CONFIG[key] < 0) throw new Error(`${key} muss mindestens 0 sein.`);
}
for (const key of ["stimulusMs", "instructionScreenMs", "breakScreenMs", "debriefingScreenMs"]) {
  if (CONFIG[key] !== null && (!Number.isFinite(CONFIG[key]) || CONFIG[key] <= 0)) {
    throw new Error(`${key} muss null oder eine positive Dauer in ms sein.`);
  }
}
if (CONFIG.stimulusMs > CONFIG.responseWindowMs) throw new Error("Die Reaktionszeit muss mindestens so lang wie die Reizdauer sein.");

const jsPsych = initJsPsych();
const timeline = [];
if (!globalThis.StudySession) throw new Error("shared/session.js fehlt: Eine eindeutige Datenzuordnung ist nicht möglich.");
const taskRunId = jsPsych.randomization.randomID(10);
const dataFilename = StudySession.filename("flanker");
jsPsych.data.addProperties({
  ...StudySession.metadata(),
  task: "flanker",
  task_run_id: taskRunId,
  started_at: new Date().toISOString(),
  configured_blocks: CONFIG.blocks,
  configured_trials_per_block: CONFIG.trialsPerBlock,
  configured_percent_congruent: CONFIG.percentCongruent,
  configured_practice_trials: CONFIG.practiceTrials,
  testing_mode: CONFIG.testingMode,
  actual_practice_trials: RUN.practiceTrials,
  actual_trials_per_block: RUN.trialsPerBlock,
  practice_min_accuracy: CONFIG.practiceMinAccuracy,
  stimulus_font_size_px: CONFIG.stimulusFontSizePx,
  feedback_font_size_px: CONFIG.feedbackFontSizePx,
  arrow_gap_px: CONFIG.arrowGapPx,
  stimulus_duration_ms: CONFIG.stimulusMs,
  response_window_ms: CONFIG.responseWindowMs,
  fixation_duration_ms: CONFIG.fixationMs,
  stimulus_until_response: CONFIG.stimulusMs === null,
  practice_feedback_duration_ms: CONFIG.practiceFeedbackMs,
  inter_trial_duration_ms: CONFIG.interTrialMs,
  instruction_screen_duration_ms: CONFIG.instructionScreenMs,
  break_screen_duration_ms: CONFIG.breakScreenMs,
  debriefing_screen_duration_ms: CONFIG.debriefingScreenMs
});

function arrowMarkup(arrows) {
  return `<span class="arrow-row" style="gap: ${CONFIG.arrowGapPx}px">${Array.from(arrows, arrow => `<span>${arrow}</span>`).join("")}</span>`;
}

function screen(content, kind) {
  return {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<main class="instruction">${content}<p class="continue">Drücke die Leertaste, um weiterzumachen.</p></main>`,
    choices: [" "],
    trial_duration: kind === "break" ? CONFIG.breakScreenMs : CONFIG.instructionScreenMs,
    data: { event: kind }
  };
}
