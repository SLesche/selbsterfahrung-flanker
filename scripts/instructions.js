"use strict";

timeline.push(screen(`
  <h1>Die Pfeil-Aufgabe</h1>
  <p>Gleich siehst du immer fünf Pfeile nebeneinander. Deine Aufgabe: Entscheide, wohin der <strong>mittlere Pfeil</strong> zeigt. Ignoriere die vier Pfeile außen.</p>
  <p>Mittlerer Pfeil nach links: <strong>Taste D</strong><br>
  Mittlerer Pfeil nach rechts: <strong>Taste L</strong></p>
  <p>Lege den linken Zeigefinger auf D und den rechten Zeigefinger auf L. Antworte so schnell und genau wie möglich.</p>`, "instructions"));

timeline.push(screen(`
  <h1>So funktioniert’s</h1>
  <p class="example">${arrowMarkup("←←←←←")}</p>
  <p>Hier zeigt der mittlere Pfeil nach links: Drücke <strong>D</strong>.</p>
  <p class="example">${arrowMarkup("←←→←←")}</p>
  <p>Hier zeigt der mittlere Pfeil nach rechts: Drücke <strong>L</strong>.</p>
  <p>${CONFIG.fixationMs > 0 ? "Schau zuerst auf das Kreuz in der Mitte. " : "Schau auf die Mitte des Bildschirms. "}${CONFIG.stimulusMs === null ? "Die Pfeile bleiben sichtbar, bis du antwortest oder die Antwortzeit abgelaufen ist." : "Die Pfeile erscheinen nur kurz. Du kannst auch noch antworten, wenn sie schon verschwunden sind."} Du hast höchstens ${(CONFIG.responseWindowMs / 1000).toLocaleString("de-DE")} Sekunden Zeit. Wenn du zu lange wartest, geht es automatisch weiter.</p>`, "examples"));

timeline.push(screen(`
  <h1>Erst einmal üben</h1>
  <p>Du startest mit ${RUN.practiceTrials} Übungsdurchgängen. Nach jeder Antwort erfährst du, ob sie richtig war.</p>
  <p>Wenn du mindestens ${CONFIG.practiceMinAccuracy * 100} % richtig beantwortest, geht es weiter. Sonst wiederholst du die Übung. Nicht beantwortete Durchgänge zählen als Fehler.</p>
  <p>Danach folgen ${CONFIG.blocks} Blöcke mit jeweils ${RUN.trialsPerBlock} Durchgängen. Zwischen den Blöcken kannst du eine Pause machen. Im Hauptteil gibt es keine Rückmeldung zu einzelnen Antworten.</p>
  <p>Bereit? Achte immer auf den mittleren Pfeil!</p>`, "practice_intro"));
