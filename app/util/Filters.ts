import { loadingActions } from "../components/LoadingStore";
import CloudManagerApi from "../client/wrapper/CloudManagerApi";
import { VueConstructor } from "vue/types/umd";
import { PluginObject } from "vue";

export const Filters: PluginObject<never> = {
  install(vue) {
    Object.keys(this.filters).forEach(key =>
      vue.filter(key, this.filters[key])
    );
  },
  filters: {
    // filter to display date in anice format
    date(value: string) {
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
    },
    // filter to only display date
    dateNoTime(value: string) {
      if (!value) return "";
      value = value.toString();
      var date = new Date(value);
      return Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric"
      }).format(date);
    },
    lowercase: (value: string) => value?.toLowerCase(),
    // filter to limit string to a certain length and add "..." in the middle
    limit(value: string, limit: number) {
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
    }
  }
};
