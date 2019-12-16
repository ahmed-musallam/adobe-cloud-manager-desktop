<template>
  <div>
    <form class="coral-Form coral-Form--vertical">
      <label id="apiKey" class="coral-FieldLabel">API Key</label>
      <input :value="auth.apiKey" @input="auth.apiKey=$event.target.value"  is="coral-textfield" labelledby="apiKey" class="coral-Form-field" variant="quiet" >
      <label id="clientSecret" class="coral-FieldLabel">Client Secret</label>
      <input :value="auth.clientSecret" @input="auth.clientSecret=$event.target.value" is="coral-textfield"  labelledby="clientSecret" class="coral-Form-field" variant="quiet" >
      <label id="orgId" class="coral-FieldLabel">Organization ID</label>
      <input :value="auth.orgId" @input="auth.orgId=$event.target.value"  is="coral-textfield"  labelledby="orgId" class="coral-Form-field" variant="quiet" >
      <label id="techAcct" class="coral-FieldLabel">Technical Account</label>
      <input :value="auth.techAcct" @input="auth.techAcct=$event.target.value"  is="coral-textfield"  labelledby="techAcct" class="coral-Form-field" variant="quiet" >
      <label id="privateKey" class="coral-FieldLabel">Private Key</label>
      <textarea @input="auth.privateKey=$event.target.value" is="coral-textarea" class="coral-Form-field" labelledby="privateKey" style="resize: vertical;">{{auth.privateKey}}</textarea>
      <button @click="handleRefreshToken" is="coral-button" type="button">
        <span :class="{ hidden: !loading}"><coral-wait size="S"></coral-wait></span>
        <span :class="{ hidden: !showCheck}"><coral-icon icon="Checkmark" size="S" title="check" style="color: green;"></coral-icon></span>
        <span :class="{ hidden: showCheck || loading}">Refresh Token</span>
      </button>
      <button @click="handleSave" is="coral-button" type="button">Save</button>
      <h4 class="status" :class="{ hidden: !saved }" :style="{ color: savedError ? 'red' : 'green'}"><em>{{saveMsg}}</em></h4>
      <br/>
    </form>
    <form class="coral-Form coral-Form--vertical">
      <label id="accessToken" class="coral-FieldLabel">Current Access Token</label>
      <textarea disabled="" is="coral-textarea" class="coral-Form-field" labelledby="accessToken" style="resize: vertical;">{{accessToken}}</textarea>
    </form>
  </div>
</template>

<script>
export default {
  name: "AuthForm",

  data() {
    return {
      loading: false,
      showCheck: false,
      saved: false,
      savedError: false,
      saveMsg: "",
      accessToken: electronStore.get('accessToken'),
      auth: {
        apiKey: electronStore.get('apiKey'),
        clientSecret: electronStore.get('clientSecret'),
        orgId: electronStore.get('orgId'),
        techAcct: electronStore.get('techAcct'),
        privateKey: electronStore.get('privateKey')
      }
    }
  },
  methods: {
    handleShowCheck() {
      this.showCheck = true;
      setTimeout(() => {
        this.showCheck = false
        this.$forceUpdate(); // for some reason reactivity is lost, so forcing update....
      }, 3000)
    },
    handleAfterSave(error) {
      if (error) {
        this.savedError = true;
        this.saveMsg = "Error! Check log!"
      } else {
        this.savedError = false;
        this.saveMsg = "Success!";
      }
      this.saved = true;
      setTimeout(() => {
        this.saved = false
        this.$forceUpdate(); // for some reason reactivity is lost, so forcing update....
      }, 5000)
    },
    handleSave() {
      var err = false;
      try {
        electronStore.set('apiKey', this.auth.apiKey);
        electronStore.set('clientSecret', this.auth.clientSecret);
        electronStore.set('orgId', this.auth.orgId);
        electronStore.set('techAcct', this.auth.techAcct);
        electronStore.set('privateKey', this.auth.privateKey); // yeah, I know.. no encryption.. blah blah  blah
      } catch (e) {
        this.handleAfterSave(true)
        throw e
      }
      this.handleAfterSave(false)
    },
    handleRefreshToken(){
      const cmp = this;
      cmp.loading = true;
      adobeAuth({
        clientId: this.auth.apiKey, //electronStore.get('apiKey'),
        clientSecret: this.auth.clientSecret, // electronStore.get('clientSecret'),
        privateKey: this.auth.privateKey, //electronStore.get('privateKey'),
        technicalAccountId: this.auth.techAcct, //electronStore.get('techAcct'),
        orgId: this.auth.orgId, //electronStore.get('orgId'),
        metaScopes: [
          'https://ims-na1.adobelogin.com/s/ent_cloudmgr_sdk'
        ]
      })
      .then(tokenResponse => tokenResponse.access_token)
      .then(accessToken => {
        console.debug("Success! got token: ", accessToken)
        electronStore.set('accessToken', accessToken);
        cmp.loading = false;
        cmp.handleShowCheck();
      })
      .catch(console.error)
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