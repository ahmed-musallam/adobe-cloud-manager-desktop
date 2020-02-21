<template>
  <div>
    <EnvironmentsTable v-if="render"></EnvironmentsTable>
    <PipelinesTable v-if="render"></PipelinesTable>
  </div>
</template>

<script lang="ts">
  import { mutations } from "./BreadcrumbStore";
  import { async } from "q";
  import { Pipeline, Program, Environment } from "../client";
  import Vue from "vue";
  import CloudManagerApi from "../client/wrapper/CloudManagerApi";
  import DebugDrawer from "./DebugDrawer.vue";
  import EnvironmentsTable from "./EnvironmentsTable.vue";
  import PipelinesTable from "./PipelinesTable.vue";

  export default Vue.extend({
    name: "Program",

    data() {
      return {
        render: true
      };
    },
    beforeRouteEnter(to, from, next) {
      next(vm => vm.reRenderProgram());
    },
    beforeRouteUpdate(to, from, next) {
      this.reRenderProgram();
      next();
    },
    components: {
      DebugDrawer,
      EnvironmentsTable,
      PipelinesTable
    },
    methods: {
      reRenderProgram() {
        this.render = false;
        this.$nextTick(() => (this.render = true));
      }
    }
  });
</script>

<style scoped></style>
