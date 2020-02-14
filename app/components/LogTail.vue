<template>
  <div style="overflow-x:scroll">
    <span v-for="(chunk, i) in dataChunks" :key="i">{{ chunk }}</span>
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

  export default Vue.extend({
    name: "Status",
    data() {
      return {
        tailPromise: new Promise(resolve => ""),
        signal: globalAxios.CancelToken.source(),
        dataChunks: [] as string[]
      };
    },
    async created() {
      const url = this.$route.query.url;
      if (url) {
        let contentLength = await this.getContentLength(String(url));
        //console.log(`initial content length: ${contentLength}`);
        this.tailPromise = this.tail(String(url), contentLength);
      }
    },
    beforeRouteLeave(to, from, next) {
      this.signal.cancel("Cancelling Tailing");
      next();
    },
    methods: {
      async getContentLength(url: string) {
        const resp = await globalAxios.head(url);
        return parseInt(resp.headers["content-length"]);
      },
      async getLog(url: string, startLimit: number) {
        //console.log("getting log at: ", { startLimit });
        const res = await globalAxios.get(url, {
          headers: {
            Range: "bytes=" + startLimit + "-"
          },
          cancelToken: this.signal.token
        });
        return res;
      },
      addToLog(data: string) {
        this.dataChunks.push(data);
      },
      async tail(url: string, initialStart?: number) {
        let currentStart = 0;
        if (initialStart) {
          currentStart = initialStart - 500;
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
              throw new Error(
                `Logs not found! ${errorResponse.request.url} (${errorResponse.status} ${errorResponse.statusText})`
              );
            } else {
              throw new Error(
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

<style lang="scss"></style>
