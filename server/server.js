'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { PeerServer } = require('peer');

function loadEnvFile() {
  const envFile = path.join(__dirname, '.env');
  if (!fs.existsSync(envFile)) return;

  fs.readFileSync(envFile, 'utf8').split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const separator = trimmed.indexOf('=');
    if (separator < 1) return;

    const name = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[name] === undefined) process.env[name] = value;
  });
}

function readPort(name, fallback) {
  const value = Number(process.env[name] || fallback);
  if (!Number.isInteger(value) || value < 1 || value > 65535) {
    throw new Error(`${name} muss eine Portnummer von 1 bis 65535 sein.`);
  }
  return value;
}

function readBoolean(name, fallback) {
  const value = process.env[name];
  if (value === undefined || value === '') return fallback;
  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;
  throw new Error(`${name} muss true oder false sein.`);
}

function startServer() {
  loadEnvFile();

  const port = readPort('PORT', 9000);
  const publicPort = readPort('PUBLIC_PORT', port);
  const peerPath = process.env.PEER_PATH || '/peerjs';
  const publicHost = (process.env.PUBLIC_HOST || 'localhost').trim();
  const publicSecure = readBoolean('PUBLIC_SECURE', false);
  const proxied = readBoolean('PROXIED', false);

  if (!/^\/[a-zA-Z0-9/_-]*$/.test(peerPath) || peerPath.includes('//')) {
    throw new Error('PEER_PATH muss ein einfacher URL-Pfad sein, zum Beispiel /peerjs.');
  }
  if (!publicHost || /[\/\s?#@]/.test(publicHost)) {
    throw new Error('PUBLIC_HOST muss ein Hostname oder eine IP-Adresse ohne Protokoll sein.');
  }

  const server = PeerServer({
    port,
    path: peerPath,
    key: 'peerjs',
    allow_discovery: false,
    proxied
  });

  server.on('connection', client => {
    console.log(`Spieler verbunden: ${client.getId()}`);
  });
  server.on('disconnect', client => {
    console.log(`Spieler getrennt: ${client.getId()}`);
  });
  server.on('error', error => {
    console.error('PeerJS-Serverfehler:', error);
    process.exitCode = 1;
  });

  const scheme = publicSecure ? 'https' : 'http';
  const defaultPort = publicSecure ? 443 : 80;
  const portSuffix = publicPort === defaultPort ? '' : `:${publicPort}`;
  console.log(`PP-Multiplayer-Server läuft auf Port ${port} (alle Netzwerkschnittstellen).`);
  console.log(`PeerJS-Pfad: ${peerPath}`);
  console.log(`Adresse für das PP-Spiel: ${scheme}://${publicHost}${portSuffix}${peerPath}`);
  if (publicSecure) {
    console.log('PUBLIC_SECURE=true: Ein HTTPS-Reverse-Proxy muss WebSocket-Verbindungen weiterleiten.');
  }
  console.log('Zum Beenden Strg+C drücken.');
}

try {
  startServer();
} catch (error) {
  console.error(`Serverstart fehlgeschlagen: ${error.message}`);
  process.exitCode = 1;
}
