<template>
  <nav>
    <ul class="spectrum-Breadcrumbs">
      <li class="spectrum-Breadcrumbs-item">
        <router-link
          class="spectrum-Breadcrumbs-itemLink"
          :to="'/program/' + $route.params.programId"
          role="link"
          tabindex="0"
          >{{ program | limit(20) }}</router-link
        >
        <coral-icon class="" icon="ChevronRight" size="S"></coral-icon>
      </li>
      <li class="spectrum-Breadcrumbs-item" v-if="pipeline">
        <router-link
          class="spectrum-Breadcrumbs-itemLink"
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
        <!-- <coral-icon class="" icon="ChevronRight" size="S"></coral-icon> -->
      </li>
      <!--
        <li class="spectrum-Breadcrumbs-item">
        <a class="spectrum-Breadcrumbs-itemLink" role="link" aria-current="page">January 2019 Assets</a>
      </li>
      -->
    </ul>
  </nav>
</template>

<script>
import CMApiClient from "../util/CMApiClient";
import { store } from "./BreadcrumbStore";

export default {
  name: "Breadcrumb",
  computed: {
    program() {
      return store.program.name;
    },
    pipeline() {
      return store.pipeline;
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
