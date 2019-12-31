<template>
  <div>
    <h3>Settings:</h3>
    <AuthForm></AuthForm>
  </div>
</template>

<script>
import AuthForm from "./AuthForm";
export default {
  name: "Settings",
  components: {
    AuthForm
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped></style>
