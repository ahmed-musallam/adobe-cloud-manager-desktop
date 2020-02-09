import VueRouter, { Route } from 'vue-router'

// declare global variables
declare const electronStore;
declare const adobeAuth;
declare const keytar;

declare module 'vue/types/vue' {
  interface Vue {
    $router: VueRouter
    on: FunctionStringCallback
    $showLoadingScreen: Function
    $hideLoadingScreen: Function
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
