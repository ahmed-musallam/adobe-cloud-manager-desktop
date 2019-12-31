import Vue from "vue";
import Router from "vue-router";
import Program from "./components/Program.vue";
import Pipeline from "./components/Pipeline.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/program/:programId",
      component: Program
    },
    {
      path: "/program/:programId/pipeline/:pipelineId",
      component: Pipeline
    }
  ]
});
