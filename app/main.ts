require("@adobe/coral-spectrum/dist/js/coral.js");
require("clusterize.js/clusterize.css");
require("@adobe/coral-spectrum/dist/css/coral.css");
require("@spectrum-css/breadcrumb/dist/index.css");
require("./main.css");
window.Clusterize = require("clusterize.js/clusterize.js");

import Vue from "vue";
import Router from "vue-router";
import App from "./App";
import LogTailApp from "./LogTailApp";
import router from "./router";
import { loadingActions } from "./components/LoadingStore";
import CloudManagerApi from "./client/wrapper/CloudManagerApi";
import { Plugins } from "./util/Plugins";
import { Filters } from "./util/Filters";

// Plugins
Vue.use(Router);
Vue.use(Plugins);
Vue.use(Filters);

// app

if (document.querySelector("#app")) {
  let vm = new Vue({
    el: "#app",
    router,
    render: h => h(App)
  });
} else if (document.querySelector("#logTailApp")) {
  new Vue({
    el: "#logTailApp",
    render: h => h(LogTailApp)
  });
}
