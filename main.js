const { menubar } = require("menubar");
const path = require("path");
const auth = require("@adobe/jwt-auth");
const debug = !!process.env.DEBUG_E;

const mb = menubar({
  icon: path.join(__dirname, "icon/icon.png"),
  browserWindow: {
    width: 400,
    height: 600,
    resizable: false,
    alwaysOnTop: debug, // debug
    devTools: debug, // debug
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  },
  showDockIcon: debug, // debug
  windowPosition: debug ? "topLeft" : undefined // debug
});

mb.on("ready", () => {
  console.log("Menubar app is ready.");
});
if (debug) {
  mb.on("after-create-window", () => mb.window.openDevTools()); // debug
}
