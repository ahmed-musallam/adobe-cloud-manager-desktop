<template>
  <div>
    <coral-alert variant="error">
      <coral-alert-header>{{ $route.query.error }}</coral-alert-header>
      <coral-alert-content>
        {{ $route.query.detail }}
      </coral-alert-content>
    </coral-alert>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";

  export default Vue.extend({
    name: "AuthError"
  });
</script>

<style scoped>
  coral-alert {
    width: 100%;
    margin-top: 2em;
  }
</style>
