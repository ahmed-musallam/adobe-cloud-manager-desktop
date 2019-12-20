<template>
  <div>
    <h1>{{pipeline.name}} <em>{{pipeline.id}}</em></h1>
    <textarea>{{pipeline}}</textarea>
  </div>
</template>

<script>
import CMApiClient from '../util/CMApiClient'
  import { mutations } from "./BreadcrumbStore"


export default {
  name: "Program",

  data() {
    return {
      pipeline: {},
    }
  },
  async beforeCreate () {
    var client = CMApiClient.getInstance();
    try {
      this.pipeline = await client.rest.api.programService.getPipeline(this.$route.params.programId, this.$route.params.pipelineId);
      mutations.setPipeline(this.pipeline.name)
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