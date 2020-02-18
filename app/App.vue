<template>
  <coral-shell>
    <coral-shell-header>
      <coral-shell-header-content>
        <coral-shell-workspaces
          class="workspaces"
          v-if="programs && programs.length"
          ref="workspaces"
        >
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
        <!--
          <router-link to="/settings" role="link" tabindex="0">
          <button
            is="coral-button"
            icon="gears"
            variant="quietaction"
            style="margin-right: 0.5em;"
          ></button>
        </router-link>
        -->
        <coral-shell-menubar>
          <coral-shell-menubar-item
            menu="#user-menu"
            iconsize="M"
            iconvariant="circle"
            icon="userCircleColor"
          ></coral-shell-menubar-item>
        </coral-shell-menubar>
      </coral-shell-header-actions>
    </coral-shell-header>
    <!-- USER -->
    <coral-shell-menu id="user-menu" ref="userMenu">
      <coral-shell-user>
        <coral-shell-user-name>
          {{
            currentAccount.getName
              ? currentAccount.getName()
              : "No accounts yet"
          }}
        </coral-shell-user-name>
        <coral-shell-user-heading>Current Account</coral-shell-user-heading>
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
          </div>
          <h4>Other Accounts:</h4>
          <coral-buttonlist>
            <div v-for="(acc, i) in accounts" :key="i" class="user-item">
              <button
                is="coral-buttonlist-item"
                icon="user"
                @click="switchAccount(acc.getName())"
                @mouseenter="
                  $event.target.nextElementSibling.style.display = 'block'
                "
                @mouseleave="
                  $event.target.nextElementSibling.style.display = 'none'
                "
              >
                {{ acc.getName() }}
              </button>
              <div class="user-item_overlay">switch</div>
            </div>
          </coral-buttonlist>
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
        @save="handleAuthDialogSave"
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
  import AuthStore, { Account, currentAccountStore } from "./util/AuthStore";

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
        account: "",
        accounts: [] as Account[],
        currentAccount: {} as Account
      };
    },
    async created() {
      await this.init();
    },
    methods: {
      async init(account?: string) {
        if (account) {
          // this is a user switch
          this.$refs.userMenu.hide(); // hide user menu
          currentAccountStore.accountName = String(account);
          CloudManagerApi.refresh();
        }

        this.accounts = await AuthStore.getAccounts(true);
        this.currentAccount = await AuthStore.getCurrentAccount();
        const client = await CloudManagerApi.getInstance();
        try {
          this.$showLoadingScreen();
          this.programs = []; // clear previous programs, needed for profile switch
          const result = await client.programs.getPrograms();
          this.programs = result?.data?._embedded?.programs;
          this.$hideLoadingScreen();
          this.$nextTick(() => {
            const workspaces = this.$refs.workspaces as CoralElement;
            workspaces.on("coral-shell-workspaces:change", e => {
              const href = e.detail.selection.getAttribute("href") || "";
              // safeguard against same route navigation
              if (href && this.$route.path !== href) {
                this.currentProgramHref = href;
                console.log("pushing: ", { href });
                this.$router.push({ path: href });
              }
            });
            this.navigateToDefaultProgram();
          });
        } catch (error) {
          const status = error?.response?.status;
          if (401 === status || 403 == status) {
            console.log({ error });
            this.$router.push({
              path: "/auth-error",
              query: {
                error: `${status} Authentication Error`,
                detail: "Please check Authentication info for this user account"
              }
            });
          }
          this.$hideLoadingScreen();
        }
      },
      navigateToDefaultProgram() {
        if (this.programs && this.programs.length) {
          const route = this.$route;
          console.log("current route, ", { route });

          const firstProgramId = this.programs[0].id || "";
          console.log("going to", firstProgramId);
          if (firstProgramId) {
            this.$router.push(`/program/${firstProgramId}`).catch(err => {});
          }
        }
      },
      switchAccount(name: string) {
        console.log("Switch to: ", name);
        this.init(name);
      },
      handleAuthDialogSave() {
        console.log("saved!");
        this.init(this.account);
      },
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
        this.account = this.currentAccount.getName();
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
  .user-item {
    position: relative;
  }
  .user-item_overlay {
    position: absolute;
    top: 0;
    right: 0;
    display: none;
    padding: 7px;
  }
  .workspaces {
    width: 300px;
  }
</style>
