<template>
  <div>
    <h1>{{program.name}} <em>{{program.id}}</em></h1>
    <textarea>{{pipelines}}</textarea>
    <router-link v-for="pipeline in pipelines" :key="pipeline.id" :to="'/program/' + program.id + '/pipeline/' + pipeline.id">{{pipeline.name}}</router-link>
  </div>
</template>

<script>
import CMApiClient from '../util/CMApiClient'

export default {
  name: "Program",

  data() {
    return {
      program: {},
      pipelines: {}
    }
  },
  async beforeCreate () {
    var client = CMApiClient.getInstance();
    try {
      this.program = await client.rest.api.programService.getProgram(this.$route.params.programId);
      const pipelines = await client.rest.api.program.pipelinesService.getPipelines(this.program.id)
      this.pipelines = pipelines._embedded.pipelines;
    } catch (err) {
      console.error(err);
    }
    

  },

  methods: {
   
  }
};
</script>

<style scoped>
 .hidden {
   display: none;
 }
 .status {
    display: inline;
    line-height: 32px;
    margin-left: 7px;
 }
</style>