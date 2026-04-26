# VocaScroll

Latein-Vokabeltrainer im Instagram-Style. Single-File-PWA, offline-fähig, mit Leitner-System.

## Lokal starten

Browser brauchen einen HTTP-Server für Service Worker:

```bash
cd vocascroll
python -m http.server 8000
```

Dann http://localhost:8000 öffnen.

## Als PWA installieren

### iPhone / iPad (Safari)
1. Seite in Safari öffnen
2. Teilen-Symbol unten antippen
3. „Zum Home-Bildschirm"

### Android (Chrome)
1. Seite in Chrome öffnen
2. Menü (⋮) → „App installieren" oder „Zum Startbildschirm hinzufügen"

### Desktop (Chrome / Edge)
1. Adressleiste → Installationssymbol rechts klicken
2. Oder Menü → „App installieren"

## Sync zwischen Geräten
Settings → JSON exportieren/importieren. Datei z.B. via AirDrop oder Mail rüberschicken.

## Bedienung
- **Discover**: vertikal swipen, Karte tippen für Übersetzung
- **Quiz**: Antwort zeigen → swipe rechts (gewusst) / links (nicht gewusst), oder Buttons
- **Add**: neue Karte, Eselsbrücke ist Pflicht
- **Settings**: Limit, Streak, Export/Import, Reset
