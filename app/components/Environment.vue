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
    <form class="coral-Form coral-Form--vertical">
      <Select
        :options="days"
        label="Days"
        placeholder="Selec Days"
        v-model="logDays"
        @input="showLogs"
      ></Select>
      <div v-if="logDays">
        <label id="filter" class="coral-FieldLabel">Filter</label>
        <coral-search
          labelledby="filter"
          class="coral-Form-field"
          @input="e => (this.filter = e.target.value)"
        />
      </div>
    </form>
    <div
      v-if="logsStatus === 'loading'"
      style="position:relative;width:100%;height:100px"
    >
      <coral-wait centered=""></coral-wait>
    </div>
    <div v-else-if="logsStatus === 'loaded'">
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
            <th is="coral-table-headercell">Date</th>
            <th is="coral-table-headercell">Download / Tail</th>
          </tr>
        </thead>
        <tbody is="coral-table-body">
          <tr
            is="coral-table-row"
            v-for="(logDownload, i) in filteredLogDownloads"
            :key="i"
          >
            <td is="coral-table-cell">{{ logDownload.service }}</td>
            <td is="coral-table-cell">{{ logDownload.name }}</td>
            <td is="coral-table-cell">{{ logDownload.date | dateNoTime }}</td>
            <td is="coral-table-cell">
              <button
                is="coral-button"
                icon="download"
                variant="action"
                title="download"
                v-if="
                  logDownload._links
                    .http__ns_adobe_com_adobecloud_rel_logs_download
                "
                @click="downloadLog(logDownload)"
              ></button>
              <button
                is="coral-button"
                icon="ViewDetail"
                variant="action"
                title="tail"
                v-if="
                  logDownload._links.http__ns_adobe_com_adobecloud_rel_logs_tail
                "
                @click="tailLog(logDownload)"
              ></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

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
  import { CoralEvent } from "vue/types/vue";
  import globalAxios from "axios";

  interface UndocumentedLogOption {
    service: string;
    name: string;
  }
  interface UndocumentedEnvironment extends Environment {
    availableLogOptions: UndocumentedLogOption[];
  }
  interface LogDownloadHalLink extends HalLink {
    _links: {
      http__ns_adobe_com_adobecloud_rel_logs_download: HalLink;
      http__ns_adobe_com_adobecloud_rel_logs_tail: HalLink;
    };
  }
  interface LogHalLink extends HalLink {
    http__ns_adobe_com_adobecloud_rel_logs: HalLink;
    _links: LogDownloadHalLink;
  }

  interface LogDownlodResult {
    redirect: string;
  }
  export default Vue.extend({
    name: "Environment",

    data() {
      return {
        environment: {} as Environment,
        links: {} as any,
        logDays: "1",
        logService: "",
        logsStatus: "loading",
        logServiceOptions: [] as Option[],
        logDownloads: [],
        filteredLogDownloads: [],
        filter: "",
        days: [
          { value: "1", title: "Today" },
          { value: "2", title: "Last Two Days" },
          { value: "3", title: "Last Three Days" },
          { value: "7", title: "Last Seven Days" }
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

      this.logServiceOptions = [...new Set(options)].map(o => ({
        value: o,
        title: o
      }));
      this.logServiceOptions.unshift({
        value: "",
        title: "All"
      });
      this.showLogs();
      //const logsLink =  as HalLink;
      //await client.links.getLink(logsLink,)
    },
    watch: {
      filter: function(newVal) {
        this.filterLogs();
      }
    },
    methods: {
      async showLogs() {
        this.logsStatus = "loading";
        const client = await this.$CloudManagerApi;
        const response = await client.links.getLink(
          this.links.logs,
          {
            days: this.logDays
            //service: "publish",
            //name: "aemerror"
          },
          href =>
            // another unfortunate thing. the URI template returned for env logs makes these params required
            // when they are optional.. so fixing that here... probably a bad idea but works ¯\_(ツ)_/¯
            href.replace(
              "?service={service}&name={name}&days={days}",
              "{?service,name,days}"
            )
        );
        this.logDownloads = response.data?._embedded?.downloads || [];
        this.filteredLogDownloads = this.logDownloads;
        this.filterLogs();
        this.logsStatus = "loaded";
      },
      getLogServices() {
        // @ts-ignore // undocumented adobe api
        const services = this.environment?.availableLogOptions?.map(
          // @ts-ignore // undocumented adobe api
          o => o.service
        );
        return [...new Set(services)];
      },
      async downloadLog(logDownload: LogDownloadHalLink) {
        this.$showLoadingScreen();
        const client = await this.$CloudManagerApi;
        const result = await client.links.getLink(
          logDownload?._links?.http__ns_adobe_com_adobecloud_rel_logs_download
        );
        this.$hideLoadingScreen();
        const download = result.data as LogDownlodResult;
        this.$downloadFile(download.redirect);
      },
      async tailLog(logDownload: LogDownloadHalLink) {
        const logUrl =
          logDownload?._links?.http__ns_adobe_com_adobecloud_rel_logs_tail
            ?.href || "";
        console.log("tailing: ", logUrl);
        let logWindow = new electron.remote.BrowserWindow({
          show: false,
          webPreferences: {
            preload: location.pathname.replace("index.html", "preload.js")
          }
        });
        const logTailPath = location.pathname.replace(
          "index.html",
          "logTail.html"
        );
        //logWindow.openDevTools();
        logWindow.loadURL(
          `file://${logTailPath}?url=${encodeURIComponent(logUrl)}`
        );
        logWindow.once("ready-to-show", () => {
          //logWindow.reload();
          logWindow.show();
        });

        logWindow.on("closed", () => {
          logWindow = null;
        });
        return logWindow;

        // this.$router.push({
        //   name: "logtail",
        //   params: {
        //     programId: this.$route.params.programId,
        //     environmentId: this.$route.params.environmentId
        //   },
        //   query: { url: logUrl }
        // });
      },
      filterLogs() {
        this.filteredLogDownloads = this.logDownloads.filter(l => {
          return (
            !this.filter ||
            // @ts-ignore // undocumented adobe api
            l.service.indexOf(this.filter) !== -1 ||
            // @ts-ignore // undocumented adobe api
            l.name.indexOf(this.filter) !== -1
          );
        });
        this.$forceUpdate();
      }
    }
  });
</script>

<style scoped></style>
