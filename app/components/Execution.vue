<template>
  <div v-if="execution && execution.id">
    <h3 style="margin-bottom:0">{{ pipelineName }}</h3>
    <Status :variant="execution.status" :showText="true"></Status>
    <coral-list>
      <coral-list-divider></coral-list-divider>
      <coral-list-item icon="event"
        ><b>Trigger: </b
        ><em>{{ execution.trigger | lowercase }}</em></coral-list-item
      >
      <coral-list-item icon="gear"
        ><b>ID </b><em>{{ execution.id }}</em></coral-list-item
      >
      <coral-list-item icon="user"
        ><b>Started By: </b><em>{{ execution.user }}</em></coral-list-item
      >
      <coral-list-item icon="date"
        ><b>Started: </b
        ><em>{{ execution.createdAt | date }}</em></coral-list-item
      >
      <coral-list-item icon="date"
        ><b>Last changed: </b
        ><em>{{ execution.updatedAt | date }}</em></coral-list-item
      >
      <coral-list-item v-if="execution.finishedAt" icon="date"
        ><b>Finished: </b
        ><em>{{ execution.finishedAt | date }}</em></coral-list-item
      >
    </coral-list>
    <VerticalSteps>
      <VerticalStep
        v-for="step in execution._embedded.stepStates"
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
        <button
          is="coral-button"
          v-if="
            hasLog(step) &&
              execution.status !== 'RUNNING'
          "
          @click="getLog(step)"
        >
          Download Log
        </button>
        <!--
          metrics refer to sonar metrics, need something to interpret them
          hide for now.
        <button
          is="coral-button"
          v-if="hasMetrics(step)"
          @click="getMetrics(step)"
        >
          Metrics
        </button>
        -->
        <span></span>
      </VerticalStep>
    </VerticalSteps>
    <br />
    <coral-drawer style="white-space: pre;">
      {{ JSON.stringify(execution, null, 4) }}
    </coral-drawer>
  </div>
</template>

<script lang="ts">
  import { mutations, store } from "./BreadcrumbStore";
  import {
    PipelineExecution,
    PipelineExecutionStatusEnum,
    PipelineExecutionStepState
  } from "../client";
  import VerticalSteps from "./VerticalSteps.vue";
  import VerticalStep from "./VerticalStep.vue";
  import Status from "./Status.vue";
  import Vue from "vue";

  export default Vue.extend({
    name: "Program",

    data() {
      return {
        execution: {} as PipelineExecution,
        pipelineName: store.pipeline
      };
    },
    components: {
      VerticalSteps,
      VerticalStep,
      Status
    },
    async created() {
      this.$showLoadingScreen();
      this.execution = await this.getExecution();
      mutations.setExecution(this?.execution?.id as string);
      this.$hideLoadingScreen();
      this.$poll(this.getExecution, (data: PipelineExecution) => {
        console.log("polled and got: ", data);
        this.execution = data;
      });
    },

    methods: {
      async getExecution(): Promise<PipelineExecution> {
        var client = await this.$CloudManagerApi;
        try {
          const programId = this.$route.params.programId;
          const pipelineId = this.$route.params.pipelineId;
          const executionId = this.$route.params.executionId;
          if (programId && pipelineId && executionId) {
            const response = await client.pipelineExecution.getExecution(
              programId,
              pipelineId,
              executionId
            );
            return response.data;
          }
        } catch (err) {
          console.error(err);
        }
        return {};
      },
      hasLog(step: PipelineExecutionStepState) {
        return step?._links?.http__ns_adobe_com_adobecloud_rel_pipeline_logs
          ?.href;
      },
      hasMetrics(step: PipelineExecutionStepState) {
        return step?._links?.http__ns_adobe_com_adobecloud_rel_pipeline_metrics
          ?.href;
      },
      async getMetrics(step: PipelineExecutionStepState) {
        const client = await this.$CloudManagerApi;
        const result = await client.pipelineExecution.stepMetric(
          this.$route.params.programId,
          this.$route.params.pipelineId,
          this.$route.params.executionId,
          step.phaseId as string,
          step.stepId as string
        );
        console.log(result.data);
      },
      async getLog(step: PipelineExecutionStepState) {
        const client = await this.$CloudManagerApi;
        const result = await client.pipelineExecution.getStepLogs(
          this.$route.params.programId,
          this.$route.params.pipelineId,
          this.$route.params.executionId,
          step.phaseId as string,
          step.stepId as string
        );
        // @ts-ignore
        const downloadLink: string = result?.data?.redirect;
        if (downloadLink) {
          location.href = downloadLink;
        }
      },
      getVariant(status: PipelineExecutionStatusEnum): string {
        switch (status) {
          case PipelineExecutionStatusEnum.NOT_STARTED:
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
