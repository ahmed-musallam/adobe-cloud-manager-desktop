<template>
  <div v-if="execution && execution.id">
    <h3>Execution: {{ execution.id }}</h3>
    <h4>
      started by: <b>{{ execution.user }}</b>
    </h4>
    <h4>
      status: <b>{{ execution.status }}</b>
    </h4>
    <h4>
      Started: <b>{{ execution.createdAt | date }}</b>
    </h4>
    <h4>
      Last changed: <b>{{ execution.updatedAt | date }}</b>
    </h4>
    <h4>
      Finished: <b>{{ execution.finishedAt | date }}</b>
    </h4>

    <ul v-for="step in execution.embedded.stepStates" :key="step.id">
      <li>id: {{ step.id }}</li>
      <li>stepId: {{ step.stepId }}</li>
      <li>phaseId: {{ step.phaseId }}</li>
      <li>action: {{ step.action }}</li>
      <li>repository: {{ step.repository }}</li>
      <li>environment: {{ step.environment }}</li>
      <li>environmentType: {{ step.environmentType }}</li>
      <li>startedAt: {{ step.startedAt | date }}</li>
      <li>finishedAt: {{ step.finishedAt | date }}</li>
      <li>details: {{ JSON.stringify(step.details) }}</li>
      <li>status: {{ step.status }}</li>
      <li>links: {{ JSON.stringify(step.links) }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
  import { mutations } from "./BreadcrumbStore";
  import { PipelineExecution, PipelineExecutionStatusEnum } from "../client";
  import Vue from "vue";

  export default Vue.extend({
    name: "Program",

    data() {
      return {
        execution: {} as PipelineExecution
      };
    },
    async created() {
      var client = await this.$CloudManagerApi;
      try {
        this.$showLoadingScreen();
        const programId = this.$route.params.programId;
        const pipelineId = this.$route.params.pipelineId;
        const executionId = this.$route.params.executionId;
        if (programId && pipelineId && executionId) {
          const response = await client.pipelineExecution.getExecution(
            programId,
            pipelineId,
            executionId
          );
          this.execution = response.data;
          mutations.setExecution(this.execution.id || "");
        }
        this.$hideLoadingScreen();
      } catch (err) {
        console.error(err);
      }
    },

    methods: {
      getVariant(status: PipelineExecutionStatusEnum): string {
        switch (status) {
          case PipelineExecutionStatusEnum.NOTSTARTED:
          case PipelineExecutionStatusEnum.RUNNING:
            return "info";
            break;
          case PipelineExecutionStatusEnum.CANCELLING:
          case PipelineExecutionStatusEnum.CANCELLED:
            return "warning";
            break;
          case PipelineExecutionStatusEnum.FINISHED:
            return "success";
            break;
          case PipelineExecutionStatusEnum.ERROR:
          case PipelineExecutionStatusEnum.FAILED:
            return "error";
            break;
          default:
            return "info";
        }
      }
    }
  });
</script>

<style scoped>
  .status {
    display: inline;
    line-height: 32px;
    margin-left: 7px;
  }
</style>
