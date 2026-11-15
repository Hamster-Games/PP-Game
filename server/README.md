# PP-Multiplayer-Server

Dieser Node.js-Server stellt die PeerJS-Signalisierung für den PP-Multiplayer bereit. Der Host-Spieler bleibt im Spiel und führt die Welt aus; der Server vermittelt die Verbindungen und speichert keine Spielstände.

## Lokal starten

1. Installiere Node.js 18 oder neuer.
2. Starte `start.bat` einmal, damit `.env` erstellt wird. Trage dort deine öffentliche IP oder Domain bei `PUBLIC_HOST` ein, zum Beispiel `peterserver.net`.
3. Starte `start.bat` erneut. Es installiert die Abhängigkeiten und kopiert den PeerJS-Browserclient nach `vendor/`, damit das Spiel nicht von einem CDN laden muss.
4. Gib im Spiel unter **Multiplayer** die vom Server ausgegebene Adresse ein. Host und Gäste müssen dieselbe Adresse verwenden.

Alternativ kopiere `.env.example` manuell nach `.env` und führe in diesem Ordner `npm install` und danach `npm start` aus. `npm install` installiert auch den lokalen Browserclient.

Für den Standard-Port ist die direkte Adresse zum Beispiel `http://peterserver.net:9000/peerjs`. Bei einer IP-Adresse funktioniert entsprechend `http://203.0.113.10:9000/peerjs`.

## Von außerhalb des Heimnetzes erreichbar machen

- Die Domain muss per DNS auf die öffentliche IP-Adresse des Servers zeigen.
- Leite den konfigurierten TCP-Port im Router an den Server weiter und erlaube ihn in der Firewall.
- Ist der PP-Spielclient über HTTPS geöffnet, muss auch die PeerJS-Adresse HTTPS/WSS verwenden. Nutze dafür einen Reverse-Proxy mit TLS, zum Beispiel Caddy:

  ```caddyfile
  peterserver.net {
      reverse_proxy /peerjs* 127.0.0.1:9000
  }
  ```

  Setze dann in `.env` `PUBLIC_PORT=443`, `PUBLIC_SECURE=true` und `PROXIED=true`. Der Server zeigt danach `https://peterserver.net/peerjs` als Spieladresse an.
- Bei CGNAT oder ohne öffentliche IP-Adresse ist eine direkte Router-Portweiterleitung nicht möglich; nutze einen öffentlich erreichbaren VPS.

PeerJS vermittelt die Verbindung, der Spielverkehr läuft anschließend direkt zwischen den Spielern. Bei manchen NATs oder restriktiven Netzwerken kann zusätzlich ein TURN-Server nötig sein.

## Fehlerbehebung

Wenn PP „Der PeerJS-Client fehlt“ meldet, beende den laufenden Server mit Strg+C und starte `start.bat` erneut. Das Skript installiert den Browserclient nach `vendor/`; lade danach das Spiel mit Strg+F5 neu. Eine Adresse wie `peterserver.net` funktioniert nur, wenn es deine Domain ist und ihr DNS auf deinen öffentlichen Server zeigt.

Bei wiederholten Verbindungsabbrüchen muss `start.bat` auf dem Server-PC geöffnet bleiben. Verwende im Spiel genau die vom Server ausgegebene Adresse. Läuft das Spiel über HTTPS, muss auch der Multiplayer-Server über HTTPS erreichbar sein; dafür ist ein TLS-Reverse-Proxy erforderlich.

## Einstellungen

- `PORT`: lokaler Port des Node-Servers (Standard `9000`).
- `PEER_PATH`: PeerJS-Pfad (Standard `/peerjs`).
- `PUBLIC_HOST`: öffentliche IP-Adresse oder Domain ohne Protokoll.
- `PUBLIC_PORT`: öffentlicher Port, den Spieler verwenden.
- `PUBLIC_SECURE`: `true`, wenn TLS am Reverse-Proxy endet; sonst `false`.
- `PROXIED`: `true`, wenn der Server hinter einem Reverse-Proxy läuft.

Den Server-Port nicht direkt öffentlich freigeben, wenn ein TLS-Reverse-Proxy verwendet wird; gib dann nur den HTTPS-Port des Proxys frei.
