const packager = require("electron-packager");

async function bundleElectronApp(options) {
  const appPaths = await packager(options);
  console.log(`Electron app bundles created:\n${appPaths.join("\n")}`);
}

function contains(str) {
  var escaped = str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  return new RegExp(`.*${escaped}.*`, "g");
}

bundleElectronApp({
  name: "Adobe Cloud Manager Menubar",
  dir: "./",
  platform: "darwin",
  arch: "x64",
  overwrite: true,
  icon: "app/icon/icon",
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
