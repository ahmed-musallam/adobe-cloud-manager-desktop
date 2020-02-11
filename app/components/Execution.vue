<template>
  <div v-if="execution && execution.id">
    <Status :variant="execution.status" :showText="true"></Status>
    <coral-list style="max-width:300px">
      <coral-list-divider></coral-list-divider>
      <coral-list-item icon="gear"
        >ID/Step ID/Phase ID:
        <em
          >{{ execution.id }}/{{ execution.stepId }}/{{ execution.phaseId }}</em
        ></coral-list-item
      >
      <coral-list-item icon="user"
        >Started By: <em>{{ execution.user }}</em></coral-list-item
      >
      <coral-list-item icon="date"
        >Started: <em>{{ execution.createdAt | date }}</em></coral-list-item
      >
      <coral-list-item icon="date"
        >Last changed:
        <em>{{ execution.updatedAt | date }}</em></coral-list-item
      >
      <coral-list-item v-if="execution.finishedAt" icon="date"
        >Finished: <em>{{ execution.finishedAt | date }}</em></coral-list-item
      >
    </coral-list>
    <VerticalSteps>
      <VerticalStep
        v-for="step in execution.embedded.stepStates"
        :key="step.stepId"
        :variant="step.status"
        :title="step.action"
      >
        <span v-if="step.startedAt"
          >started: <em>{{ step.startedAt | date }}</em
          ><br
        /></span>
        <span v-if="step.finishedAt"
          >finished: <em>{{ step.finishedAt | date }}</em
          ><br
        /></span>
        <span v-if="step.startedAt && !step.finishedAt && step.updatedAt"
          >last updated: <em>{{ step.updatedAt | date }}</em
          ><br
        /></span>
      </VerticalStep>
    </VerticalSteps>
  </div>
</template>

<script lang="ts">
  import { mutations } from "./BreadcrumbStore";
  import { PipelineExecution, PipelineExecutionStatusEnum } from "../client";
  import VerticalSteps from "./VerticalSteps.vue";
  import VerticalStep from "./VerticalStep.vue";
  import Status from "./Status";
  import Vue from "vue";

  export default Vue.extend({
    name: "Program",

    data() {
      return {
        execution: {} as PipelineExecution
      };
    },
    components: {
      VerticalSteps,
      VerticalStep,
      Status
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

<style scoped lang="scss"></style>
