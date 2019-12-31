import Vue from "vue";
import Router from "vue-router";
import Program from "./components/Program";
import Pipeline from "./components/Pipeline";
import Settings from "./components/Settings";

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
    },
    {
      path: "/settings",
      component: Settings
    }
  ]
});
