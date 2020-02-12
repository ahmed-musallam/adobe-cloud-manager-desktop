<template>
  <div>
    <h3>Pipelines:</h3>
    <div>
      <router-link
        :to="'/program/' + program.id + '/pipeline/' + pipeline.id"
        v-for="pipeline in pipelines"
        :key="pipeline.id"
      >
        <coral-card variant="CONDENSED">
          <coral-card-asset style="display:none"></coral-card-asset>
          <coral-card-content>
            <!-- title does not render.. who know why.. -->
            <!-- <coral-card-title>{{pipeline.name}}</coral-card-title> -->
            <coral-card-subtitle>
              <h3>{{ pipeline.name }}</h3>
            </coral-card-subtitle>
            <coral-card-propertylist>
              <coral-card-property
                >Started:
                {{ pipeline.lastStartedAt | date }}</coral-card-property
              >
              <br />
              <coral-card-property
                >Finished:
                {{ pipeline.lastFinishedAt | date }}</coral-card-property
              >
            </coral-card-propertylist>
          </coral-card-content>
          <coral-card-info>
            <coral-tag v-if="pipeline.status == 'IDLE'" color="green">{{
              pipeline.status | lowercase
            }}</coral-tag>
            <coral-tag v-if="pipeline.status == 'BUSY'" color="cyan">{{
              pipeline.status | lowercase
            }}</coral-tag>
            <coral-tag v-if="pipeline.status == 'WAITING'" color="yellow">{{
              pipeline.status | lowercase
            }}</coral-tag>
          </coral-card-info>
        </coral-card>
      </router-link>
    </div>

    <!-- <textarea>{{pipelines}}</textarea> -->
  </div>
</template>

<script lang="ts">
  import { mutations } from "./BreadcrumbStore";
  import { async } from "q";
  import { Pipeline, Program } from "../client";

  export default {
    name: "Program",

    data() {
      return {
        program: {} as Program,
        pipelines: [] as Pipeline[]
      };
    },
    beforeRouteUpdate(to, from, next) {
      this.updateProgram(to.params.programId);
      next();
    },
    created() {
      this.updateProgram(this.$route.params.programId);
    },
    methods: {
      async updateProgram(programId: string) {
        var client = await this.$CloudManagerApi;
        console.log("redering program: ", programId);
        try {
          this.$showLoadingScreen();
          const programResponse = await client.programs.getProgram(programId);
          this.program = programResponse.data;

          mutations.setProgram(this.program);
          const pipelinesResponse = await client.pipelines.getPipelines(
            this.program?.id || ""
          );
          this.pipelines = pipelinesResponse.data?._embedded?.pipelines || [];
          this.$hideLoadingScreen();
        } catch (err) {
          console.error(err);
          this.$hideLoadingScreen();
        }
      }
    }
  };
</script>

<style scoped>
  coral-card {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }
  ._coral-Card-wrapper {
    border-bottom-color: transparent !important;
  }
  coral-card-subtitle {
    color: black !important;
  }
  coral-card-asset {
    display: none !important;
  }
</style>
