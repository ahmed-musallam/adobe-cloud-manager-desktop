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
        <button @click="handleCall" is="coral-button" type="button">Get First Program</button>
        <textarea disabled="" is="coral-textarea" style="resize: vertical;width: 80vw">{{resp}}</textarea>
      </section>
    </coral-shell-content>
  </coral-shell>
</template>

<script lang="ts">
import AuthForm from './AuthForm.vue'
import {APIClient} from './client'
import {AxiosRequestConfig} from 'axios'


export default {
  name: 'App',
  components: {
    AuthForm
  },
  data() {
    return {
      message: 'test',
      resp: "initial"
    };
  },
  methods: {
    async handleCall() {
      // sampl client init.
      var conf = {
        headers: {
          'x-gw-ims-org-id': electronStore.get('orgId'),
          'x-api-key': electronStore.get('apiKey'),
          'Authorization': `Bearer ${electronStore.get('accessToken')}`
        }
      }
      var client = new APIClient(conf);
      const programsResp = await client.rest.api.programsService.getPrograms();
      const programId = programsResp._embedded.programs[0].id
      const resp = await client.rest.api.programService.getProgram(programId);
      this.resp = resp;
    }
  }
};
</script>

<style scoped>

</style>