import VueRouter, { Route } from 'vue-router'
import CloudManagerApi, { CloudManagerApiInstance } from "./app/client/wrapper/CloudManagerApi";
import { AxiosResponse } from 'axios';
import Vue from 'vue';

// declare global variables
declare const electronStore: any;
declare const adobeAuth: any;
declare const keytar: any;
declare const electron: any;
declare const Clusterize: any;

declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module 'vue/types/vue' {
  interface Vue {
    $router: VueRouter
    on: FunctionStringCallback
    $showLoadingScreen: Function
    $hideLoadingScreen: Function
    $CloudManagerApi: Promise<CloudManagerApiInstance>
    $downloadFile: (url: string) => void
    $sleep: (msec: number) => Promise<any>,
    $openExternalLink: (link: string) => void
    $poll: <T> (
      fn: () => Promise<any>,
      onData: (data: T) => void) => void
  }
  interface CoralEvent extends Event {
    detail: {
      selection: HTMLElement
    };
    target: CoralElement
  }
  interface CoralElement extends HTMLElement {
    on(name: string, handler:(e: CoralEvent) => void): void,
    selectedItem: CoralElement
    value: string

  }
}
