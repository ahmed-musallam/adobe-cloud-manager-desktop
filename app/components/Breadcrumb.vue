<template>
  <nav>
    <ul class="spectrum-Breadcrumbs" v-if="$route.path.startsWith('/program')">
      <li class="spectrum-Breadcrumbs-item">
        <router-link
          :title="program"
          class="spectrum-Breadcrumbs-itemLink"
          :to="'/program/' + $route.params.programId"
          role="link"
          tabindex="0"
          >{{ program | limit(20) }}</router-link
        >
        <coral-icon
          v-if="$route.params.programId"
          class=""
          icon="ChevronRight"
          size="S"
        ></coral-icon>
      </li>
      <li class="spectrum-Breadcrumbs-item" v-if="pipeline">
        <router-link
          class="spectrum-Breadcrumbs-itemLink"
          :title="pipeline"
          :to="
            '/program/' +
              $route.params.programId +
              '/pipeline/' +
              $route.params.pipelineId
          "
          role="link"
          tabindex="0"
          >{{ pipeline | limit(20) }}</router-link
        >
        <coral-icon
          v-if="$route.params.pipelineId"
          class=""
          icon="ChevronRight"
          size="S"
        ></coral-icon>
      </li>
      <li class="spectrum-Breadcrumbs-item" v-if="pipeline && execution">
        <router-link
          class="spectrum-Breadcrumbs-itemLink"
          :to="
            '/program/' +
              $route.params.programId +
              '/pipeline/' +
              $route.params.pipelineId +
              '/execution/' +
              $route.params.executionId
          "
          role="link"
          tabindex="0"
          >{{ execution | limit(20) }}</router-link
        >
      </li>
    </ul>
    <ul v-else class="spectrum-Breadcrumbs">
      <li
        v-for="(breadcrumb, index) in breadcrumbs"
        :key="index"
        class="spectrum-Breadcrumbs-item"
      >
        <router-link
          class="spectrum-Breadcrumbs-itemLink"
          :to="breadcrumb[0]"
          role="link"
          tabindex="0"
          >{{ breadcrumb[1] | limit(20) }}</router-link
        >
        <coral-icon
          v-if="breadcrumbs.length == 1 || breadcrumbs.length - 1 === index"
          class=""
          icon="ChevronRight"
          size="S"
        ></coral-icon>
      </li>
    </ul>
  </nav>
</template>

<script>
  import { store } from "./BreadcrumbStore";

  export default {
    name: "Breadcrumb",
    computed: {
      breadcrumbs() {
        return this.$route.path
          .split("/")
          .filter(Boolean)
          .reduce((acc, item, ind, arr) => {
            acc.push(["/" + arr.slice(0, ind + 1).join("/"), item]);
            return acc;
          }, []);
      },
      program() {
        return store.program.name;
      },
      pipeline() {
        return store.pipeline;
      },
      execution() {
        return store.execution;
      }
    },
    beforeCreate() {},

    methods: {}
  };
</script>

<style scoped>
  [icon="ChevronRight"] {
    color: #b3b3b3;
  }
  .spectrum-Breadcrumbs-itemLink {
    color: #6e6e6e;
  }
  .spectrum-Breadcrumbs-itemLink.router-link-active {
    color: #2c2c2c;
  }
</style>
