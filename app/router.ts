import Vue from 'vue'
import Router from 'vue-router'
import Program from './components/Program.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/program/:id',
      component: Program
    }
  ]
})