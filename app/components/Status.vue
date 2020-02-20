<template>
  <div :class="{ blinking: isRunning(variant) }">
    <coral-status :variant="getVariant(variant)">
      <em v-if="showText">{{ variant ? variant.toLowerCase() : "" }}</em>
    </coral-status>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import {
    PipelineExecutionStatusEnum,
    PipelineStatusEnum,
    PipelineExecutionStepStateStatusEnum
  } from "../client";

  export default Vue.extend({
    name: "Status",
    props: {
      variant: String,
      showText: Boolean
    },
    methods: {
      isRunning(variant: string) {
        return [
          PipelineExecutionStatusEnum.RUNNING,
          PipelineStatusEnum.BUSY,
          PipelineExecutionStepStateStatusEnum.RUNNING,
          "running"
        ].some(item => item === variant);
        return this.getVariant(variant) === "info";
      },
      getVariant(variant: string): string | undefined {
        switch (variant) {
          case PipelineExecutionStatusEnum.NOTSTARTED:
          case PipelineExecutionStepStateStatusEnum.NOTSTARTED:
            return undefined;
            break;
          case PipelineExecutionStatusEnum.RUNNING:
          case PipelineStatusEnum.BUSY:
          case PipelineExecutionStepStateStatusEnum.RUNNING:
          case "running":
            return "info";
            break;
          case PipelineExecutionStatusEnum.CANCELLING:
          case PipelineExecutionStatusEnum.CANCELLED:
          case PipelineExecutionStepStateStatusEnum.ROLLINGBACK:
          case PipelineExecutionStepStateStatusEnum.ROLLEDBACK:
          case PipelineExecutionStepStateStatusEnum.WAITING:
          case PipelineStatusEnum.WAITING:
            return "warning";
            break;
          case PipelineExecutionStatusEnum.FINISHED:
          case PipelineStatusEnum.IDLE:
            return "success";
            break;
          case PipelineExecutionStatusEnum.ERROR:
          case PipelineExecutionStatusEnum.FAILED:
          case PipelineExecutionStepStateStatusEnum.ERROR:
          case PipelineExecutionStepStateStatusEnum.CANCELLED:
          case PipelineExecutionStepStateStatusEnum.FAILED:
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
  .blinking {
    animation: blinker 1s linear infinite;
  }

  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }
</style>
