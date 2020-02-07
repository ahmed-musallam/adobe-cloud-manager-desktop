const packager = require("electron-packager");
const createDMG = require("electron-installer-dmg");
const path = require("path");
var APP_NAME = "Cloud Manager Menubar";

async function bundleElectronApp(options) {
  const appPaths = await packager(options);
  console.log(`Electron app bundles created:\n${appPaths.join("\n")}`);
  const appPath = `${APP_NAME}-${options.platform}-${options.arch}`;
  const appName = `${APP_NAME}.app`;
  createDMG(
    {
      appPath: path.join(appPath, appName),
      out: appPath,
      title: "Cloud Manager Menubar",
      name: APP_NAME,
      icon: `${options.icon}.icns`,
      overwrite: true
    },
    function done(err) {
      console.log(`Electron DMG created`);
    }
  );
}

function contains(str) {
  var escaped = str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  return new RegExp(`.*${escaped}.*`, "g");
}

bundleElectronApp({
  name: APP_NAME,
  dir: "./",
  platform: "darwin",
  arch: "x64",
  overwrite: true,
  icon: "icon/icon",
  ignore: [
    ".cache",
    ".vscode",
    "app",
    "@adobe/coral-spectrum",
    "@adobe/spectrum-css",
    "vue",
    "popper.js",
    "core-js",
    "spectrum-css"
  ].map(contains)
});
