# Planung (Modul für Lehrerpult)

Jahresübersicht, Stoffverteilung mit Bildungsplan, Kalender (iCal/CSV) und Wochenansicht. Enthält keine Schülerdaten.

- `src/` Quellen (app.js, cal.js, CSS, Symbole). `python3 planung/build.py` erzeugt daraus `../planung.js` (bitte mit einchecken).
- `../plan.json` Plandaten (Stunden, Stoffblöcke, Bildungsplan-Texte, Stundenplan-Rhythmus, Ferien-Vorgaben). Wird von Claude und per Hand gepflegt, die App lädt sie bei jedem Start (offline aus dem Zwischenspeicher).
- Eigene Änderungen der Nutzerin (Haken, Stunden, Notizen, Kalender) liegen in `S.planung` im Lehrerpult-Zustand und laufen über den normalen Sync mit.
- Einbindung in `index.html`: ein Menüpunkt, `VIEWS.planung`, `AFTER.planung` und `loadPlanung()`.
- Das Modul läuft in einem Shadow DOM, damit sich die Stile von Lehrerpult und Planung nicht beeinflussen.
