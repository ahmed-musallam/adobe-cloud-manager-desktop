const { menubar } = require('menubar');
const path = require('path')
const auth = require('@adobe/jwt-auth');
require('dotenv').config()
const debug = !!process.env.DEBUG_E;

/*
const JWT_CONFIG = {
  clientId: process.env.API_KEY,
  clientSecret: process.env.CLIENT_SECRET,
  privateKey: fs.readFileSync(process.env.PRIVATE_KEY),
  technicalAccountId:  process.env.TECHNICAL_ACCOUNT,
  orgId: process.env.ORGANIZATION_ID,
  metaScopes: process.env.SCOPES.split(",")
};

// https://www.adobe.io/apis/experiencecloud/cloud-manager/api-reference.html
function apiCall (accessToken, url, method) {
  return fetch(url, {
    'method': method,
    'headers': {
      'x-gw-ims-org-id': process.env.ORGANIZATION_ID,
      'x-api-key': process.env.API_KEY,
      'Authorization': `Bearer ${accessToken}`
    }
  })
}

function getAccessToken(config) {
  return auth(config)
  .then(tokenResponse => tokenResponse.access_token)
}

getAccessToken(JWT_CONFIG)
.then(token => {
  console.log("got token", token);
  apiCall(token, "https://cloudmanager.adobe.io/api/programs", "GET")
  .then(resp => resp.json())
  .then(json => JSON.stringify(json))
  .then(console.log)
  .catch(err => console.error(err))
})
*/

const mb = menubar({
  icon: "icon/icon.png",
  browserWindow: {
    width: 400,
    height: 600,
    resizable: false,
    alwaysOnTop: debug, // debug
    devTools: debug, // debug
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  },
  showDockIcon: debug, // debug
  windowPosition: debug ? 'topLeft' : undefined// debug
});

mb.on('ready', () => {
  console.log('Menubar app is ready.');
});

mb.on('after-create-window', () => mb.window.openDevTools()); // debug
