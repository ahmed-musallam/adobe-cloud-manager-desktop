require("@adobe/coral-spectrum/dist/js/coral.js")
require("@adobe/coral-spectrum/dist/css/coral.css")
import Vue from 'vue'
import App from './App'

new Vue({
  el: '#app',
  render: h => h(App)
});
//document.getElementById("test").innerHTML = "TEST"