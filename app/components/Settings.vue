<template>
  <div>
    <h3>Settings:</h3>
    <hr />
    <form class="coral-FormGroup coral-FormGroup--labelsAbove">
      <div class="coral-FormGroup-item">
        <coral-checkbox v-model="debug">Debug Mode</coral-checkbox>
        <div v-if="debug">debug</div>
      </div>
    </form>

    <button
      is="coral-button"
      variant="quietaction"
      icon="close"
      @click="quitApp"
      style="position: fixed;bottom: 5px;right: 5px;"
    >
      Quit
    </button>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import { electronStore } from "../../global";

  export default Vue.extend({
    name: "Settings",
    components: {},
    data() {
      return {
        debug: false
      };
    },
    methods: {
      quitApp() {
        electron.remote.getCurrentWindow().close();
      },
      log: console.log
    }
  });
</script>

<style scoped></style>
