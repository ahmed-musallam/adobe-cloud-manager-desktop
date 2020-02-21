import { loadingActions } from "../components/LoadingStore";
import CloudManagerApi from "../client/wrapper/CloudManagerApi";
import { VueConstructor } from "vue/types/umd";
import { PluginObject } from "vue";

export const Plugins: PluginObject<never> = {
  install(vue) {
    Object.keys(this.prototypes).forEach(key => (vue.prototype[key] = this.prototypes[key]));
  },
  prototypes: {
    $showLoadingScreen: loadingActions.show,
    $hideLoadingScreen: loadingActions.hide,
    $openExternalLink: electron.shell.openExternal,
    $sleep: (msec: number) => new Promise(resolve => setTimeout(resolve, msec)),
    $downloadFile: (url: string) => {
      var link = document.createElement("a");
      link.href = url;
      link.download = url.substring(url.lastIndexOf("/") + 1, url.length);
      link.click();
    },
    $poll: async function poll<T>(
      fn: () => Promise<any>,
      onData: (data: T) => boolean,
      throttle?: number
    ) {
      const _throttle = throttle || 5000;
      let lastPollStarted: number;
      async function _poll<T>(_fn: () => Promise<any>, _onData: (data: T) => void) {
        lastPollStarted = new Date().getTime();
        try {
          let response = await _fn();
          var stopPolling = onData(response);
          if (stopPolling) {
            return;
          }
          const lastPollFinished = new Date().getTime();
          const elapsed = lastPollFinished - lastPollStarted;
          if (elapsed < _throttle) {
            await new Promise(resolve => setTimeout(resolve, _throttle - elapsed));
          }
          // Call subscribe() again to get the next message
          await _poll(_fn, _onData);
        } catch (e) {
          console.error("Error while polling", e);
          return;
        }
      }
      await _poll(fn, onData);
    }
  }
};
