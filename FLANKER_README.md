# Flanker: R im Seminar

1. Roh-CSVs aller Personen im Flanker-Hauptordner unter `data/` sammeln.
2. Den **Flanker-Hauptordner** als R-Arbeitsverzeichnis einstellen (mit `data/`, `r_scripts/` und `index.html`).
3. Falls nötig einmalig `install.packages(c("readr", "dplyr", "tidyr"))` ausführen.
4. Die zwei Zeilen in `r_scripts/flanker_aufbereitung.R` ausführen.

Danach steht der bereinigte Long-Datensatz **daten** im Environment bereit. Der technische Import liegt in `import_flanker.R` und muss nicht bearbeitet werden. Im Einstiegsskript folgen ausschließlich acht Arbeitsimpulse ohne Lösungscode.

Eine Zeile entspricht einem Antworttrial. Übung, Fehler und Auslassungen bleiben enthalten; Fixation, Feedback und Instruktionen sind entfernt. Zentrale Variablen: `vp_id`, `run_id`, `phase`, `block`, `congruency`, `rt_ms`, `correct`, `omission`. `jspsych_trial_index` enthält die tatsächliche Reihenfolge; `practice_attempt` unterscheidet Übungswiederholungen. `testing_mode` kennzeichnet Testläufe.

Es werden keine Dateien oder Ordner angelegt, keine Ergebnisse gespeichert und keine Analysen oder Plots ausgeführt. Keine automatische Auswahl nach RT oder Genauigkeit und keine vorberechneten Sequenzeffekte. Die Studierenden entscheiden selbst über Auswahlregeln und Analysen.

Identische Mehrfachdownloads desselben Ereignisses werden beim Import entfernt. Widersprüchliche Exporte führen zu einer Fehlermeldung; mehrere echte Läufe einer Person bleiben erhalten.
