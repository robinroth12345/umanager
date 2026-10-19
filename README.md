# UManager

Gemeinsame Unterrichts-App von Robin und einem Kollegen: das **Lehrerpult** (Noten, Sitzpläne, Stundenplan, Stoffpläne, Sync) zusammen mit dem Modul **Planung** (Jahresübersicht, Stoffverteilung mit Bildungsplan, Kalender).

Live-App: https://umanager2026.netlify.app

Installieren: iPad/iPhone in Safari öffnen, Teilen, "Zum Home-Bildschirm". Android in Chrome Menü, "App installieren". Windows in Chrome/Edge über das Installieren-Symbol in der Adressleiste.

## Aufbau

| Datei/Ordner | Inhalt |
|---|---|
| `index.html` | Die App als Einzeldatei (Lehrerpult) |
| `sw.js`, `manifest.webmanifest`, Icons | Offline-Hülle und Installierbarkeit (PWA) |
| `version.json` | Versionsnummer, wird von der App zur Update-Prüfung abgerufen |
| `planung.js` | Fertig gebautes Planungsmodul (nicht von Hand ändern) |
| `planung/` | Quellen des Planungsmoduls und `build.py`, siehe `planung/README.md` |
| `plan.json` | Plandaten ohne Schülerdaten, wird beim Start geladen |
| `_redirects` | Weiterleitungen für Kalender-Abos (nur für Netlify gedacht) |

## Schülerdaten

Schülerdaten gehören nie in dieses Repo (Noten, Namen, Sitzpläne, Elterninfos, Sicherungen, Exporte). Das Repo ist öffentlich. Die Daten liegen nur im Speicher der Geräte beziehungsweise im verschlüsselten Sync von Lehrerpult.

## Lokal testen

Die App lädt `plan.json` und `planung.js` per Abruf. Deshalb nicht die Datei per Doppelklick öffnen, sondern einen kleinen Webserver im Repo-Ordner starten:

```
python3 -m http.server 8000
```

Dann http://localhost:8000 öffnen. Das Planungsmodul wird nach Änderungen in `planung/src` mit `python3 planung/build.py` neu gebaut. Danach `planung.js` mit einchecken.

## Zusammenarbeit

Siehe [CONTRIBUTING.md](CONTRIBUTING.md). Kurz: Nie direkt auf `main`, immer Branch, Pull Request, Review, Zusammenführen.

## Hosting

Netlify baut bei jeder Änderung an `main` automatisch neu. Build command leer, Publish directory `.`. Cloudflare Pages funktioniert mit dieser Struktur nicht ohne Anpassung, weil `_redirects` externe Weiterleitungen (Kalender-Abos) enthält, die Cloudflare ablehnt.

## Stand

Ausgangsstand: Lehrerpult-Code aus `HTML-Apps/Lehrerpult` (Stand 2026-10-19), Planungsmodul in `main`. Noch ungetestet: Sync von `S.planung` (pCloud, Nextcloud, iCloud), Safari/iPad, Firefox, Service Worker mit `plan.json` und `planung.js`.
