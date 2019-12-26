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
          >{{program.name}}</span>
        </coral-shell-workspaces>
      </coral-shell-header-content>
      <coral-shell-header-actions>
        <coral-shell-menubar>
          <coral-shell-menubar-item menu="#menu_config" icon="gears"></coral-shell-menubar-item>
        </coral-shell-menubar>
      </coral-shell-header-actions>
    </coral-shell-header>
    <coral-shell-menu id="menu_config" class="u-coral-padding-horizontal">
      <AuthForm></AuthForm>
    </coral-shell-menu>
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

<script lang="ts">
import AuthForm from "./components/AuthForm.vue";
import Breadcrumb from "./components/Breadcrumb.vue";
import Loading from "./components/Loading.vue";
import { APIClient } from "./client";
import { AxiosRequestConfig } from "axios";
import CMApiClient from "./util/CMApiClient";
import { store } from "./components/BreadcrumbStore";

export default {
  name: "App",
  components: {
    AuthForm,
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

<style scoped>
</style>