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
            @click="log"
            >{{ program.name }}</span
          >
        </coral-shell-workspaces>
      </coral-shell-header-content>
      <coral-shell-header-actions>
        <button
          is="coral-button"
          icon="home"
          title="Program Home"
          variant="quietaction"
          style="margin-left: 0;"
          @click="goHome"
        ></button>
        <button
          is="coral-button"
          icon="ChevronLeft"
          title="Back"
          variant="quietaction"
          style="margin-left: 0;"
          @click="goBack"
        ></button>
        <button
          is="coral-button"
          icon="ChevronRight"
          title="Forward"
          variant="quietaction"
          style="margin-left: 0;"
          @click="goForward"
        ></button>
        <router-link to="/settings" role="link" tabindex="0">
          <button
            is="coral-button"
            icon="gears"
            variant="quietaction"
            style="margin-right: 0.5em;"
          ></button>
        </router-link>
        <coral-shell-menubar>
          <coral-shell-menubar-item
            menu="#menu_user"
            iconsize="M"
            iconvariant="circle"
            icon="userCircleColor"
          ></coral-shell-menubar-item>
        </coral-shell-menubar>
      </coral-shell-header-actions>
    </coral-shell-header>
    <!-- USER -->
    <coral-shell-menu id="menu_user">
      <coral-shell-user>
        <coral-shell-user-name>Shantanu Narayen</coral-shell-user-name>
        <coral-shell-user-heading
          >this is a test one two three</coral-shell-user-heading
        >
        <coral-shell-user-content>
          <div>
            <a
              is="coral-anchorbutton"
              variant="quiet"
              icon="userEdit"
              @click="editAccount"
              >Manage Account</a
            >
            <br />
            <a
              is="coral-anchorbutton"
              variant="quiet"
              icon="userAdd"
              @click="addAccount"
              >Add Another Account</a
            >
            <div v-for="(acc, i) in accounts" :key="i">
              account {{ i }}: {{ acc.getName() }}
            </div>
          </div>
        </coral-shell-user-content>
      </coral-shell-user>
    </coral-shell-menu>
    <coral-shell-content>
      <!-- Main application goes here -->
      <section class="u-coral-padding-horizontal">
        <router-view></router-view>
      </section>
      <AuthFormDialog
        :show="authDialogShow"
        :mode="authDialogMode"
        :account="account"
        @close="authDialogShow = false"
      ></AuthFormDialog>
      <Loading></Loading>
    </coral-shell-content>
  </coral-shell>
</template>

<script lang="ts">
  import Loading from "./components/Loading.vue";
  import AuthFormDialog, {
    AuthFormDialogMode
  } from "./components/AuthFormDialog.vue";
  import { AxiosRequestConfig } from "axios";
  import { store } from "./components/BreadcrumbStore";
  import Vue from "vue";
  import { CoralElement } from "vue/types/vue";
  import {
    ProgramList,
    ProgramListEmbedded,
    EmbeddedProgram,
    Program
  } from "./client";
  import CloudManagerApi, {
    CloudManagerApiInstance
  } from "./client/wrapper/CloudManagerApi";
  import AuthStore, { Account } from "./util/AuthStore";

  export default Vue.extend({
    name: "App",
    components: {
      Loading,
      AuthFormDialog
    },
    data() {
      return {
        programs: {} as EmbeddedProgram[] | undefined,
        state: {},
        history: history,
        currentProgramHref: "",
        authDialogShow: false,
        authDialogMode: AuthFormDialogMode.EDIT,
        account: ""
        accounts: [] as Account[]
      };
    },
    mounted() {
      const workspaces = this.$refs.workspaces as CoralElement;
      workspaces.on("coral-shell-workspaces:change", e => {
        const href = e.detail.selection.getAttribute("href") || "";
        // safeguard against same route navigation
        if (this.$route.path !== href) {
          this.currentProgramHref = href;
          this.$router.push({ path: href });
        }
      });
    },
    async created() {
      this.accounts = await AuthStore.getAccounts();
      const client = await this.$CloudManagerApi;
      try {
        this.$showLoadingScreen();
        const result = await client.programs.getPrograms();
        this.programs = result.data._embedded?.programs;
        this.$hideLoadingScreen();
      } catch (err) {
        console.error(err);
        this.$hideLoadingScreen();
      }
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      },
      goForward() {
        this.$router.go(1);
      },
      goHome() {
        if (this.$route.params.programId) {
          this.$router.push({
            name: "program",
            params: { programId: this.$route.params.programId }
          });
        } else {
          console.log("nav to: ", this.currentProgramHref);
          this.$router.push({
            path: this.currentProgramHref
          });
        }
      },
      editAccount() {
        this.account = "prft account"; // TODO: make dynamic
        this.authDialogMode = AuthFormDialogMode.EDIT;
        this.authDialogShow = true;
      },
      addAccount() {
        this.account = "";
        this.authDialogMode = AuthFormDialogMode.ADD;
        this.authDialogShow = true;
      },
      log: console.log
    }
  });
</script>

<style>
  /* user image*/
  ._coral-Shell-user-image {
    width: 20%;
    margin: 0;
    float: left;
  }
</style>
