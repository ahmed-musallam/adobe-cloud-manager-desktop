<template>
  <coral-shell>
    <coral-shell-header>
      <coral-shell-header-content>
       <coral-shell-workspaces>
          <a is="coral-shell-workspace" href="#programs" selected="">Programs</a>
          <a is="coral-shell-workspace" href="#workspace2">Other things</a>
        </coral-shell-workspaces>
      </coral-shell-header-content>
      <coral-shell-header-actions>
      <coral-shell-menubar>
        <coral-shell-menubar-item menu="#menu_config" icon="gears"></coral-shell-menubar-item>
      </coral-shell-menubar>
    </coral-shell-header-actions>
    </coral-shell-header>
    <coral-shell-menu id="menu_config" class="u-coral-padding">
      <AuthForm></AuthForm>
    </coral-shell-menu>
    
    <coral-shell-content>
      <!-- Main application goes here -->
      <section class="u-coral-padding">
        <Program></Program>
      </section>
    </coral-shell-content>
  </coral-shell>
</template>

<script lang="ts">
import AuthForm from './components/AuthForm.vue'
import Program from './components/Program.vue'
import {APIClient} from './client'
import {AxiosRequestConfig} from 'axios'


export default {
  name: 'App',
  components: {
    AuthForm,
    Program
  },
  data() {
    return {
      message: 'test'
    };
  },
  methods: {}
};
</script>

<style scoped>

</style>