<template>
  <div style="overflow-x:scroll">
    <div class="bottom-right">
      <coral-wait size="M" v-if="loading && !error"></coral-wait>
    </div>
    <coral-banner variant="error" v-if="error">
      <coral-banner-header>Error</coral-banner-header>
      <coral-banner-content>{{ error }}</coral-banner-content>
    </coral-banner>
    <div id="log-scroll-area" class="clusterize-scroll">
      <ol id="log-content-area" class="clusterize-content">
        <li class="clusterize-no-data">Loading data...</li>
      </ol>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import globalAxios from "axios";
  import {
    PipelineExecutionStatusEnum,
    PipelineStatusEnum,
    PipelineExecutionStepStateStatusEnum
  } from "../client";
  import CloudManagerApi from "./client/wrapper/CloudManagerApi";

  export default Vue.extend({
    name: "LogTailApp",
    data() {
      return {
        tailPromise: new Promise(resolve => ""),
        signal: globalAxios.CancelToken.source(),
        dataChunks: [] as string[],
        clusterize: {} as any,
        loading: true,
        error: ""
      };
    },
    async created() {
      const params = new URLSearchParams(location.search);
      const url = params.get(`url`);
      console.log(`here we are!`);
      console.log(`location.search: ${location.search}`);
      console.log(`url: ${url}`);
      if (url) {
        let contentLength = await this.getContentLength(String(url));
        //console.log(`initial content length: ${contentLength}`);
        this.tailPromise = this.tail(String(url), contentLength);
        this.clusterize = new Clusterize({
          rows: [],
          scrollId: "log-scroll-area",
          contentId: "log-content-area"
        });
      }
    },
    methods: {
      async getContentLength(url: string) {
        const client = await CloudManagerApi.getInstance();
        const resp = await client.logs.head(url);
        return parseInt(resp.headers["content-length"]);
      },
      async getLog(url: string, startLimit: number) {
        const client = await CloudManagerApi.getInstance();
        //console.log("getting log at: ", { startLimit });
        const res = await client.logs.get(
          url + `&date=${new Date().getTime()}`,
          {
            headers: {
              Range: "bytes=" + startLimit + "-"
            },
            cancelToken: this.signal.token
          }
        );
        return res;
      },
      addToLog(data: string) {
        const _data = data.split("\n").map(line => `<li>${line}<li>`);
        this.clusterize.append(_data);
      },
      throwError(msg: string) {
        this.loading = false;
        this.error = msg;
        throw new Error(msg);
      },
      async tail(url: string, initialStart?: number) {
        let currentStart = 0;
        if (initialStart) {
          currentStart = initialStart - 1000; // initial chunk
        }
        let currentContentLength = 0;
        for (;;) {
          if (this.signal.token.reason) {
            return; // cancelled, exit.
          }
          currentStart = currentStart;
          //console.log(`requesting log starting at: ${currentStart}`);
          let logResponse: any;
          try {
            logResponse = await this.getLog(url, currentStart);
            currentContentLength = parseInt(
              logResponse.headers["content-length"]
            );
            this.addToLog(logResponse.data);
          } catch (error) {
            currentContentLength = 0;
            if (error?.constructor?.name === "Cancel") {
              console.log("CANCELLED!");
              return; // we cancelled the request!
            }
            const errorResponse = error?.response;
            const errorStatus = errorResponse.status;
            if (errorStatus === 416) {
              //console.log("got 416")!;
              await this.$sleep(2000); // sleep 2 seconds and try again
            } else if (errorStatus === 404) {
              this.throwError(
                `Logs not found! ${errorResponse.request.url} (${errorResponse.status} ${errorResponse.statusText})`
              );
            } else {
              this.throwError(
                `Cannot get tail logs: ${errorResponse.request.url} (${errorResponse.status} ${errorResponse.statusText})`
              );
            }
          }
          currentStart = currentStart + currentContentLength;
        }
      }
    }
  });
</script>

<style lang="scss" scoped>
  #log-scroll-area {
    height: 100%;
    max-height: 100%;
  }
  #log-content-area {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .bottom-right {
    position: fixed;
    bottom: 5px;
    right: 5px;
  }
</style>
