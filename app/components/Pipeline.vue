<template>
  <div>
    <h3>Executions:</h3>
    <table is="coral-table">
      <thead is="coral-table-head">
      <tr is="coral-table-row">
        <th is="coral-table-headercell">Status</th>
        <th is="coral-table-headercell">Execution</th>
        <th is="coral-table-headercell">Started</th>
      </tr>
      </thead>
      <tbody is="coral-table-body">
        <tr is="coral-table-row" v-for="execution in executions" :key="execution.id">
          <td is="coral-table-cell">
            <coral-status :variant="getVariant(execution.status)">{{execution.status}}</coral-status>
          </td>
          <td is="coral-table-cell">{{execution.id}}</td>
          <td is="coral-table-cell">{{execution.createdAt | date}}</td>
        </tr>
      </tbody>
    </table>
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
      executions: []
    }
  },
  async beforeCreate () {
    var client = CMApiClient.getInstance();
    try {
      
      this.pipeline = await client.rest.api.programService.getPipeline(this.$route.params.programId, this.$route.params.pipelineId);
      mutations.setPipeline(this.pipeline.name)
      const executions = await client.rest.api.program.executionsService.getExecutions(this.$route.params.programId, this.$route.params.pipelineId);
      this.executions = executions._embedded.executions;
    } catch (err) {
      console.error(err);
    }
  },

  methods: {
    getVariant (status) {
      switch(status) {
        case "NOT_STARTED":
        case "RUNNING":
          return "info"
          break;
        case "CANCELLING":
        case "CANCELLED":
          return "warning"
          break;
        case "FINISHED":
          return "success"
          break;
        case "ERROR":
        case "failed":
          return "error";
          break;
        default:
          return "info"
      }
    }
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