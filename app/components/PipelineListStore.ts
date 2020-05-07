import Vue from "vue";
import { Pipeline } from "../client";

export const pipelineListStore = Vue.observable({
  pipelines: [] as Pipeline[]
});

export const pipelineListStoreActions = {
  setPipelines(pipelines: Pipeline[]) {
    pipelineListStore.pipelines = pipelines;
  }
};
