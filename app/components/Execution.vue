<template>
  <div v-if="execution && execution.id">
    <h3 style="margin-bottom:0">
      {{ pipelineName }}
      <Status :variant="execution.status" :showText="true"></Status>
    </h3>
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
        :title="getPrettyStepTitle(step.action)"
      >
        <span v-if="step.startedAt && !step.finishedAt">
          Started: <em>{{ step.startedAt | date }}</em>
        </span>
        <span
          v-if="step.startedAt && step.finishedAt"
          style="color: rgb(45, 157, 120)"
        >
          Finished:
          <em>
            <b>{{ step.finishedAt | date }}. </b>
          </em>
          <em style="color: rgb(45, 157, 120)">
            (Took: {{ getDurationInMili(step) | humanReadableDuration }})
          </em>
        </span>
        <br v-if="hasLog(step) && step.status !== 'RUNNING'" />
        <br v-if="hasLog(step) && step.status !== 'RUNNING'" />
        <button
          is="coral-button"
          v-if="hasLog(step) && step.status !== 'RUNNING'"
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
  import CloudManagerApi from "../client/wrapper/CloudManagerApi";
  import { Dictionary } from "vue-router/types/router";
  import globalAxios, { CancelTokenSource } from "axios";

  const stepActionTitles: Dictionary<string> = {
    validate: "Validation",
    build: "Build & Unit Testing",
    codeQuality: "Code Scanning",
    buildImage: "Build Images"
  };

  export default Vue.extend({
    name: "Execution",

    data() {
      return {
        execution: {} as PipelineExecution,
        pipelineName: store.pipeline,
        stopPollingExecutions: false
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
      if (this.execution.status !== PipelineExecutionStatusEnum.FINISHED) {
        this.$poll(this.getExecution, (data: PipelineExecution) => {
          this.execution = data;
          const stopPolling = [
            PipelineExecutionStatusEnum.FINISHED,
            PipelineExecutionStatusEnum.CANCELLED,
            PipelineExecutionStatusEnum.ERROR,
            PipelineExecutionStatusEnum.FAILED
          ].some(status => status === this.execution.status);
          return stopPolling || this.stopPollingExecutions;
        });
      }
    },
    destroyed() {
      this.stopPollingExecutions = true;
    },
    methods: {
      async getExecution(): Promise<PipelineExecution> {
        var client = await CloudManagerApi.getInstance();
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
        } else {
          return {};
        }
      },
      hasLog(step: PipelineExecutionStepState) {
        return step?._links?.http__ns_adobe_com_adobecloud_rel_pipeline_logs
          ?.href;
      },
      hasMetrics(step: PipelineExecutionStepState) {
        return step?._links?.http__ns_adobe_com_adobecloud_rel_pipeline_metrics
          ?.href;
      },
      getPrettyStepTitle(action: string) {
        return stepActionTitles[action] || action;
      },
      async getMetrics(step: PipelineExecutionStepState) {
        const client = await CloudManagerApi.getInstance();
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
        const client = await CloudManagerApi.getInstance();
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
          this.$downloadFile(downloadLink);
        }
      },
      getDurationInMili(step: PipelineExecutionStepState) {
        let finishedInMili = 0;
        let startedInMili = 0;
        if (!step.finishedAt) {
          return 0;
        } else {
          finishedInMili = new Date(step.finishedAt).getTime();
        }
        if (!step.startedAt) {
          return 0;
        } else {
          startedInMili = new Date(step.startedAt).getTime();
        }
        return finishedInMili - startedInMili;
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
