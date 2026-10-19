# Zusammenarbeit

## Regeln

- `main` ist geschützt. Änderungen gehen nur über einen Pull Request mit mindestens einem Review.
- Jede Änderung auf einem eigenen Branch, z. B. `feature/stundenplan-editor` oder `fix/ferien-bw`.
- Keine Schülerdaten im Repo (siehe README). Vor jedem Commit kurz prüfen, dass keine Exporte oder Sicherungen dabei sind.
- Kleine, klar beschriebene Pull Requests. Ein Thema pro PR.

## Ablauf

1. Branch von `main` anlegen. Im Browser: Repo-Seite, Branch-Auswahl oben links, neuen Namen eintippen, "Create branch".
2. Änderungen auf diesem Branch speichern (im Browser mit dem Stift-Symbol, "Commit changes", Branch wählen, nicht `main`).
3. "Compare & pull request" klicken, kurz beschreiben was sich ändert und wie es geprüft wurde.
4. Die andere Person schaut den PR an, kommentiert oder gibt frei ("Approve").
5. Nach der Freigabe zusammenführen ("Squash and merge"). Netlify aktualisiert die Live-App automatisch.

## Prüfen vor dem Zusammenführen

- Änderung im Netlify-Deploy-Preview oder lokal testen (siehe README, "Lokal testen").
- Bei Änderungen an `planung/src` erst `python3 planung/build.py`, dann `planung.js` mit einchecken.
- Bei Änderungen an `index.html`, `sw.js` oder `planung.js` in der Live-App einmal hart neu laden (Strg+F5), sonst zeigt der Service Worker eventuell noch alte Dateien.
- Wenn sich ausgelieferte Dateien ändern, `version.json` hochzählen.

## Aufgaben

Offene Aufgaben und Ideen als GitHub-Issues anlegen, damit beide sehen, wer woran arbeitet.
