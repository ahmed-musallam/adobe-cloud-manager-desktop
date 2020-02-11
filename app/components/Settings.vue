<template>
  <div>
    <h3>Settings:</h3>
    <coral-accordion>
      <coral-accordion-item>
        <coral-accordion-item-label>General</coral-accordion-item-label>
        <form class="coral-Form coral-Form--vertical">
          <label id="label1" class="coral-Form-fieldlabel"
            >Pipeline Status Refresh Interval (seconds)</label
          >
          <coral-numberinput labelledby="label1" value="5"></coral-numberinput>
        </form>
      </coral-accordion-item>
      <coral-accordion-item>
        <coral-accordion-item-label>Authentication</coral-accordion-item-label>
        <AuthForm></AuthForm>
      </coral-accordion-item>
    </coral-accordion>
    <button
      is="coral-button"
      variant="quietaction"
      icon="close"
      @click="quitApp"
      style="position: absolute;bottom: 5px;right: 5px;"
    >
      Quit
    </button>
  </div>
</template>

<script lang="ts">
  import AuthForm from "./AuthForm.vue";
  import Vue from "vue";

  export default Vue.extend({
    name: "Settings",
    components: {
      AuthForm
    },
    data() {
      return {};
    },
    methods: {
      quitApp() {
        electron.remote.getCurrentWindow().close();
      }
    }
  });
</script>

<style scoped></style>
