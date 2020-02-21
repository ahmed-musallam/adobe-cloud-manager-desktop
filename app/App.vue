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
        <div v-if="hasAccounts">
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
        </div>
        <coral-shell-menubar>
          <coral-shell-menubar-item
            menu="#user-menu"
            iconsize="M"
            iconvariant="circle"
            icon="userCircleColor_Light"
          ></coral-shell-menubar-item>
        </coral-shell-menubar>
      </coral-shell-header-actions>
    </coral-shell-header>
    <!-- USER -->
    <coral-shell-menu id="user-menu" ref="userMenu">
      <coral-shell-user
        avatar="userCircleColor_Light"
        :style="{ display: hasAccounts ? 'block' : 'none' }"
      >
        <coral-shell-user-name>
          {{ hasAccounts ? currentAccount.getName() : "No accounts yet" }}
        </coral-shell-user-name>
        <coral-shell-user-heading>Current Account</coral-shell-user-heading>
        <coral-shell-user-content>
          <div>
            <a is="coral-anchorbutton" variant="quiet" icon="userEdit" @click="editAccount"
              >Manage Account</a
            >
            <br />
            <a is="coral-anchorbutton" variant="quiet" icon="userAdd" @click="addAccount"
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
                @mouseenter="$event.target.nextElementSibling.style.display = 'block'"
                @mouseleave="$event.target.nextElementSibling.style.display = 'none'"
              >
                {{ acc.getName() }}
              </button>
              <div class="user-item_overlay">switch</div>
            </div>
          </coral-buttonlist>
        </coral-shell-user-content>
      </coral-shell-user>
      <button
        v-if="!hasAccounts"
        is="coral-button"
        variant="quietaction"
        icon="userAdd"
        @click="addAccount"
      >
        Add Account
      </button>
    </coral-shell-menu>
    <coral-shell-content>
      <!-- Main application goes here -->
      <section class="u-coral-padding-horizontal">
        <router-view v-if="!!hasAccounts && loadedAccounts"></router-view>
        <coral-alert v-else style="width:100%; margin-top: 2em;">
          <coral-alert-header>
            No Accounts Have been added, please add an account.
          </coral-alert-header>
        </coral-alert>
      </section>
      <AuthFormDialog
        :show="authDialogShow"
        :mode="authDialogMode"
        :account="account"
        @close="authDialogShow = false"
        @save="handleAuthDialogSave"
        @add="handleAddNewAccount"
      ></AuthFormDialog>
      <Loading></Loading>
    </coral-shell-content>
  </coral-shell>
</template>

<script lang="ts">
  import Loading from "./components/Loading.vue";
  import AuthFormDialog, { AuthFormDialogMode } from "./components/AuthFormDialog.vue";
  import { AxiosRequestConfig } from "axios";
  import { store } from "./components/BreadcrumbStore";
  import Vue from "vue";
  import { CoralElement } from "vue/types/vue";
  import { ProgramList, ProgramListEmbedded, EmbeddedProgram, Program } from "./client";
  import CloudManagerApi, { CloudManagerApiInstance } from "./client/wrapper/CloudManagerApi";
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
        account: "" as string | undefined,
        accounts: [] as Account[],
        currentAccount: {} as Account | null,
        loadedAccounts: false
      };
    },
    computed: {
      hasAccounts(): boolean {
        // atleast the current account exists
        return !!this.currentAccount?.getName && !!this.currentAccount.getName();
      }
    },
    async created() {
      await this.init();
      this.loadedAccounts = true;
    },
    methods: {
      async init(account?: string) {
        this.$showLoadingScreen();
        if (account) {
          // this is a user switch
          const userMenu = this.$refs.userMenu as CoralElement;
          userMenu.hide(); // hide user menu
          currentAccountStore.accountName = String(account);
          CloudManagerApi.refresh();
        }

        this.accounts = await AuthStore.getAccounts(true);
        this.currentAccount = await AuthStore.getCurrentAccount();
        const client = await CloudManagerApi.getInstance();
        try {
          this.programs = []; // clear previous programs, needed for profile switch
          const result = await client.programs.getPrograms();
          this.programs = result?.data?._embedded?.programs;
          this.$nextTick(() => {
            const workspaces = this.$refs.workspaces as CoralElement;
            workspaces.on("coral-shell-workspaces:change", e => {
              const href = e.detail.selection.getAttribute("href") || "";
              // safeguard against same route navigation
              if (href && this.$route.path !== href) {
                this.currentProgramHref = href;
                this.$router.push({ path: href });
              }
            });
            this.navigateToDefaultProgram();
          });
        } catch (error) {
          const status = error?.response?.status;
          if (401 === status || 403 == status) {
            this.$router.push({
              path: "/auth-error",
              query: {
                error: `${status} Authentication Error`,
                detail: "Please check Authentication info for this user account"
              }
            });
          }
        } finally {
          this.$hideLoadingScreen();
        }
      },
      navigateToDefaultProgram() {
        if (this.programs && this.programs.length) {
          const route = this.$route;
          const firstProgramId = this.programs[0].id || "";
          if (firstProgramId) {
            this.$router.push(`/program/${firstProgramId}`).catch(err => {});
          }
        }
      },
      switchAccount(name: string) {
        this.init(name);
      },
      handleAuthDialogSave() {
        this.init(this.account);
      },
      handleAddNewAccount(newAccountName: string) {
        this.init(newAccountName);
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
          this.$router.push({
            path: this.currentProgramHref
          });
        }
      },
      editAccount() {
        this.account = this.currentAccount?.getName();
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
