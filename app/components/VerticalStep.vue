<template>
  <li class="vertical-step" :class="getVariantClass(variant)">
    <Status vertical-step-status :variant="status || variant"></Status>
    <strong class="vertical-step__title">{{ title }}</strong>
    <div class="vertical-step__content">
      <slot></slot>
    </div>
    <div v-if="getVariantClass(variant).current" class="vertical-step__loading">
      <br />
      <coral-wait size="S"></coral-wait>
      <em>Running</em>
    </div>
  </li>
</template>

<script lang="ts">
  import Vue from "vue";
  import Status from "./Status.vue";
  import { PipelineExecutionStepStateStatusEnum } from "../client";

  export default Vue.extend({
    name: "VerticalStep",
    props: {
      title: String,
      variant: String,
      status: String,
      last: Boolean
    },
    components: {
      Status
    },
    methods: {
      getVariantClass(variant: string) {
        var classes = {} as Object;
        switch (variant) {
          case PipelineExecutionStepStateStatusEnum.RUNNING:
          case PipelineExecutionStepStateStatusEnum.ROLLINGBACK:
          case PipelineExecutionStepStateStatusEnum.ROLLEDBACK:
          case PipelineExecutionStepStateStatusEnum.WAITING:
          case "running":
            classes = { current: true };
            break;
          case "finished":
          case PipelineExecutionStepStateStatusEnum.FINISHED:
          case PipelineExecutionStepStateStatusEnum.ERROR:
          case PipelineExecutionStepStateStatusEnum.CANCELLED:
          case PipelineExecutionStepStateStatusEnum.FAILED:
            classes = { "is-done": true };
            break;
        }
        if (this.last) {
          classes = Object.assign(classes, {
            last: true
          });
        }
        return classes;
      }
    }
  });
</script>

<style scoped lang="scss">
  .vertical-step__loading {
    margin-top: 1em;
    coral-wait {
      vertical-align: -15%;
    }
  }
</style>
