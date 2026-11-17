"use strict";

if (!globalThis.StudySession?.vpMode) timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: () => {
    const trials = jsPsych.data.get().filter({ event: "response", phase: "main" });
    const correct = trials.filter({ correct: true });
    const percent = Math.round(100 * correct.count() / trials.count());
    const meanRt = correct.select("rt").mean();
    return `<main class="instruction"><h1>Geschafft – vielen Dank!</h1>
      <p>Du hast alle ${CONFIG.blocks} Blöcke abgeschlossen. ${percent} % deiner Antworten waren richtig.</p>
      ${correct.count() ? `<p>Bei richtigen Antworten hast du im Durchschnitt ${Math.round(meanRt)} Millisekunden gebraucht.</p>` : ""}
      <p>Bei dieser Aufgabe geht es darum, ablenkende Informationen auszublenden. Wenn die äußeren Pfeile in die andere Richtung zeigen, kann die Entscheidung schwerer fallen. Einzelne Fehler sind ganz normal.</p>
      <p>Drücke die Leertaste, um deine Ergebnisse als CSV-Datei herunterzuladen.</p></main>`;
  },
  choices: [" "],
  trial_duration: CONFIG.debriefingScreenMs,
  data: { event: "debriefing" }
});
timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<main class="instruction"><h1>Vielen Dank fürs Mitmachen!</h1><p>Der Download wurde angefordert. Falls keine Datei gespeichert wurde, klicke auf „Ergebnisse erneut herunterladen“.</p><button id="download-results" type="button">Ergebnisse erneut herunterladen</button><p>Danach kannst du dieses Fenster schließen.</p></main>',
  choices: "NO_KEYS",
  data: { event: "finished" },
  on_load: () => {
    const save = () => jsPsych.data.get().localSave("csv", dataFilename);
    if (globalThis.StudySession?.enabled) {
      globalThis.StudySession.finish(document.querySelector(".instruction"), save);
      return;
    }
    document.getElementById("download-results").addEventListener("click", save);
    save();
    globalThis.StudySession?.addContinue(document.querySelector(".instruction"));
  }
});
jsPsych.run(timeline);
