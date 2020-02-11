<template>
  <div>
    <div class="wrapper">
      <ul class="vertical-steps">
        <slot></slot>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import VerticalStep from "./VerticalStep.vue";

  export default Vue.extend({
    name: "VerticalStepList",
    components: {
      VerticalStep
    },
    data() {
      return {};
    },
    methods: {}
  });
</script>

<style lang="scss">
  $lighter-grey: rgb(245, 245, 245);
  $light-grey: rgb(142, 142, 142);
  $dark-grey: rgb(75, 75, 75);
  $vertical-line-left: 15px;
  $vertical-step-content-left: 45px;
  $vertical-step-line-left: $vertical-line-left - $vertical-step-content-left;
  $status-light-width: 7px;
  $status-light-border: 3px;
  $status-light-left: $vertical-line-left - $vertical-step-content-left -
    ($status-light-width/ 2) - ($status-light-border);

  .wrapper {
    width: 100%;
    //border: 1px solid $light-grey;
  }

  // step status indicator
  [vertical-step-status] {
    // for some reason, adding custom classes to coral elements breaks them...
    display: inline-block;
    position: absolute;
    width: 10px;
    top: 0;
    left: $status-light-left;
    padding: 0;
    margin: 0;
    &::before {
      padding: 0;
      margin: 0;
      border: $status-light-border solid $lighter-grey;
    }
  }

  .vertical-steps {
    position: relative;
    padding-left: $vertical-step-content-left;
    list-style: none;
    // Default vertical line
    &::before {
      display: inline-block;
      content: "";
      position: absolute;
      top: 0;
      left: $vertical-line-left;
      width: $status-light-width;
      height: 100%;
    }
    .vertical-step {
      position: relative;
      padding-bottom: 20px;
      // default step left vertical line
      &::before {
        display: inline-block;
        content: "";
        position: absolute;
        left: $vertical-step-line-left;
        height: 100%;
        border-left: 2px dashed $light-grey;
      }

      &.is-done {
        &::before {
          border-left: 2px solid rgb(142, 142, 142);
        }
      }

      &.current {
        &::before {
          border-left: 2px solid $dark-grey;
        }
      }
      &:last-child::before {
        border-left: 0;
      }
    }
    strong {
      display: block;
    }
  }
</style>
