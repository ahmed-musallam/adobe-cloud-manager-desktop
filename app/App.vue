<template>
  <coral-shell>
    <coral-shell-header>
      <coral-shell-header-content>
        <coral-shell-workspaces ref="workspaces">
          <span
            v-for="program in programs"
            :key="program.id"
            :href="'/program/' + program.id"
            is="coral-shell-workspace"
            >{{ program.name }}</span
          >
        </coral-shell-workspaces>
      </coral-shell-header-content>
      <coral-shell-header-actions>
        <router-link to="/settings" role="link" tabindex="0">
          <button
            is="coral-button"
            icon="gears"
            variant="quietaction"
            style="margin-right: 0.5em;"
          ></button>
        </router-link>
      </coral-shell-header-actions>
    </coral-shell-header>
    <coral-shell-content>
      <!-- Main application goes here -->
      <Breadcrumb></Breadcrumb>
      <section class="u-coral-padding-horizontal">
        <router-view></router-view>
      </section>
      <Loading></Loading>
    </coral-shell-content>
  </coral-shell>
</template>

<script>
import Breadcrumb from "./components/Breadcrumb";
import Loading from "./components/Loading";
import { APIClient } from "./client";
import { AxiosRequestConfig } from "axios";
import CMApiClient from "./util/CMApiClient";
import { store } from "./components/BreadcrumbStore";

export default {
  name: "App",
  components: {
    Breadcrumb,
    Loading
  },
  data() {
    return {
      programs: [],
      state: {}
    };
  },
  mounted() {
    this.$refs.workspaces.on("coral-shell-workspaces:change", e => {
      const href = e.detail.selection.getAttribute("href");
      if (this.$route.path !== href) {
        // safeguard against page refresh
        this.$router.push({ path: href });
      }
    });
  },
  async beforeCreate() {
    var client = CMApiClient.getInstance();
    try {
      this.$showLoadingScreen();
      var result = await client.rest.api.programsService.getPrograms();
      this.programs = result._embedded.programs;
      this.$hideLoadingScreen();
    } catch (err) {
      console.error(err);
      this.$hideLoadingScreen();
    }
  },
  methods: {}
};
</script>

<style scoped></style>
