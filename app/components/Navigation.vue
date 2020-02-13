<template>
  <coral-buttongroup>
    <button
      is="coral-button"
      icon="ChevronLeft"
      title="back"
      variant="action"
      @click="goBack"
      :disabled="!canGoBack"
    ></button>
    <button
      is="coral-button"
      icon="ChevronRight"
      title="forward"
      variant="action"
      @click="goForward"
    ></button>
  </coral-buttongroup>
</template>

<script>
  export default {
    name: "Navigation",
    computed: {
      canGoBack() {
        return history;
      }
    },

    methods: {
      canGoBack() {
        return !!history.length;
      },
      goBack() {
        history.back();
      },
      goForward() {
        history.forward();
      }
    }
  };
</script>

<style scoped>
  coral-buttongroup {
    float: right;
  }
</style>
