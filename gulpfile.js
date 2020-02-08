const { series, parallel } = require("gulp");
const fs = require("fs-extra");
const Bundler = require("parcel-bundler");
const Path = require("path");
const { spawn } = require("child_process");
const packager = require("electron-packager");
const createDMG = require("electron-installer-dmg");
const path = require("path");

const PACKAGER_OPTIONS = {
  name: "Cloud Manager Menubar",
  dir: "./",
  platform: "darwin",
  arch: "x64",
  overwrite: true,
  icon: "icon/icon",
  ignore: [
    // ignored from the produced electron app when packaging.
    ".cache",
    ".vscode",
    "app",
    "@adobe/coral-spectrum",
    "@adobe/spectrum-css",
    "vue",
    "popper.js",
    "core-js",
    "spectrum-css"
  ].map(toWildRegex)
};

// makes any passed string a wile regex. Example: test => /.*test.*/g
function toWildRegex(str) {
  var escaped = str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  return new RegExp(`.*${escaped}.*`, "g");
}

// spawn proccess and pipe output to stdout and stderr
function spawnAndLog(command, params) {
  const cp = spawn(command, params);
  cp.stdout.pipe(process.stdout);
  cp.stderr.pipe(process.stderr);
  return cp;
}

function prettierTask() {
  return spawnAndLog("prettier", [
    "--vue-indent-script-and-style",
    "--write",
    "./app/**.{js,ts,vue}",
    "./app/**/**.{js,ts,vue}"
  ]);
}

function copyAssetsTask(cb) {
  return fs.copy(
    "node_modules/@adobe/coral-spectrum/dist/resources",
    "dist/resources"
  );
}

function bundleTask(watch) {
  const bundler = new Bundler("./app/main.js", { watch: !!watch });
  return () => bundler.bundle();
}

function electronTask(debug) {
  process.env.DEBUG_E = !!debug;
  return () => spawnAndLog("electron", ["."]);
}

async function packageTask(cb) {
  const appPaths = await packager(PACKAGER_OPTIONS);
  console.log(`Electron app bundles created:\n${appPaths.join("\n")}`);
  cb();
}

function dmgTask(options) {
  return cb => {
    const appFolder = `${options.name}-${options.platform}-${options.arch}`;
    const appName = `${options.name}.app`;
    createDMG(
      {
        appPath: path.join(appFolder, appName),
        out: appFolder,
        title: options.name,
        name: options.name,
        icon: `${options.icon}.icns`,
        overwrite: true
      },
      err => {
        console.error(err);
        console.log(`Electron DMG created`);
      }
    );
    cb();
  };
}

exports["ui:build"] = series(prettierTask, copyAssetsTask, bundleTask());
exports["ui:watch"] = series(prettierTask, copyAssetsTask, bundleTask(true));
exports["electron:watch"] = parallel(
  prettierTask,
  this["ui:watch"],
  electronTask()
);
exports["electron:watch:debug"] = parallel(
  prettierTask,
  this["ui:watch"],
  electronTask(true)
);
exports["electron:package"] = parallel(packageTask);
exports["electron:dmg"] = series(packageTask, dmgTask(PACKAGER_OPTIONS));
exports.default = exports["electron:watch"];
