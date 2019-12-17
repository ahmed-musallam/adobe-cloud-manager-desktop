<template>
  <div>
    <!-- <coral-wait size="M"></coral-wait> -->
    <textarea is="coral-textarea" style="resize: vertical;width: 100%" rows="20">{{programs}}</textarea>

  </div>
</template>

<script lang="ts">
import CMApiClient from '../util/CMApiClient'

export default {
  name: "Program",

  data() {
    return {
      programs: {'loading': 'true'}
    }
  },
  async beforeCreate () {
    var client = CMApiClient.getInstance();
    var programs = await client.rest.api.programsService.getPrograms();
    const promises = programs._embedded.programs.map( (async program => {
      return client.rest.api.programService.getProgram(program.id);
    }))
    const results = await Promise.all(promises)
    results.forEach((p,i) => programs._embedded.programs[i] = p);
    this.programs = programs;
    this.$forceUpdate();

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