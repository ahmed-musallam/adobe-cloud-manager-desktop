console.log("Running prelaod.js!");
window.ipc = require('electron-better-ipc').ipcRenderer;
const Store = require('electron-store');
window.electronStore = new Store();
window.adobeAuth = require('@adobe/jwt-auth');
