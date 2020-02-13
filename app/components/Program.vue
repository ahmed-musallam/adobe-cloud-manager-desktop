<template>
  <div>
    <div v-if="environments.length">
      <h3>Environments:</h3>
      <coral-buttonlist>
        <router-link
          :to="'/program/' + program.id + '/environment/' + environment.id"
          v-for="environment in environments"
          :key="environment.id"
        >
          <button is="coral-buttonlist-item" icon="globe">
            {{ environment.name }}
          </button>
        </router-link>
      </coral-buttonlist>
    </div>
    <div></div>
    <h3>Pipelines:</h3>
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
              >Started: {{ pipeline.lastStartedAt | date }}</coral-card-property
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
    <div>
      <coral-drawer style="white-space: pre;">
        <textarea style="width:100%;height:500px">
        {{ JSON.stringify(environments, null, 4) }}
      </textarea
        >
      </coral-drawer>
    </div>

    <!-- <textarea>{{pipelines}}</textarea> -->
  </div>
</template>

<script lang="ts">
  import { mutations } from "./BreadcrumbStore";
  import { async } from "q";
  import { Pipeline, Program, Environment } from "../client";

  export default {
    name: "Program",

    data() {
      return {
        program: {} as Program,
        pipelines: [] as Pipeline[],
        environments: [] as Environment[]
      };
    },
    // beforeRouteUpdate(to, from, next) {
    //   this.updateProgram(to.params.programId);
    //   next();
    // },
    async created() {
      this.loadProgram(this.$route.params.programId);
    },
    beforeRouteUpdate(to, from, next) {
      this.loadProgram(to.params.programId);
      next();
    },
    methods: {
      async loadProgram(programId: string) {
        try {
          this.$showLoadingScreen();
          await this.updateProgram(programId);
          await this.updateEnvironments(programId);
          this.$hideLoadingScreen();
        } catch (err) {
          console.error(err);
          this.$hideLoadingScreen();
        }
      },
      async updateEnvironments(programId: string) {
        var client = await this.$CloudManagerApi;
        const envList = await client.environments.getEnvironments(programId);
        this.environments = envList.data._embedded
          ?.environments as Environment[];
      },
      async updateProgram(programId: string) {
        var client = await this.$CloudManagerApi;
        const programResponse = await client.programs.getProgram(programId);
        this.program = programResponse.data;

        mutations.setProgram(this.program);
        const pipelinesResponse = await client.pipelines.getPipelines(
          this.program?.id || ""
        );
        this.pipelines = pipelinesResponse.data?._embedded?.pipelines || [];
        this.$hideLoadingScreen();
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
