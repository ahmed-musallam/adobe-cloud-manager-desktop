<template>
  <div>
    <h3>Pipelines:</h3>
    <div :class="{ 'bordered-box': loading }">
      <div v-if="loading">
        <coral-wait size="S" v-if="loading"></coral-wait>
      </div>
      <table is="coral-table" selectable="" v-else-if="!loading && pipelines.length">
        <thead is="coral-table-head">
          <tr is="coral-table-row">
            <th is="coral-table-headercell">Pipeline</th>
            <th is="coral-table-headercell">Status</th>
            <th is="coral-table-headercell"></th>
          </tr>
        </thead>
        <tbody is="coral-table-body" divider="row">
          <tr is="coral-table-row" v-for="pipeline in pipelines" :key="pipeline.id">
            <td is="coral-table-cell" @click="goToPipeline(pipeline.id)">
              <span class="d-block"
                ><b>{{ pipeline.name }}</b></span
              >
              <small class="d-block" v-if="isBusy(pipeline)">
                Started: {{ pipeline.lastStartedAt | date }}
              </small>
              <small class="d-block" v-else> Finished: {{ pipeline.lastFinishedAt | date }} </small>
            </td>
            <td is="coral-table-cell" @click="goToPipeline(pipeline.id)">
              <small class="d-block pipeline-status">
                <coral-status
                  v-if="pipeline.status"
                  :variant="getVariantFromStatus(pipeline.status)"
                >
                  {{ pipeline.status }}
                </coral-status>
              </small>
            </td>
            <td is="coral-table-cell" pipeline-actions-cell @click.self="goToPipeline(pipeline.id)">
              <coral-quickactions
                pipeline-quick-actions
                target="_parent"
                open="true"
                threshold="0"
                interaction="off"
              >
                <coral-quickactions-item
                  v-if="pipeline.status === 'IDLE'"
                  icon="play"
                  @click.stop="startPipeline(pipeline)"
                >
                  Start Pipeline
                </coral-quickactions-item>
                <coral-quickactions-item
                  v-if="isBusy(pipeline)"
                  icon="visibility"
                  @click.stop="goToCurrentExecution(pipeline)"
                >
                  View Current Execution
                </coral-quickactions-item>
                <coral-quickactions-item icon="viewList" @click.stop="goToPipeline(pipeline.id)">
                  View All Executions
                </coral-quickactions-item>
                <coral-quickactions-item
                  icon="bell"
                  :data-notification="pipeline.id"
                  @click.stop="toggleNotifications(pipeline, $event)"
                >
                  {{ isBeingWatched(pipeline.id) ? "Disable" : "Enable" }} Notifications
                </coral-quickactions-item>
              </coral-quickactions>
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
  import { Pipeline, PipelineStatusEnum } from "../client";
  import CloudManagerApi from "../client/wrapper/CloudManagerApi";
  import DebugDrawer from "./DebugDrawer.vue";
  import NotificationUtil from "../util/NotificationUtil";
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
    updated: function() {
      this.$nextTick(() => {
        this.$el.querySelectorAll("[data-notification]").forEach(el => {
          const pipelineId = el.getAttribute("data-notification") || "";
          const isWatching = NotificationUtil.isWatchingPipeline(pipelineId);
          if (isWatching) {
            const pipeline = this.pipelines.find(pipeline => pipeline.id === pipelineId);
            NotificationUtil.startPipelineNotifications(pipeline as Pipeline, true);
          }
          this.enableIcon(el, !isWatching);
        });
      });
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
      isBeingWatched(pipelineId: string) {
        return NotificationUtil.isWatchingPipeline(pipelineId);
      },
      async toggleNotifications(pipeline: Pipeline, event: any, silent?: boolean) {
        const pipelineId = String(pipeline.id);
        const isWatching = this.isBeingWatched(pipelineId);
        if (isWatching) {
          NotificationUtil.stopPipelineNotifications(pipeline, silent);
        } else {
          await NotificationUtil.startPipelineNotifications(pipeline, silent);
          const actionIcon = event.target.getAttribute("icon");
        }
        if (!silent) {
          this.enableIcon(event.target, isWatching);
        }
      },
      enableIcon(actionItem: any, enable: boolean) {
        // what's about to ensue is terrible work around to a stupid problem,
        // you see the click handler is attached to `coral-quickactions-item` which is a SIBLING
        // of the actual generated button markup.. why.. who knows.. so now we have to do this because
        // I do not want to change the UI at this point.
        actionItem._elements.button.setAttribute("toggle", enable);
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
          console.log(`pipeline.programId: ${pipeline.programId}, pipeline.id: ${pipeline.id}`);
          var response = await client.pipelineExecution.startPipeline(
            String(pipeline.programId),
            String(pipeline.id),
            "application/json"
          );
          const startedExecution = await response.data;
          this.$router.push({
            name: "execution",
            params: {
              programId: String(pipeline.programId),
              pipelineId: String(pipeline.id),
              executionId: String(startedExecution?.id) // yes, it exists
            }
          });
          console.log({
            programId: String(pipeline.programId),
            pipelineId: String(pipeline.id),
            executionId: String(startedExecution?.id) // yes, it exists
          });
          console.log("start pipeline response: ", response);
          //await this.loadProgram(String(this.program.id));
        } catch (err) {
          console.error(err);
          let msg = "Error while starting pipeline, see logs";
          if (err && err.response.status === 403) {
            msg = "Your service does not have sufficient privilege. ";
          }
          this.$toast(msg, "error");
        } finally {
          this.$hideLoadingScreen();
        }
      },
      async goToCurrentExecution(pipeline: Pipeline) {
        this.$showLoadingScreen();
        try {
          var client = await CloudManagerApi.getInstance();
          var response = await client.pipelineExecution.getCurrentExecution(
            String(pipeline.programId),
            String(pipeline.id)
          );
          const currentExecution = await response.data;
          this.$router.push({
            name: "execution",
            params: {
              programId: String(pipeline.programId),
              pipelineId: String(pipeline.id),
              executionId: String(currentExecution.id)
            }
          });
        } catch (err) {
          console.error(err);
          this.$toast(err, "error");
        } finally {
          this.$hideLoadingScreen();
        }
      },
      isBusy(pipeline: Pipeline) {
        return pipeline.status === PipelineStatusEnum.BUSY;
      },
      log: console.log,
      getVariantFromStatus(pipelineStatus: PipelineStatusEnum) {
        switch (pipelineStatus) {
          case PipelineStatusEnum.IDLE:
            return "success";
          case PipelineStatusEnum.BUSY:
            return "info";
          case PipelineStatusEnum.WAITING:
            return "warning";
          default:
            return;
        }
      }
    }
  });
</script>

<style>
  .pipeline-status coral-status {
    margin: 0;
    padding: 2px;
    min-height: 0;
  }
  .pipeline-status coral-status-label {
    font-size: 80%;
  }
  .pipeline-status coral-status::before {
    margin: 3px 6px;
    margin-left: 0;
  }
  [pipeline-actions-cell] {
    width: 100px;
    position: relative;
  }
  [pipeline-quick-actions] {
    position: static !important;
    margin: 0.5em !important;
  }
</style>
