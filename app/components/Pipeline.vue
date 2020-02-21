<template>
  <div>
    <h3>Executions:</h3>
    <table is="coral-table" selectable="">
      <thead is="coral-table-head">
        <tr is="coral-table-row">
          <th is="coral-table-headercell">Status</th>
          <th is="coral-table-headercell">Id</th>
          <th is="coral-table-headercell">Started</th>
          <th></th>
        </tr>
      </thead>
      <tbody is="coral-table-body">
        <tr
          is="coral-table-row"
          v-for="execution in executions"
          :key="execution.id"
          @click="goToExecution(execution.id)"
        >
          <td is="coral-table-cell">
            <coral-status :variant="getVariant(execution.status)">{{
              execution.status
            }}</coral-status>
          </td>
          <td is="coral-table-cell">{{ execution.id }}</td>
          <td is="coral-table-cell">{{ execution.createdAt | date }}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="loadingRemainingExecutions" style="padding:5px">
      <coral-wait size="S"></coral-wait><em> Loading remaining executions</em>
    </div>
    <coral-drawer style="white-space: pre;">
      <textarea style="width:100%;height:500px">
        {{ JSON.stringify(executions, null, 4) }}
      </textarea>
    </coral-drawer>
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
  import CloudManagerApi from "../client/wrapper/CloudManagerApi";

  export default Vue.extend({
    name: "Program",

    data() {
      return {
        pipeline: {} as Pipeline,
        executions: [] as Array<PipelineExecution>,
        loadingRemainingExecutions: false
      };
    },
    async created() {
      var client = await CloudManagerApi.getInstance();
      try {
        this.$showLoadingScreen();
        const programId = this.$route.params.programId;
        const pipelineId = this.$route.params.pipelineId;
        if (programId && pipelineId) {
          await this.getAndSetExecutions(0, 3); // load first 3 executions
        }
        this.$hideLoadingScreen();
        this.getRemainingExecutions(); // load ALL executions. TODO: pagination
      } catch (err) {
        console.error(err);
      }
    },

    methods: {
      goToExecution(executionId: string) {
        const path = `/program/${this.$route.params.programId}/pipeline/${this.$route.params.pipelineId}/execution/${executionId}`;
        this.$router.push({ path });
      },
      async getAndSetExecutions(start?: number, limit?: number) {
        var client = await CloudManagerApi.getInstance();
        const executionsResult = await client.pipelineExecution.getExecutions(
          this.$route.params.programId,
          this.$route.params.pipelineId,
          String(start),
          limit
        );
        this.executions = executionsResult.data._embedded?.executions as Array<
          PipelineExecution
        >;
      },
      async getRemainingExecutions() {
        this.loadingRemainingExecutions = true;
        await this.getAndSetExecutions();
        this.loadingRemainingExecutions = false;
      },
      getVariant(status: PipelineExecutionStatusEnum): string {
        switch (status) {
          case PipelineExecutionStatusEnum.NOT_STARTED:
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
