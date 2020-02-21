<template>
  <div>
    <h3>Pipelines:</h3>
    <div class="bordered-box">
      <coral-wait size="S" v-if="loading"></coral-wait>
      <table is="coral-table" selectable="" v-else-if="!loading && pipelines.length">
        <colgroup>
          <col is="coral-table-column" />
          <col is="coral-table-column" sortable="" sortabledirection="ascending" />
          <col is="coral-table-column" sortable="" />
        </colgroup>
        <thead is="coral-table-head">
          <tr is="coral-table-row">
            <th is="coral-table-headercell">Status</th>
            <th is="coral-table-headercell">Name</th>
            <th is="coral-table-headercell">Last Finished</th>
          </tr>
        </thead>
        <tbody is="coral-table-body">
          <tr
            is="coral-table-row"
            v-for="pipeline in pipelines"
            :key="pipeline.id"
            @click="goToPipeline(pipeline.id)"
          >
            <td is="coral-table-cell">
              <coral-status v-if="pipeline.status == 'IDLE'" variant="success">
                {{ pipeline.status }}
              </coral-status>
              <coral-status v-else-if="pipeline.status == 'BUSY'" variant="info">
                {{ pipeline.status }}
              </coral-status>
              <coral-status v-else-if="pipeline.status == 'WAITING'" variant="warning">
                {{ pipeline.status }}
              </coral-status>
            </td>
            <td is="coral-table-cell">
              {{ pipeline.name }}
            </td>
            <td is="coral-table-cell">
              {{ pipeline.lastFinishedAt | date }}
            </td>
          </tr>
        </tbody>
      </table>
      <h4 v-else>
        <coral-alert>
          <coral-alert-header>
            No pipelines configured for this program.
          </coral-alert-header>
        </coral-alert>
      </h4>
    </div>
    <DebugDrawer :data="pipelines" title="pipelines"></DebugDrawer>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import { Pipeline } from "../client";
  import CloudManagerApi from "../client/wrapper/CloudManagerApi";
  import DebugDrawer from "./DebugDrawer.vue";
  export default Vue.extend({
    name: "PipelinesTable",
    data() {
      return {
        pipelines: [] as Pipeline[],
        loading: false
      };
    },
    components: {
      DebugDrawer
    },
    async created() {
      this.updatePipelines(this.$route.params.programId);
    },
    methods: {
      goToPipeline(pipelineId: string) {
        this.$router.push({
          name: "pipeline",
          params: {
            programId: this.$route.params.programId,
            pipelineId: pipelineId
          }
        });
      },
      async updatePipelines(programId: string) {
        this.loading = true;
        var client = await CloudManagerApi.getInstance();
        const programResponse = await client.programs.getProgram(programId);

        const pipelinesResponse = await client.pipelines.getPipelines(programId || "");
        this.pipelines = pipelinesResponse.data?._embedded?.pipelines || [];
        this.loading = false;
      },
      async startPipeline(pipeline: Pipeline) {
        this.$showLoadingScreen();
        try {
          var client = await CloudManagerApi.getInstance();
          var response = await client.pipelineExecution.startPipeline(
            String(pipeline.programId),
            String(pipeline.id),
            "application/json"
          );
          console.log("start pipeline response: ", response);
          //await this.loadProgram(String(this.program.id));
        } catch (err) {
          console.error(err);
        }
        this.$hideLoadingScreen();
      }
    }
  });
</script>

<style scoped></style>
