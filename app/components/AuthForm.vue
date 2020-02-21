<template>
  <div>
    <form class="coral-Form coral-Form--vertical">
      <label id="accountId" class="coral-FieldLabel">Account Name</label>
      <input
        v-if="mode === 'edit'"
        :value="account"
        disabled
        is="coral-textfield"
        labelledby="#accountId"
        class="coral-Form-field"
        variant="quiet"
        type="text"
      />
      <input
        v-else
        :value="newAccountName"
        @input="newAccountName = $event.target.value"
        is="coral-textfield"
        labelledby="#accountId"
        class="coral-Form-field"
        variant="quiet"
        type="text"
      />
      <SecretInput label="API Key" v-model="auth.apiKey"></SecretInput>
      <SecretInput label="Client Secret" v-model="auth.clientSecret"></SecretInput>
      <SecretInput label="Organization ID" v-model="auth.orgId"></SecretInput>
      <SecretInput label="Technical Account" v-model="auth.techAcct"></SecretInput>
      <SecretInput label="Private Key" textarea="true" v-model="auth.privateKey"></SecretInput>
      <button @click="testAuthentication" is="coral-button" type="button">
        Test Authentication
      </button>
      <h4 class="status" :style="{ color: savedError ? 'red' : 'green' }">
        <em v-if="!loading">{{ saveMsg }}</em>
        <coral-wait v-if="loading" size="S"></coral-wait>
      </h4>
      <br />
      <!--
      <button @click="handleRefreshToken" is="coral-button" type="button">
        <span :class="{ hidden: !loading }">
          <coral-wait size="S"></coral-wait>
        </span>
        <span :class="{ hidden: !showRefreshResult }">
          <coral-icon
            :icon="refreshResultFail ? 'Close' : 'Checkmark'"
            size="S"
            title="check"
            :style="{ color: refreshResultFail ? 'red' : 'green' }"
          ></coral-icon>
        </span>
        <span :class="{ hidden: showRefreshResult || loading }"
          >Refresh Token</span
        >
      </button>
      -->
    </form>
    <!--
    <form class="coral-Form coral-Form--vertical">
      <label id="accessToken" class="coral-FieldLabel"
        >Current Access Token</label
      >
      <textarea
        disabled
        is="coral-textarea"
        class="coral-Form-field"
        labelledby="accessToken"
        style="resize: vertical;"
        >{{ auth.accessToken }}</textarea
      >
    </form>
    -->
  </div>
</template>

<script lang="ts">
  import AuthStore, { InMemoryAccount } from "./../util/AuthStore";
  import SecretInput from "./SecretInput.vue";
  import AuthUtil from "../util/AuthUtil";
  import Vue from "vue";
  import { AuthFormDialogMode } from "./AuthFormDialog.vue";
  type stringOrNull = string | null;

  export interface AuthFormData {
    apiKey: stringOrNull;
    clientSecret: stringOrNull;
    orgId: stringOrNull;
    techAcct: stringOrNull;
    privateKey: stringOrNull;
    name?: string;
  }
  export default Vue.extend({
    name: "AuthForm",
    props: {
      mode: String,
      account: String
    },
    components: {
      SecretInput
    },
    data() {
      return {
        loading: false,
        showRefreshResult: false,
        refreshResultFail: false,
        saved: false,
        savedError: false,
        saveMsg: "",
        newAccountName: "",
        accessToken: "" as stringOrNull,
        auth: {
          apiKey: "",
          clientSecret: "",
          orgId: "",
          techAcct: "",
          privateKey: ""
        } as AuthFormData
      };
    },
    watch: {
      newAccountName(newValue) {
        if (this.mode === AuthFormDialogMode.EDIT) {
          this.$emit(
            "input",
            Object.assign({}, this.auth, {
              name: this.newAccountName
            })
          );
        }
      },
      auth: {
        handler(authData: AuthFormData) {
          if (this.mode === AuthFormDialogMode.ADD) {
            authData.name = this.newAccountName;
          }
          this.$emit("input", authData); // to make this component work with v-model
        },
        deep: true
      }
    },
    async created() {
      if (this.mode === AuthFormDialogMode.EDIT) {
        const account = await AuthStore.getAccount(this.account);
        this.accessToken = await account.getAccessToken();
        this.auth = {
          apiKey: await account.getApiKey(),
          clientSecret: await account.getClientSecret(),
          orgId: await account.getOrgId(),
          techAcct: await account.getTechAcct(),
          privateKey: await account.getPrivateKey()
        };
      }
    },
    methods: {
      handleAfterSave(error: boolean) {
        if (error) {
          this.savedError = true;
          this.saveMsg = "Error! Check log!";
        } else {
          this.savedError = false;
          this.saveMsg = "Success!";
        }
        this.saved = true;
        setTimeout(() => {
          this.saved = false;
          this.$forceUpdate(); // for some reason reactivity is lost, so forcing update....
        }, 5000);
      },
      async testAuthentication() {
        var err = false;
        const account = new InMemoryAccount("test");
        account.setApiKey(String(this.auth.apiKey));
        account.setClientSecret(String(this.auth.clientSecret));
        account.setOrgId(String(this.auth.orgId));
        account.setTechAcct(String(this.auth.techAcct));
        account.setPrivateKey(String(this.auth.privateKey));
        try {
          this.loading = true;
          await AuthUtil.getAccessToken(account);
        } catch (e) {
          this.loading = false;
          this.handleAfterSave(true);
          throw e;
        }
        this.loading = false;
        this.handleAfterSave(false);
      }
    }
  });
</script>

<style scoped>
  .hidden {
    display: none;
  }
  .status {
    display: inline;
    line-height: 32px;
    margin-left: 7px;
  }
</style>
