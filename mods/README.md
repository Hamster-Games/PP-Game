# Mods für PP (PeterPaul)

In diesem Ordner liegen drei Beispiel-Mods. Öffne im Hauptmenü **🧩 Mods**, um sie einzuschalten. Die Auswahl wird in diesem Browser gespeichert und gilt für alle Welten.

## Eigene Mod erstellen

1. Erstelle in diesem Ordner eine Datei, zum Beispiel `meine-mod.js`.
2. Registriere darin eine Mod mit eindeutiger ID:

   ```js
   window.PPMods.register({
     id: 'meine-mod',
     name: 'Meine Mod',
     description: 'Eine kurze Beschreibung.',
     activate(api) {
       api.setMultiplier('jump', 1.2);
       return () => {};
     }
   });
   ```

3. Trage die Datei in `index.html` bei den anderen Mod-Scripts kurz vor `</body>` ein:

   ```html
   <script src="mods/meine-mod.js"></script>
   ```

4. Lade das Spiel neu und schalte **Meine Mod** im Mods-Fenster ein.

## Mod-API

- `api.setMultiplier(name, wert)`: setzt für die aktive Mod einen Multiplikator von `0.1` bis `5`. Erlaubte Namen: `jump`, `mining`, `movement`. Aktive Mods kombinieren ihre Multiplikatoren.
- `api.on('blockMined', callback)`: wird nach dem Abbau eines Blocks aufgerufen. Das Ereignis enthält `type` (z. B. `GOLD_ORE`), `x`, `y` und `dimension`.
- `api.notify(text)`: zeigt eine kurze Nachricht im Spiel an.
- `activate` darf eine Funktion zurückgeben, die beim Ausschalten aufgerufen wird. Die API-Einstellungen und Ereignis-Listener der Mod werden beim Ausschalten ebenfalls entfernt.

## Beispiele

- `sprungschuhe.js`: erhöht die Sprungkraft.
- `schnelle-spitzhacke.js`: beschleunigt den Blockabbau.
- `erz-alarm.js`: meldet gefundene Gold- und Diamanterze.

Mods sind JavaScript und laufen mit den Rechten der Spielseite. Füge nur Code hinzu, dem du vertraust.
