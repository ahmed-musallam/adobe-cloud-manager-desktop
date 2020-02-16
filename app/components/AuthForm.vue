<template>
  <div>
    <form class="coral-Form coral-Form--vertical">
      <SecretInput label="API Key" v-model="auth.apiKey"></SecretInput>
      <SecretInput
        label="Client Secret"
        v-model="auth.clientSecret"
      ></SecretInput>
      <SecretInput label="Organization ID" v-model="auth.orgId"></SecretInput>
      <SecretInput
        label="Technical Account"
        v-model="auth.techAcct"
      ></SecretInput>
      <SecretInput
        label="Private Key"
        textarea="true"
        v-model="auth.privateKey"
      ></SecretInput>
      <button @click="handleSave" is="coral-button" type="button">
        Save Authentication Info
      </button>
      <h4
        class="status"
        :class="{ hidden: !saved }"
        :style="{ color: savedError ? 'red' : 'green' }"
      >
        <em>{{ saveMsg }}</em>
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
        >{{ accessToken }}</textarea
      >
    </form>
  </div>
</template>

<script lang="ts">
  import AuthStore from "./../util/AuthStore";
  import SecretInput from "./SecretInput.vue";
  import AuthUtil from "../util/AuthUtil";
  import Vue from "vue";

  export default Vue.extend({
    name: "AuthForm",

    data() {
      return {
        loading: false,
        showRefreshResult: false,
        refreshResultFail: false,
        saved: false,
        savedError: false,
        saveMsg: "",
        accessToken: "",
        auth: {
          apiKey: "",
          clientSecret: "",
          orgId: "",
          techAcct: "",
          privateKey: ""
        }
      };
    },
    components: {
      SecretInput
    },
    async created() {
      const account = await AuthStore.getCurrentAccount();
      this.accessToken = account.getAccessToken();
      this.auth = {
        apiKey: account.getApiKey(),
        clientSecret: account.getClientSecret(),
        orgId: account.getOrgId(),
        techAcct: account.getTechAcct(),
        privateKey: account.getPrivateKey()
      };
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
      async handleSave() {
        var err = false;
        const account = await AuthStore.getCurrentAccount();
        try {
          account.setApiKey(this.auth.apiKey);
          account.setClientSecret(this.auth.clientSecret);
          account.setOrgId(this.auth.orgId);
          account.setTechAcct(this.auth.techAcct);
          account.setPrivateKey(this.auth.privateKey); // yeah, I know.. no encryption.. blah blah blah
        } catch (e) {
          this.handleAfterSave(true);
          throw e;
        }
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
