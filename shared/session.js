"use strict";

// Gemeinsame Kennung und Rückweg. Funktioniert auch ohne Server (file://).
globalThis.StudySession = (() => {
  const params = new URLSearchParams(location.search);
  const allowed = ["flanker", "musteraufgabe", "fragebogen"];
  function list(name) {
    return (params.get(name) || "").split(",").filter(value => allowed.includes(value));
  }
  const active = params.get("battery_task");
  if (allowed.includes(active) && (!params.get("participant_id")?.trim() || !params.get("battery_session_id")?.trim())) {
    throw new Error("Wrapper-Sitzung unvollständig: VP-ID oder Sitzungs-ID fehlt. Bitte über start.html neu starten.");
  }
  const enabled = Boolean(params.get("battery_session_id")) && allowed.includes(active);
  const randomId = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const sessionId = params.get("battery_session_id")?.trim() || randomId();
  const participantId = params.get("participant_id")?.trim() || `VP_${randomId()}`;
  const identity = Object.freeze({
    vp_id: participantId,
    participant_id: participantId, // Kompatibilitätsname: identisch mit vp_id
    session_id: sessionId, // Gemeinsame Bearbeitungssitzung, nicht aufgabenspezifisch
    battery_session_id: sessionId, // Kompatibilitätsname: identisch mit session_id
    battery_task: enabled ? active : ""
  });
  const vpMode = enabled && params.get("vpMode") === "true";
  const autoContinue = params.get("autoContinue") === "true";
  let transitionStarted = false;
  function returnToWrapper(exit = false) {
    const url = new URL("../start.html", location.href);
    url.searchParams.set("participant_id", params.get("participant_id") || "");
    url.searchParams.set("battery_session_id", params.get("battery_session_id"));
    url.searchParams.set("remaining", exit ? "" : list("remaining").join(","));
    url.searchParams.set("completed", [...new Set([...list("completed"), active])].join(","));
    location.assign(url.href);
  }
  return Object.freeze({
    enabled,
    vpMode,
    metadata: () => ({ ...identity }),
    filename(task) {
      if (!allowed.includes(task)) throw new Error("Unbekannte Aufgabe im Dateinamen.");
      // Sonderzeichen der ID sicher kodieren, statt sie zu löschen/verwechselbar zu machen.
      return `${encodeURIComponent(participantId)}__${encodeURIComponent(sessionId)}__${task}.csv`;
    },
    finish(container, save) {
      if (!enabled || transitionStarted) return;
      transitionStarted = true;
      container.innerHTML = '<h1>Geschafft – vielen Dank!</h1><p id="save-status">Deine Ergebnisse werden gespeichert …</p>';
      const status = container.querySelector("#save-status");
      function download() {
        try { save(); status.textContent = autoContinue ? "Gleich geht es weiter …" : "Die Aufgabe ist abgeschlossen."; return true; }
        catch (error) { status.textContent = "Der Download konnte nicht gestartet werden. Bitte erneut versuchen."; return false; }
      }
      function button(label, action) {
        const element = document.createElement("button");
        element.type = "button"; element.className = "primary-button"; element.textContent = label;
        element.addEventListener("click", action); container.appendChild(element); return element;
      }
      let downloadStarted = download();
      if (params.get("showRedownload") === "true" || !downloadStarted) button("Ergebnisse erneut herunterladen", () => {
        if (download() && autoContinue && !downloadStarted) { downloadStarted = true; schedule(); }
      });
      if (!autoContinue) button("Weiter", () => returnToWrapper());
      if (params.get("allowExitBetweenTasks") === "true") button("Sitzung beenden", () => returnToWrapper(true));
      function schedule() {
        const delay = Number(params.get("transitionDelayMs"));
        setTimeout(() => returnToWrapper(), Number.isFinite(delay) && delay >= 0 ? delay : 1500);
      }
      if (autoContinue && downloadStarted) schedule();
    },
    addContinue(container) {
      if (!enabled || container.querySelector(".study-continue")) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "study-continue";
      button.textContent = "Ergebnisse gespeichert? Weiter zur Aufgabenübersicht";
      button.addEventListener("click", () => {
        const url = new URL("../start.html", location.href);
        url.searchParams.set("participant_id", params.get("participant_id") || "");
        url.searchParams.set("battery_session_id", params.get("battery_session_id"));
        url.searchParams.set("remaining", list("remaining").join(","));
        url.searchParams.set("completed", [...new Set([...list("completed"), active])].join(","));
        location.assign(url.href);
      });
      container.appendChild(button);
    }
  });
})();
