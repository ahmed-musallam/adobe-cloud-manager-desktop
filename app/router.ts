import Router from "vue-router";
import Program from "./components/Program";
import Pipeline from "./components/Pipeline";
import Execution from "./components/Execution";
import Environment from "./components/Environment";
import Settings from "./components/Settings";
import AuthError from "./components/AuthError";

const router = new Router({
  routes: [
    {
      path: "/program/:programId",
      component: Program,
      name: "program"
    },
    {
      path: "/program/:programId/environment/:environmentId",
      component: Environment,
      name: "environment"
    },
    {
      path: "/program/:programId/pipeline/:pipelineId",
      component: Pipeline,
      name: "pipeline"
    },
    {
      path: "/program/:programId/pipeline/:pipelineId/execution/:executionId",
      component: Execution,
      name: "execution"
    },
    {
      path: "/settings",
      component: Settings,
      name: "settings"
    },
    {
      path: "/auth-error",
      component: AuthError
    }
  ]
});
router.beforeEach((to, from, next) => {
  // guard against going back to root.
  if (!to.path || to.path === "/") {
    next(false);
  } else {
    next();
  }
});

export default router;
