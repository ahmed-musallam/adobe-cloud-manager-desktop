import Vue from "vue";
import { Program, Pipeline } from "../client";

export const store = Vue.observable({
  program: {} as Program,
  pipeline: "" as string | undefined
});

export const mutations = {
  setProgram(program: Program) {
    store.program = program;
    store.pipeline = undefined;
  },
  setPipeline(pipeline: string) {
    store.pipeline = pipeline;
  }
};
