require("@adobe/coral-spectrum/dist/js/coral.js");
require("@adobe/coral-spectrum/dist/css/coral.css");
require("@spectrum-css/breadcrumb/dist/index.css");
require("./main.css");

import Vue from "vue";
import Router from "vue-router";
import App from "./App";
import router from "./router";
import { loadingActions } from "./components/LoadingStore";
import CloudManagerApi from "./client/wrapper/CloudManagerApi";

// Plugins
Vue.use(Router);

Vue.use({
  install(vue) {
    vue.prototype.$showLoadingScreen = () => {
      loadingActions.show();
    };
    vue.prototype.$hideLoadingScreen = () => {
      loadingActions.hide();
    };
    vue.prototype.$openExternalLink = (link: string) => {
      electron.shell.openExternal(link);
    };
    vue.prototype.$CloudManagerApi = CloudManagerApi.getInstance();
    vue.prototype.$downloadFile = (url: string) => {
      var link = document.createElement("a");
      link.href = url;
      link.download = url.substring(url.lastIndexOf("/") + 1, url.length);
      link.click();
    };
    vue.prototype.$poll = async function poll<T>(
      fn: () => Promise<any>,
      onData: (data: T) => boolean,
      throttle?: number
    ) {
      const _throttle = throttle || 5000;
      let lastPollStarted: number;
      async function _poll<T>(
        _fn: () => Promise<any>,
        _onData: (data: T) => void
      ) {
        lastPollStarted = new Date().getTime();
        let response = await _fn();
        if (response.status !== 200) {
          // Get and show the message
          var stopPolling = onData(response);
          if (stopPolling) {
            return;
          }
          const lastPollFinished = new Date().getTime();
          const elapsed = lastPollFinished - lastPollStarted;
          if (elapsed < _throttle) {
            await new Promise(resolve =>
              setTimeout(resolve, _throttle - elapsed)
            );
          }
          // Call subscribe() again to get the next message
          await _poll(_fn, _onData);
        } else {
          console.error("Got non-200 response while polling: ", response);
        }
      }
      _poll(fn, onData);
    };
  }
});

// Filters

Vue.filter("date", function(value: string) {
  if (!value) return "";
  value = value.toString();
  var date = new Date(value);
  return Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  }).format(date);
});

Vue.filter("lowercase", function(value: string) {
  return value?.toLowerCase();
});

Vue.filter("limit", function(value: string, limit: number) {
  if (!value) return "";
  value = value.toString();
  const length = value.length;
  if (value.length < limit) return value;
  else {
    const half = Math.floor(limit / 2);
    const pre = value.substring(0, half - 1);
    const post = value.substring(length - half + 2);
    return `${pre}...${post}`;
  }
});

// app

new Vue({
  el: "#app",
  router,
  render: h => h(App)
});
