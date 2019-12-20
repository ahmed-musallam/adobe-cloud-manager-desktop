<template>
  <coral-shell>
    <coral-shell-header>
      <coral-shell-header-content>
       <coral-shell-workspaces ref="workspaces">
          <a v-for="program in programs" :key="program.id" :href="'/program/' + program.id" is="coral-shell-workspace">{{program.name}}</a>
        </coral-shell-workspaces>
      </coral-shell-header-content>
      <coral-shell-header-actions>
      <coral-shell-menubar>
        <coral-shell-menubar-item menu="#menu_config" icon="gears"></coral-shell-menubar-item>
      </coral-shell-menubar>
    </coral-shell-header-actions>
    </coral-shell-header>
    <coral-shell-menu id="menu_config" class="u-coral-padding-horizontal">
      <AuthForm></AuthForm>
    </coral-shell-menu>
    
    <coral-shell-content>
      <!-- Main application goes here -->
      <section class="u-coral-padding">
        <router-view></router-view>
      </section>
    </coral-shell-content>
  </coral-shell>
</template>

<script lang="ts">
import AuthForm from './components/AuthForm.vue'
import {APIClient} from './client'
import {AxiosRequestConfig} from 'axios'
import CMApiClient from './util/CMApiClient'


export default {
  name: 'App',
  components: {
    AuthForm
  },
  data() {
    return {
      programs: []
    };
  },
  mounted () {
    // handle program change
    this.$refs.workspaces.on('coral-shell-workspaces:change', (e) => {
      console.log("going to: " + e.detail.selection.getAttribute("href"))
      this.$router.push(e.detail.selection.getAttribute("href"))
    })
  },
  async beforeCreate () {
    var client = CMApiClient.getInstance();
    try {
      var result= await client.rest.api.programsService.getPrograms();
      this.programs = result._embedded.programs;
    } catch (err) {
      console.error(err);
    }
  },
  methods: {

  }
};
</script>

<style scoped>

</style>