import VueRouter, { Route } from 'vue-router'
import CloudManagerApi, { CloudManagerApiInstance } from "./app/client/wrapper/CloudManagerApi";

// declare global variables
declare const electronStore;
declare const adobeAuth;
declare const keytar;

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
  }
  interface CoralEvent extends Event {
    detail: {
      selection: HTMLElement
    };
  }
  interface CoralElement extends HTMLElement {
    on(name: string, handler:(e: CoralEvent) => void): void
  }
}
