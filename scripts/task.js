"use strict";

// Exakte Kongruenzanzahl je Block, möglichst gleich viele linke/rechte Ziele
// innerhalb jeder Bedingung. Bei ungeraden Anzahlen wird die Extraseite gelost.
function makeBlock(count) {
  const congruentCount = Math.round(count * CONFIG.percentCongruent / 100);
  const trials = [];
  for (const [congruent, n] of [[true, congruentCount], [false, count - congruentCount]]) {
    const extraLeft = jsPsych.randomization.sampleWithoutReplacement([true, false], 1)[0];
    const leftCount = Math.floor(n / 2) + (n % 2 && extraLeft ? 1 : 0);
    for (let i = 0; i < n; i++) trials.push({ congruent, target: i < leftCount ? "left" : "right" });
  }
  return jsPsych.randomization.shuffle(trials);
}

let practiceAttempt = 0;

function addBlock(count, phase, block, destination = timeline) {
  const conditions = makeBlock(count);
  conditions.forEach((condition, index) => {
    const trialTimeline = [];
    const target = condition.target;
    const flanker = condition.congruent ? target : target === "left" ? "right" : "left";
    const arrow = direction => direction === "left" ? "←" : "→";
    const stimulus = [flanker, flanker, target, flanker, flanker].map(arrow).join("");
    if (CONFIG.fixationMs > 0) trialTimeline.push({
      type: jsPsychHtmlKeyboardResponse,
      stimulus: `<div class="fixation" style="font-size: ${CONFIG.feedbackFontSizePx}px">+</div>`,
      choices: "NO_KEYS",
      trial_duration: CONFIG.fixationMs,
      data: { event: "fixation", phase, block }
    });
    trialTimeline.push({
      type: jsPsychHtmlKeyboardResponse,
      stimulus: `<div class="flanker-stim" style="font-size: ${CONFIG.stimulusFontSizePx}px">${arrowMarkup(stimulus)}</div>`,
      choices: ["d", "l"],
      stimulus_duration: CONFIG.stimulusMs,
      trial_duration: CONFIG.responseWindowMs,
      response_ends_trial: true,
      post_trial_gap: phase === "main" ? CONFIG.interTrialMs : 0,
      data: {
        event: "response", phase, block, trial_in_block: index + 1,
        congruent: condition.congruent, target_direction: target,
        flanker_direction: flanker,
        stimulus_text: stimulus,
        correct_response: target === "left" ? "d" : "l",
        actual_percent_congruent: 100 * Math.round(count * CONFIG.percentCongruent / 100) / count
      },
      on_finish: data => {
        if (phase === "practice") data.practice_attempt = practiceAttempt;
        data.correct = data.response !== null && jsPsych.pluginAPI.compareKeys(data.response, data.correct_response);
        data.accuracy = data.correct ? 1 : 0;
        data.omission = data.response === null;
      }
    });
    if (phase === "practice") trialTimeline.push({
      type: jsPsychHtmlKeyboardResponse,
      stimulus: () => {
        const previous = jsPsych.data.get().filter({ event: "response" }).last(1).values()[0];
        const message = previous.omission ? "Zu langsam! Antworte beim nächsten Mal etwas schneller."
          : previous.correct ? "Richtig!" : "Leider falsch. Achte auf den mittleren Pfeil.";
        return `<p style="font-size: ${CONFIG.feedbackFontSizePx}px">${message}</p>`;
      },
      choices: "NO_KEYS",
      trial_duration: CONFIG.practiceFeedbackMs,
      post_trial_gap: CONFIG.interTrialMs,
      data: { event: "feedback", phase, block }
    });
    destination.push({ timeline: trialTimeline });
  });
}

const practiceTimeline = [];
addBlock(RUN.practiceTrials, "practice", 0, practiceTimeline);
function practiceAccuracy() {
  const responses = jsPsych.data.get().filter({ event: "response", phase: "practice", practice_attempt: practiceAttempt });
  return responses.count() ? responses.filter({ correct: true }).count() / responses.count() : 0;
}
const repeatPractice = screen("", "practice_repeat");
repeatPractice.stimulus = () => `<main class="instruction"><h1>Üben wir noch einmal</h1><p>Du hast ${Math.round(practiceAccuracy() * 100)} % richtig beantwortet. Zum Weitermachen brauchst du mindestens ${CONFIG.practiceMinAccuracy * 100} %.</p><p>Achte nur auf den mittleren Pfeil: <strong>D für links, L für rechts.</strong> Antworte, bevor die Zeit abläuft.</p><p>Mit der Leertaste startest du die Übung erneut.</p></main>`;
repeatPractice.trial_duration = null;
timeline.push({
  timeline: [
    { timeline: practiceTimeline, randomize_order: true },
    { timeline: [repeatPractice], conditional_function: () => practiceAccuracy() < CONFIG.practiceMinAccuracy }
  ],
  on_timeline_start: () => { practiceAttempt++; },
  loop_function: () => practiceAccuracy() < CONFIG.practiceMinAccuracy
});
timeline.push(screen(`<h1>Die Übung ist geschafft!</h1><p>Jetzt beginnt der Hauptteil. Drücke D für einen mittleren Pfeil nach links und L für einen mittleren Pfeil nach rechts.</p><p>Antworte so schnell und genau wie möglich.</p><p>Block 1 von ${CONFIG.blocks} startet mit der Leertaste.</p>`, "main_intro"));
for (let block = 1; block <= CONFIG.blocks; block++) {
  addBlock(RUN.trialsPerBlock, "main", block);
  if (block < CONFIG.blocks) timeline.push(screen(`<h1>Zeit für eine Pause</h1><p>Du hast Block ${block} von ${CONFIG.blocks} geschafft.</p><p>Entspann kurz deine Hände. Wenn du bereit bist, starte mit der Leertaste den nächsten Block.</p><p>Zur Erinnerung: Entscheidend ist immer der mittlere Pfeil.</p>`, "break"));
}
