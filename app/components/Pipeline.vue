<template>
  <div>
    <h3>Executions:</h3>
    <table is="coral-table" selectable="">
      <thead is="coral-table-head">
        <tr is="coral-table-row">
          <th is="coral-table-headercell">Status</th>
          <th is="coral-table-headercell">Id</th>
          <th is="coral-table-headercell">Started</th>
          <th is="coral-table-headercell">more</th>
          <th></th>
        </tr>
      </thead>
      <tbody is="coral-table-body">
        <tr
          is="coral-table-row"
          v-for="execution in executions"
          :key="execution.id"
        >
          <td is="coral-table-cell">
            <coral-status :variant="getVariant(execution.status)">{{
              execution.status
            }}</coral-status>
          </td>
          <td is="coral-table-cell">{{ execution.id }}</td>
          <td is="coral-table-cell">{{ execution.createdAt | date }}</td>
          <td is="coral-table-cell">
            <router-link
              class="no-decoration"
              :to="
                '/program/' +
                  $route.params.programId +
                  '/pipeline/' +
                  $route.params.pipelineId +
                  '/execution/' +
                  execution.id
              "
            >
              <button is="coral-button" variant="action">
                detail
              </button>
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
  import { mutations } from "./BreadcrumbStore";
  import {
    Pipeline,
    PipelineExecutionListRepresentation,
    PipelineExecutionListRepresentationEmbedded,
    PipelineExecution,
    PipelineExecutionStatusEnum
  } from "../client";
  import Vue from "vue";

  export default Vue.extend({
    name: "Program",

    data() {
      return {
        pipeline: {} as Pipeline,
        executions: [] as Array<PipelineExecution>
      };
    },
    async created() {
      var client = await this.$CloudManagerApi;
      try {
        this.$showLoadingScreen();
        const programId = this.$route.params.programId;
        const pipelineId = this.$route.params.pipelineId;
        if (programId && pipelineId) {
          const response = await client.pipelines.getPipeline(
            this.$route.params.programId,
            this.$route.params.pipelineId
          );
          this.pipeline = response.data;
          mutations.setPipeline(this.pipeline.name);

          const executionsResult = await client.pipelineExecution.getExecutions(
            this.$route.params.programId,
            this.$route.params.pipelineId
          );
          this.executions = executionsResult.data.embedded?.executions as Array<
            PipelineExecution
          >;
          this.executions[0].status;
        }
        this.$hideLoadingScreen();
      } catch (err) {
        console.error(err);
      }
    },

    methods: {
      getVariant(status: PipelineExecutionStatusEnum): string {
        switch (status) {
          case PipelineExecutionStatusEnum.NOTSTARTED:
          case PipelineExecutionStatusEnum.RUNNING:
            return "info";
            break;
          case PipelineExecutionStatusEnum.CANCELLING:
          case PipelineExecutionStatusEnum.CANCELLED:
            return "warning";
            break;
          case PipelineExecutionStatusEnum.FINISHED:
            return "success";
            break;
          case PipelineExecutionStatusEnum.ERROR:
          case PipelineExecutionStatusEnum.FAILED:
            return "error";
            break;
          default:
            return "info";
        }
      }
    }
  });
</script>

<style scoped>
  .status {
    display: inline;
    line-height: 32px;
    margin-left: 7px;
  }
</style>
