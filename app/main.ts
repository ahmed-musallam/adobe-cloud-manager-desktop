require("@adobe/coral-spectrum/dist/js/coral.js")
require("@adobe/coral-spectrum/dist/css/coral.css")
require("@spectrum-css/breadcrumb/dist/index.css")

import Vue from 'vue'
import Router from 'vue-router'
import App from './App.vue'
import router from './router'

Vue.use(Router)
new Vue({
  el: '#app',
  router,
  render: h => h(App)
});

function locationHashChanged() {
  console.log("HashChanged: ", location.hash);
}

window.onhashchange = locationHashChanged;