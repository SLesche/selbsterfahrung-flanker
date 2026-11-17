# Pfeil-Flanker-Aufgabe

## Gemeinsamer Start beider Aufgaben

`../start.html` öffnet den Wrapper des Gesamtpakets. ID-Eingabe und Aufgabenreihenfolge werden dort konfiguriert. `shared/session.js` stellt dieselben `vp_id` und `session_id` für beide Aufgaben bereit (`participant_id` und `battery_session_id` sind identische Aliase). Nur `task_run_id` ist aufgabenspezifisch. Dateiname: `<VP-ID>__<Sitzungs-ID>__flanker.csv`. Für einen Einzelstart reicht dieser komplette Flanker-Ordner; der Wrapper wird dafür nicht benötigt, IDs werden dann lokal erzeugt.

Nach dem Ergebnisdownload erscheint ein Button zur Aufgabenübersicht. Dort startet die nächste Aufgabe. Downloads bleiben getrennte CSV-Dateien; die gemeinsame Kennung verbindet sie. Die Aufgaben bleiben auch direkt über ihre `index.html` aufrufbar. Der Wrapper läuft lokal ohne Server; die Weitergabe erfolgt über URL-Parameter. Beim Browser-Zurück oder Neuladen wird eine laufende Aufgabe nicht wiederhergestellt.

Beide Aufgaben und der Wrapper verwenden `shared/theme.css` für Hintergrund, Text, Schriftart, Buttonfarben und Fokusmarkierungen. Aufgabenspezifische Stimulusgrößen werden weiterhin im jeweiligen Setup gesteuert.

`index.html` im Browser auf einem Computer mit Tastatur öffnen. Alle benötigten jsPsych-Dateien liegen lokal bei; es ist keine Internetverbindung erforderlich.

## Konfiguration

Der zentrale `CONFIG`-Block in `scripts/setup.js` steuert Anzahl der Hauptblöcke, Durchgänge pro Block, Prozent kongruenter Durchgänge, Übungsumfang und Zeitparameter. Standard: 5 × 60 Hauptdurchgänge, 50 % kongruent und davor 20 Übungsdurchgänge.

Mit `testingMode: true` werden 4 Übungsdurchgänge pro Versuch und 2 Durchgänge pro Hauptblock verwendet. Die Blockanzahl bleibt unverändert. Instruktionen und CSV-Metadaten berücksichtigen die tatsächlichen Anzahlen; `testing_mode` kennzeichnet Testdaten. Zurück zu `false` aktiviert wieder die regulären Trialanzahlen. Die 80-%-Übungsschwelle bleibt aktiv: Bei 4 Übungstrials müssen somit alle 4 richtig sein.

Der Kongruenzanteil gilt separat für jeden Hauptblock und für die Übung. Die kongruente Anzahl wird auf die nächste ganze Zahl gerundet. Innerhalb jeder Kongruenzbedingung sind linke/rechte Zielpfeile möglichst gleich häufig; bei ungerader Anzahl wird die zusätzliche Richtung zufällig gewählt. Jeder Block wird unabhängig gemischt.

Fünf echte Pfeile (← / →) bleiben standardmäßig bis zur Antwort sichtbar, höchstens jedoch 3000 ms ab Reizbeginn. Antwort mit **D für links** und **L für rechts**. `stimulusFontSizePx` steuert die Pfeilgröße (Standard: 64 px). Nur in der Übung folgt für 600 ms eine Rückmeldung (richtig, falsch oder zu langsam). Im Hauptteil gibt es keine Rückmeldung.

`arrowGapPx` legt einen kleinen zusätzlichen Abstand zwischen den Pfeilen fest (Standard: 4 px; 0 = ohne Zusatzabstand). Es werden keine Leerzeichen eingefügt. Der Abstand gilt auch für die Instruktionsbeispiele. `feedbackFontSizePx` steuert unabhängig von der Pfeilgröße die Schriftgröße des Übungsfeedbacks (Standard: 40 px).

Die Übung wird wiederholt, bis im jeweils letzten Übungsblock mindestens 80 % richtig beantwortet wurden (`practiceMinAccuracy: 0.8`). Auslassungen zählen als Fehler. Jeder Versuch wird neu gemischt, bleibt hinsichtlich Kongruenz und Zielrichtung ausbalanciert und wird in den Antwortdaten mit `practice_attempt` gekennzeichnet. Frühere Versuche fließen nicht in die nächste Prüfung ein.

Alle Präsentationszeiten stehen im Setup (in Millisekunden): `fixationMs`, `stimulusMs`, `responseWindowMs`, `practiceFeedbackMs` und `interTrialMs`. `stimulusMs: null` bedeutet Anzeige bis zur Antwort oder Antwortfrist; eine Zahl blendet den Reiz früher aus. `fixationMs: 0` lässt das Kreuz weg. Standardmäßig folgen im Hauptteil auf die Antwort 500 ms Leerintervall und 500 ms Fixation: insgesamt 1000 ms bis zum nächsten Reiz (außer bei Blockpausen). In der Übung kommt vorher die 600-ms-Rückmeldung hinzu: insgesamt 1600 ms.

`instructionScreenMs`, `breakScreenMs` und `debriefingScreenMs` sind standardmäßig `null` (selbstbestimmt mit Leertaste). Eine positive Zahl begrenzt die Anzeigedauer; die Leertaste erlaubt weiterhin das frühere Fortsetzen. Der abschließende Download-Bildschirm bleibt geöffnet, damit die Datei erneut heruntergeladen werden kann.

## Daten

Am Ende wird per Leertaste eine lokale CSV-Datei heruntergeladen; ein Button erlaubt einen erneuten Download. Es erfolgt keine Übertragung an einen Server. Vor dem Schließen den Download überprüfen. Die Datei enthält alle bis dahin abgeschlossenen Bildschirmereignisse; für die Hauptanalyse nach `event=response` und `phase=main` filtern. Erfasst werden u. a. Block, Trial, Zielrichtung, Flankerrichtung, Kongruenz, tatsächlicher Kongruenzanteil, Solltaste, Antwort, RT (ms), Korrektheit und ausgelassene Antworten sowie Konfiguration und zufällige Sitzungskennung. Übungsdaten sind durch `phase=practice` gekennzeichnet.

Die Originaldateien außerhalb dieses Arbeitsordners werden nicht verändert. Die vorhandene lokale jsPsych-Distribution wurde aus der Vorlage übernommen.
