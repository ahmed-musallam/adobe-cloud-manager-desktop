<template>
  <div>
    <label :id="id" class="coral-FieldLabel">{{ label }}</label>
    <coral-select
      class="coral-Form-field"
      :labelledby="id"
      :placeholder="placeholder"
      @change="change"
    >
      <coral-select-item
        v-for="(option, index) in options"
        :key="index"
        :value="option.value"
        :selected="selectedOption(option)"
        >{{ option.title }}</coral-select-item
      >
    </coral-select>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import { CoralEvent } from "vue/types/vue";
  export interface Option {
    value: string;
    title: string;
  }

  export default Vue.extend({
    name: "Select",
    props: ["value", "label", "options", "placeholder"],
    data() {
      return {
        showSecret: false
      };
    },
    computed: {
      id() {
        return this.label.replace(/[\W_]+/g, "-");
      }
    },
    methods: {
      selectedOption(option: Option): boolean {
        if (this.value) {
          return option.value === this.value;
        }
        return false;
      },
      change(e: CoralEvent) {
        this.$emit("input", e?.target?.selectedItem?.value);
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
