import { loadingActions } from "../components/LoadingStore";
import { PluginObject } from "vue";
import { Toast } from "@adobe/coral-spectrum/coral-component-toast";

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
    $toast: function(text: string, variant = "info", dismissAfter = 5000) {
      const toast = new Toast().set({
        content: {
          textContent: text
        },
        variant: variant || "info",
        autoDismiss: dismissAfter
      });
      toast.show();
      toast.on("coral-overlay:close", () => {
        if (Toast._queue && Toast._queue.length === 0) {
          // empty queue, destroy elements, no need to keep them in dom
          document.querySelectorAll("coral-toast").forEach(toast => toast.remove());
        }
      });
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
