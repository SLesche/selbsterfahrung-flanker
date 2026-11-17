# Flanker-Aufgabe: Daten und eigene Analysen
# Arbeitsverzeichnis: Hauptordner der Aufgabe (mit data/ und r_scripts/).
# Alle unveränderten CSV-Downloads in data/ ablegen, dann diese zwei Zeilen ausführen.

source("r_scripts/import_flanker.R")
daten <- lese_flanker("data")

# daten: eine Zeile pro Antworttrial; Übung, Fehler und Auslassungen sind enthalten.
# vp_id = Person, run_id = Lauf, phase = practice/main, block = Block,
# congruency = Kongruenz, rt_ms = Reaktionszeit in ms, correct = richtige Antwort,
# omission = ausgelassene Antwort. jspsych_trial_index gibt die Reihenfolge an.
# testing_mode kennzeichnet Testläufe. Ausschlussregeln legt ihr selbst fest.

# 1. Überblick: Wie viele Personen und Aufgabenläufe liegen vor?
#    Wie viele Trials gehören zur Übung bzw. zum Hauptteil? Gibt es Testläufe?

# 2. Mittelwertsverteilung: Berechne die mittlere Reaktionszeit jeder Person.
#    Entscheide zuvor, welche Trials sinnvollerweise dazugehören.
#    Stelle die Verteilung der Personenmittelwerte grafisch dar.

# 3. Verteilungen: Wie sehen die Reaktionszeiten einzelner Trials aus?
#    Vergleiche kongruente und inkongruente Trials in einer geeigneten Grafik.

# 4. Trials nach Fehlern: Rekonstruiere innerhalb jedes Hauptblocks, ob dem
#    aktuellen Trial eine richtige oder eine falsche Antwort vorausging.
#    Wie gehst du mit dem ersten Trial eines Blocks und mit Auslassungen um?
#    Wie viele nutzbare Post-Error- und Post-Correct-Trials hat jede Person?
#    Überlege dabei, welche Trials du für RT und welche für Genauigkeit brauchst.

# 5. Post-Error Slowing: Sind richtige Antworten nach einem Fehler langsamer
#    als richtige Antworten nach einer richtigen Antwort? Bestimme den
#    Unterschied für jede Person und visualisiere die individuellen Effekte.
#    Wie behandelst du Personen ohne genügend Trials in einer der Bedingungen?

# 6. Post-Error Accuracy: Ist die Wahrscheinlichkeit einer richtigen Antwort
#    nach Fehlern anders als nach richtigen Antworten? Vergleiche die Genauigkeit
#    innerhalb jeder Person und stelle die Unterschiede grafisch dar.
#    Welche Antworten müssen hier erhalten bleiben, die du bei der RT-Analyse
#    ausgeschlossen hast? Wie wirken sich unterschiedliche Trialanzahlen aus?

# 7. Gibt es einen Effekt? Untersuche Post-Error Slowing und Post-Error Accuracy
#    auf Gruppenebene mit geeigneten statistischen Verfahren. Berücksichtige,
#    dass die Bedingungen innerhalb derselben Personen verglichen werden.
#    Wie groß und wie unsicher sind die Effekte? Geht stärkere Verlangsamung
#    bei einzelnen Personen auch mit einer höheren Genauigkeit einher?

# 8. Vertiefung: Bleiben die Post-Error-Effekte bestehen, wenn ihr die aktuelle
#    und vorherige Kongruenz, den Blockverlauf oder Antwortwiederholungen
#    berücksichtigt? Prüft auch den Einfluss eurer RT-Grenzen und der geforderten
#    Mindestanzahl an Post-Error-Trials. Wie könnte ein Modell die Abhängigkeit
#    von Trials derselben Person und die ungleichen Trialanzahlen berücksichtigen?
#    Bedeutet Verlangsamung nach Fehlern automatisch eine bessere Anpassung?
