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
    <h3>Logs:</h3>
    <form class="coral-Form coral-Form--vertical flex">
      <div class="flex-half">
        <Select
          :options="days"
          label="Days"
          placeholder="Selec Days"
          v-model="logDays"
          @input="showLogs"
        ></Select>
      </div>
    </form>
    <table is="coral-table">
      <colgroup>
        <col
          is="coral-table-column"
          sortable=""
          sortabledirection="ascending"
        />
        <col is="coral-table-column" sortable="" />
      </colgroup>
      <thead is="coral-table-head">
        <tr is="coral-table-row">
          <th is="coral-table-headercell">Service</th>
          <th is="coral-table-headercell">Log File</th>
        </tr>
      </thead>
      <tbody is="coral-table-body">
        <tr
          is="coral-table-row"
          v-for="(logOption, i) in environment.availableLogOptions"
          :key="i"
        >
          <td is="coral-table-cell">{{ logOption.service }}</td>
          <td is="coral-table-cell">{{ logOption.name }}</td>
        </tr>
      </tbody>
    </table>
    <coral-drawer style="white-space: pre;">
      {{ JSON.stringify(environment, null, 4) }}
    </coral-drawer>
  </div>
</template>

<script lang="ts">
  import {
    Pipeline,
    Program,
    EnvironmentList,
    Environment,
    HalLink
  } from "../client";
  import Vue from "vue";
  import Select, { Option } from "./Select.vue";

  interface UndocumentedLogOption {
    service: string;
    name: string;
  }
  interface UndocumentedEnvironment extends Environment {
    availableLogOptions: UndocumentedLogOption[];
  }
  export default Vue.extend({
    name: "Environment",

    data() {
      return {
        environment: {} as Environment,
        links: {} as any,
        logDays: "",
        logService: "",
        logServiceOptions: [] as Option[],
        days: [
          { value: 1, title: "Today" },
          { value: 2, title: "Last Two Days" },
          { value: 3, title: "Last Three Days" },
          { value: 7, title: "Last Seven Days" }
        ]
      };
    },
    components: {
      Select
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
        publish: links?.http__ns_adobe_com_adobecloud_rel_publish?.href,
        // @ts-ignore // undocumented link "/api/program/7752/environment/12979/logs?service={service}&name={name}&days={days}",
        logs: links?.http__ns_adobe_com_adobecloud_rel_logs as HalLink
      };

      const undocumentedEnv = this.environment as UndocumentedEnvironment;
      const options = undocumentedEnv?.availableLogOptions?.map(o => o.service);
      const deduped = [...new Set(options)];
      this.logServiceOptions = deduped.map(o => ({
        value: o,
        title: o
      }));

      //const logsLink =  as HalLink;
      //await client.links.getLink(logsLink,)
    },
    methods: {
      async showLogs() {
        const client = await this.$CloudManagerApi;
        const response = await client.links.getLink(this.links.logs, {
          days: this.logDays,
          service: "publish",
          name: "aemerror"
        });
        console.log(response);
      },
      getLogServices() {
        // @ts-ignore // undocumented adobe api
        const services = this.environment?.availableLogOptions?.map(
          // @ts-ignore // undocumented adobe api
          o => o.service
        );
        return [...new Set(services)];
      },
      async downloadLog(service: string, name: string, days: string) {
        const client = await this.$CloudManagerApi;
        await client.links.getLink(this.links.logs, { service, name, days });
      },
      log: console.log
    }
  });
</script>

<style scoped>
  .flex {
    display: flex;
  }
  .flex-half {
    flex: 1 0 49%;
    padding: 5px;
  }
</style>
