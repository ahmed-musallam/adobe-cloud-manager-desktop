<template>
  <div>
    <coral-banner variant="error" v-if="error">
      <coral-banner-header>Error</coral-banner-header>
      <coral-banner-content>{{ error }}</coral-banner-content>
    </coral-banner>
    <coral-actionbar>
      <coral-actionbar-primary threshold="-1" morebuttontext="More">
        <coral-actionbar-item>
          <input is="coral-textfield" placeholder="filter" @input="filter($event.target.value)" />
        </coral-actionbar-item>
      </coral-actionbar-primary>
      <coral-actionbar-secondary morebuttontext="More">
        <coral-actionbar-item>
          <button @click="scrollToBottom" is="coral-button" icon="arrowDown">Bottom</button>
        </coral-actionbar-item>
        <coral-actionbar-item>
          <button @click="clear" is="coral-button" icon="delete">Clear</button>
        </coral-actionbar-item>
        <coral-actionbar-item>
          <button @click="exit" is="coral-button" icon="closeCircle">Exit</button>
        </coral-actionbar-item>
        <coral-actionbar-item>
          <coral-wait size="M" v-if="loading && !error"></coral-wait>
        </coral-actionbar-item>
      </coral-actionbar-secondary>
    </coral-actionbar>
    <div
      ref="scrollArea"
      id="log-scroll-area"
      class="clusterize-scroll u-coral-padding"
      @scroll="handleScroll($event.target)"
    >
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
        error: "",
        rows: [] as string[],
        searchText: "",
        scrollToEnd: true
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
          contentId: "log-content-area",
          no_data_text: "Waiting for new data..."
        });
        this.$nextTick(() => this.scrollToBottom());
      }
    },
    methods: {
      exit() {
        electron.remote.getCurrentWindow().close();
      },
      handleScroll(element: HTMLElement) {
        console.log("SCROLLED: ", element);
        this.scrollToEnd = element.offsetHeight + element.scrollTop == element.scrollHeight;
      },
      clear() {
        this.rows = [];
        this.clusterize.clear();
      },
      scrollToBottom() {
        const scrollArea = this.$refs.scrollArea as HTMLElement;
        scrollArea.scrollTop = scrollArea.scrollHeight;
      },
      filter(text: string) {
        this.searchText = text;
        if (!text) {
          console.log("show All");
          console.log(this.rows);
          this.clusterize.update(this.rows);
        } else {
          console.log("before  ", this.rows);
          console.log("Filter: ", text);
          const filtered = this.rows.filter(this.shouldShowRow);
          console.log(filtered);
          this.clusterize.update(filtered);
        }
      },
      shouldShowRow(rowText: String): boolean {
        if (!this.searchText) {
          return true;
        } else {
          return rowText && rowText.includes(this.searchText);
        }
      },
      async getContentLength(url: string) {
        const client = await CloudManagerApi.getInstance();
        const resp = await client.logs.head(url);
        return parseInt(resp.headers["content-length"]);
      },
      async getLog(url: string, startLimit: number) {
        const client = await CloudManagerApi.getInstance();
        //console.log("getting log at: ", { startLimit });
        const res = await client.logs.get(url + `&date=${new Date().getTime()}`, {
          headers: {
            Range: "bytes=" + startLimit + "-"
          },
          cancelToken: this.signal.token
        });
        return res;
      },
      addToLog(data: string) {
        const newRows = data.split("\n").map(line => `<li>${line}<li>`);
        this.rows = this.rows.concat(newRows);
        this.clusterize.append(newRows.filter(this.shouldShowRow));
        if (this.scrollToEnd) {
          // scroll to the end of log
          this.scrollToBottom();
        }
      },
      throwError(msg: string) {
        this.loading = false;
        this.error = msg;
        throw new Error(msg);
      },
      async tail(url: string, initialStart?: number) {
        let currentStart = 0;
        if (initialStart) {
          currentStart = initialStart - 5000; // initial chunk
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
            currentContentLength = parseInt(logResponse.headers["content-length"]);
            this.addToLog(logResponse.data);
          } catch (error) {
            currentContentLength = 0;
            if (error?.constructor?.name === "Cancel") {
              console.log("CANCELLED!");
              return; // we cancelled the request!
            }
            const errorResponse = error?.response;
            const errorStatus = errorResponse?.status;
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
    height: calc(100% - 46px - 2px); // 46px is the action bar height
    max-height: 100%;
    margin-right: 3px;
    box-sizing: border-box;
    word-break: break-all;
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
  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
    padding: 5px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
</style>
