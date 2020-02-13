<template>
  <div>
    <h3>{{ environment.name }}</h3>
    <p>
      {{ environment.description }}
    </p>
    <coral-anchorlist>
      <a is="coral-anchorlist-item" icon="info" href="#" disabled=""
        ><b>Type:</b> {{ environment.type }}</a
      >
      <a
        is="coral-anchorlist-item"
        icon="link"
        @click="$openExternalLink(links.author)"
        >Author</a
      >
      <a
        is="coral-anchorlist-item"
        icon="link"
        @click="$openExternalLink(links.publish)"
        >Publish</a
      >
    </coral-anchorlist>
    <coral-drawer style="white-space: pre;">
      {{ JSON.stringify(environment, null, 4) }}
    </coral-drawer>
  </div>
</template>

<script lang="ts">
  import { Pipeline, Program, EnvironmentList, Environment } from "../client";
  import Vue from "vue"

  export default Vue.extend({
    name: "Environment",

    data() {
      return {
        environment: {} as Environment,
        links: {} as any
      };
    },
    async created() {
      const client = await this.$CloudManagerApi;
      const env = await client.environments.getEnvironment(
        this.$route.params.programId,
        this.$route.params.environmentId
      );
      this.environment = env.data;
      const links = this.environment?._links;
      this.links = {
        author: links?.http__ns_adobe_com_adobecloud_rel_author?.href,
        publish: links?.http__ns_adobe_com_adobecloud_rel_publish?.href
       // http__ns_adobe_com_adobecloud_rel_author
      };
    }
  });
</script>

<style scoped></style>
