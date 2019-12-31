import Vue from "vue";

export const store = Vue.observable({
  program: {},
  pipeline: ""
});

export const mutations = {
  setProgram(program) {
    store.program = program;
    store.pipeline = null;
  },
  setPipeline(pipeline) {
    store.pipeline = pipeline;
  }
};
