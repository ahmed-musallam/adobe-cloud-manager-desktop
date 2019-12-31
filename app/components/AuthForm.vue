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

      <label id="privateKey" class="coral-FieldLabel">Private Key</label>
      <textarea
        @input="auth.privateKey = $event.target.value"
        is="coral-textarea"
        class="coral-Form-field"
        labelledby="privateKey"
        style="resize: vertical;"
        >{{ auth.privateKey }}</textarea
      >
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
      <br />
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
      <br />
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

<script>
import AuthStore from "./../util/AuthStore";
import CMApiClient from "./../util/CMApiClient";
import SecretInput from "./SecretInput";
export default {
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
  async beforeCreate() {
    this.accessToken = await AuthStore.getAccessToken();
    this.auth = {
      apiKey: await AuthStore.getApiKey(),
      clientSecret: await AuthStore.getClientSecret(),
      orgId: await AuthStore.getOrgId(),
      techAcct: await AuthStore.getTechAcct(),
      privateKey: await AuthStore.getPrivateKey()
    };
  },
  methods: {
    handleAfterSave(error) {
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
    handleSave() {
      var err = false;
      try {
        AuthStore.setApiKey(this.auth.apiKey);
        AuthStore.setClientSecret(this.auth.clientSecret);
        AuthStore.setOrgId(this.auth.orgId);
        AuthStore.setTechAcct(this.auth.techAcct);
        AuthStore.setPrivateKey(this.auth.privateKey); // yeah, I know.. no encryption.. blah blah blah
      } catch (e) {
        this.handleAfterSave(true);
        throw e;
      }
      this.handleAfterSave(false);
    },
    handleRefreshToken() {
      const cmp = this;
      cmp.loading = true;
      adobeAuth({
        clientId: this.auth.apiKey,
        clientSecret: this.auth.clientSecret,
        privateKey: this.auth.privateKey,
        technicalAccountId: this.auth.techAcct,
        orgId: this.auth.orgId,
        metaScopes: ["https://ims-na1.adobelogin.com/s/ent_cloudmgr_sdk"]
      })
        .then(tokenResponse => tokenResponse.access_token)
        .then(accessToken => {
          console.debug("Success! got token: ", accessToken);
          this.accessToken = accessToken;
          AuthStore.setAccessToken(accessToken);
          CMApiClient.refresh(); // refresh the client after obtaining new access token
          cmp.loading = false;
          cmp.handleRefreshTokenResult();
        })
        .catch(err => {
          console.error(err);
          cmp.loading = false;
          cmp.handleRefreshTokenResult(true);
          this.accessToken = err;
        });
    },
    handleRefreshTokenResult(fail) {
      this.refreshResultFail = !!fail;
      this.showRefreshResult = true;
      setTimeout(() => {
        this.showRefreshResult = false;
        this.$forceUpdate(); // for some reason reactivity is lost, so forcing update....
      }, 3000);
    }
  }
};
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
