import Vue from "vue";

export const loadingStore = Vue.observable({
  show: false
});

export const loadingActions = {
  show() {
    loadingStore.show = true;
  },
  hide() {
    loadingStore.show = false;
  }
};