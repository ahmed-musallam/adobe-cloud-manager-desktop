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
