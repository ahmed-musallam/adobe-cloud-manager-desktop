<template>
  <div>
    <h2>Programs</h2>
    <table is="coral-table" class="table-sticky">
          <thead is="coral-table-head">
            <tr>
              <th is="coral-table-headercell">ID</th>
              <th is="coral-table-headercell">Name</th>
              <th is="coral-table-headercell">Enabled</th>
              <th is="coral-table-headercell">Status</th>
              <th is="coral-table-headercell"></th>
            </tr>
          </thead>
          <tbody is="coral-table-body">
            <tr v-for="program in programs" v-bind:key="program.id" is="coral-table-row">
              <td is="coral-table-cell">{{program.id}}</td>
              <td is="coral-table-cell">{{program.name}}</td>
              <td is="coral-table-cell">{{program.enabled}}</td>
              <td is="coral-table-cell">{{program.status}}</td>
              <td is="coral-table-cell">{{ 'see more' }}</td>
            </tr>
          </tbody>
        </table>
    <!-- <coral-wait size="M"></coral-wait> -->
    <textarea is="coral-textarea" style="resize: vertical;width: 100%" rows="20">{{programs}}</textarea>
  </div>
</template>

<script lang="ts">
import CMApiClient from '../util/CMApiClient'

export default {
  name: "Programs",

  data() {
    return {
      programs: {'loading': 'true'}
    }
  },
  async beforeCreate () {
    var client = CMApiClient.getInstance();
    try {
      var programs = await client.rest.api.programsService.getPrograms();
      const promises = programs._embedded.programs.map( (async program => {
        return client.rest.api.programService.getProgram(program.id);
      }))
      this.programs = await Promise.all(promises)
      this.$forceUpdate();
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