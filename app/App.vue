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
        <h1>{{ message }}</h1>
        <h2>Watch this loader put in some searious work!</h2>
        <coral-progress indeterminate=""></coral-progress>
      </section>
    </coral-shell-content>
  </coral-shell>
</template>

<script>
import AuthForm from './AuthForm.vue'
const {app} = window.require("electron")


export default {
  name: 'App',
  components: {
    AuthForm
  },
  data() {
    return {
      message: 'test ${}',
    };
  },
};
</script>

<style scoped>

</style>