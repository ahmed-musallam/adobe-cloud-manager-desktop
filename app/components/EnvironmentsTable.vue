<template>
  <div>
    <h3>Environments:</h3>
    <div :class="{ 'bordered-box': loading }">
      <coral-wait size="S" v-if="loading"></coral-wait>
      <table is="coral-table" selectable="" v-else-if="!loading && environments.length">
        <colgroup>
          <col is="coral-table-column" sortable="" sortabledirection="ascending" />
          <col is="coral-table-column" sortable="" />
        </colgroup>
        <thead is="coral-table-head">
          <tr is="coral-table-row">
            <th is="coral-table-headercell">Name</th>
            <th is="coral-table-headercell">Type</th>
          </tr>
        </thead>
        <tbody is="coral-table-body">
          <tr
            is="coral-table-row"
            v-for="environment in environments"
            :key="environment.id"
            @click="goToEnvironment(environment.id)"
          >
            <td is="coral-table-cell">
              {{ environment.name }}
            </td>
            <td is="coral-table-cell">
              {{ environment.type }}
            </td>
          </tr>
        </tbody>
      </table>
      <h4 v-else>
        <coral-alert>
          <coral-alert-header>
            No environments configured for this program.
          </coral-alert-header>
        </coral-alert>
      </h4>
    </div>
    <DebugDrawer :data="environments" title="environments"></DebugDrawer>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import { Environment } from "../client";
  import CloudManagerApi from "../client/wrapper/CloudManagerApi";
  import DebugDrawer from "./DebugDrawer.vue";

  export default Vue.extend({
    name: "EnvironmentsTable",
    data() {
      return {
        environments: [] as Environment[],
        loading: false
      };
    },
    components: {
      DebugDrawer
    },
    async created() {
      this.updateEnvironments(this.$route.params.programId);
    },
    methods: {
      goToEnvironment(environmentId: string) {
        this.$router.push({
          name: "environment",
          params: {
            programId: this.$route.params.programId,
            environmentId: environmentId
          }
        });
      },
      async updateEnvironments(programId: string) {
        this.loading = true;
        var client = await CloudManagerApi.getInstance();
        const envList = await client.environments.getEnvironments(programId);
        this.environments = envList.data._embedded?.environments as Environment[];
        this.loading = false;
      }
    }
  });
</script>

<style scoped></style>
