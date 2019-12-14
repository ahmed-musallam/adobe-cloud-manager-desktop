<template>
  <div>
    <form class="coral-Form coral-Form--vertical">
      <label id="apiKey" class="coral-FieldLabel">API Key</label>
      <input is="coral-textfield" labelledby="apiKey" class="coral-Form-field" variant="quiet" >
      <label id="clientSecret" class="coral-FieldLabel">Client Secret</label>
      <input is="coral-textfield" labelledby="clientSecret" class="coral-Form-field" variant="quiet" >
      <label id="orgId" class="coral-FieldLabel">Organization ID</label>
      <input is="coral-textfield" labelledby="orgId" class="coral-Form-field" variant="quiet" >
      <label id="techAcct" class="coral-FieldLabel">Technical Account</label>
      <input is="coral-textfield" labelledby="techAcct" class="coral-Form-field" variant="quiet" >
      <coral-fileupload labelledby="privateKey" name="file" action="">
        <button is="coral-button" coral-fileupload-select="">Select Private Key</button>
      </coral-fileupload>
    </form>
  </div>
</template>

<script>
export default {
  name: "AuthForm",
  data() {
    return {
      message: "Hi, there! test"
    };
  }
};
</script>

<style scoped>
</style>