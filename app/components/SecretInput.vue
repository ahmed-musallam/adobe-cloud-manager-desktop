<template>
  <div>
    <label :id="id" class="coral-FieldLabel">{{ label }}</label>

    <textarea
      v-if="textarea"
      @input="$emit('input', $event.target.value)"
      is="coral-textarea"
      :labelledby="'#' + id"
      class="coral-Form-field"
      :secret="!showSecret"
      style="resize: vertical;"
    >
      {{ value }}
    </textarea>
    <input
      v-else
      :value="value"
      @input="$emit('input', $event.target.value)"
      is="coral-textfield"
      :labelledby="'#' + id"
      class="coral-Form-field"
      variant="quiet"
      :type="showSecret ? 'text' : 'password'"
    />
    <button
      is="coral-button"
      @click="showSecret = !showSecret"
      icon="viewOn"
      variant="quietaction"
      style=""
    ></button>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  export default Vue.extend({
    name: "SecretInput",
    props: ["value", "label", "textarea"],
    data() {
      return {
        showSecret: false
      };
    },
    computed: {
      id() {
        return this.label.replace(/[\W_]+/g, "-");
      }
    }
  });
</script>

<style scoped>
  .coral-FieldLabel {
    display: block;
  }
  .coral-Form-field._coral-Textfield {
    display: inline-block;
    width: 90%;
  }
  [secret="true"] {
    -webkit-text-security: disc;
  }
</style>
