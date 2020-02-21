import { loadingActions } from "../components/LoadingStore";
import CloudManagerApi from "../client/wrapper/CloudManagerApi";
import { VueConstructor } from "vue/types/umd";
import { PluginObject } from "vue";

export const Filters: PluginObject<never> = {
  install(vue) {
    Object.keys(this.filters).forEach(key => vue.filter(key, this.filters[key]));
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
    },
    // https://stackoverflow.com/a/8212878/5633515
    humanReadableDuration(milliseconds: number) {
      function numberEnding(number: number) {
        return number > 1 ? "s" : "";
      }

      var temp = Math.floor(milliseconds / 1000);
      var years = Math.floor(temp / 31536000);
      if (years) {
        return years + " year" + numberEnding(years);
      }
      //TODO: Months! Maybe weeks?
      var days = Math.floor((temp %= 31536000) / 86400);
      if (days) {
        return days + " day" + numberEnding(days);
      }
      var hours = Math.floor((temp %= 86400) / 3600);
      if (hours) {
        return hours + " hour" + numberEnding(hours);
      }
      var minutes = Math.floor((temp %= 3600) / 60);
      if (minutes) {
        return minutes + " minute" + numberEnding(minutes);
      }
      var seconds = temp % 60;
      if (seconds) {
        return seconds + " second" + numberEnding(seconds);
      }
      return "less than a second"; //'just now' //or other string you like;
    }
  }
};
