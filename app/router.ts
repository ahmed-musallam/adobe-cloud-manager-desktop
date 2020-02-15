import Router from "vue-router";
import Program from "./components/Program";
import Pipeline from "./components/Pipeline";
import Execution from "./components/Execution";
import Environment from "./components/Environment";
import Settings from "./components/Settings";

export default new Router({
  routes: [
    {
      path: "/program/:programId",
      component: Program,
      name: "program"
    },
    {
      path: "/program/:programId/environment/:environmentId",
      component: Environment
    },
    {
      path: "/program/:programId/pipeline/:pipelineId",
      component: Pipeline
    },
    {
      path: "/program/:programId/pipeline/:pipelineId/execution/:executionId",
      component: Execution
    },
    {
      path: "/settings",
      component: Settings
    }
  ]
});
