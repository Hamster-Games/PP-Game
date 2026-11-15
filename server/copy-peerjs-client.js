'use strict';

const fs = require('node:fs');
const path = require('node:path');

const peerJsDirectory = path.join(__dirname, 'node_modules', 'peerjs');
const clientFile = path.join(peerJsDirectory, 'dist', 'peerjs.min.js');
const licenseFile = path.join(peerJsDirectory, 'LICENSE');
const vendorDirectory = path.resolve(__dirname, '..', 'vendor');

if (!fs.existsSync(clientFile) || !fs.existsSync(licenseFile)) {
  throw new Error('Das PeerJS-Browserpaket ist unvollständig; bitte npm install erneut ausführen.');
}

fs.mkdirSync(vendorDirectory, { recursive: true });
fs.copyFileSync(clientFile, path.join(vendorDirectory, 'peerjs.min.js'));
fs.copyFileSync(licenseFile, path.join(vendorDirectory, 'PEERJS-LICENSE.txt'));
console.log('PeerJS-Browserclient nach ../vendor installiert.');
