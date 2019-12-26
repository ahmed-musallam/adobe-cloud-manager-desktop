require("@adobe/coral-spectrum/dist/js/coral.js")
require("@adobe/coral-spectrum/dist/css/coral.css")
require("@spectrum-css/breadcrumb/dist/index.css")

import Vue from 'vue'
import Router from 'vue-router'
import App from './App.vue'
import router from './router'
import {loadingActions} from './components/LoadingStore'

// Plugins
Vue.use(Router)

Vue.use({
  install: function(vue) {
    vue.prototype.$showLoadingScreen = () => {
      console.log("SHOWWWWWW")
      loadingActions.show();
    };
    vue.prototype.$hideLoadingScreen = () => {
      loadingActions.hide();
    }
  }
})

// Filters


Vue.filter('date', function (value) {
  if (!value) return ''
  value = value.toString()
  var date= new Date(value)
  return Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  }).format(date)
})

Vue.filter('limit', function (value, limit) {
  if (!value) return '';
  value = value.toString();
  const length = value.length;
  if (value.length < limit) return value;
  else {
    const half = Math.floor(limit/2);
    const pre = value.substring(0, half - 1);
    const post = value.substring(length - half + 2)
    return `${pre}...${post}`
  }
})

// app


new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
