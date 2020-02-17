<template>
  <coral-dialog id="authFormDialog" ref="authDialog" backdrop="static">
    <coral-dialog-header>
      {{ header }}
    </coral-dialog-header>
    <coral-dialog-content>
      <!-- Use of v-if here is neccessary as it destroys this form component based on the condition -->
      <AuthForm
        v-if="show"
        :mode="mode"
        :account="account"
        v-model="formAuthData"
      ></AuthForm>
    </coral-dialog-content>
    <coral-dialog-footer>
      <button @click="$emit('close')" is="coral-button" type="button">
        Close
      </button>
      <button
        v-if="mode === 'add'"
        @click="addNewAccount"
        is="coral-button"
        type="button"
      >
        Add
      </button>
    </coral-dialog-footer>
  </coral-dialog>
</template>

<script lang="ts">
  import Vue from "vue";
  import AuthForm, { AuthFormData } from "./AuthForm.vue";
  import AuthStore from "../util/AuthStore";
  export enum AuthFormDialogMode {
    EDIT = "edit",
    ADD = "add"
  }

  export default Vue.extend({
    name: "AuthFormDialog",
    props: {
      show: Boolean,
      mode: String,
      account: String
    },
    data() {
      return {
        formAuthData: {} as AuthFormData
      };
    },
    computed: {
      header() {
        switch (this.mode) {
          case AuthFormDialogMode.EDIT:
            return "Edit Account";
          case AuthFormDialogMode.ADD:
            return "Add New Account";
        }
      }
    },
    components: {
      AuthForm
    },
    methods: {
      async addNewAccount() {
        console.log("addNewAccount");
        const data = this.formAuthData as AuthFormData;
        console.log(data);
        const account = AuthStore.newAccount(String(data.name));
        console.log("new account: ", data.name);
        await account.setOrgId(String(data.orgId));
        await account.setPrivateKey(String(data.privateKey));
        await account.setClientSecret(String(data.clientSecret));
        await account.setApiKey(String(data.apiKey));
        await account.setTechAcct(String(data.techAcct));
        this.$emit("close");
      }
    },
    watch: {
      show: function(open) {
        console.log("show watch:", open);
        if (open) {
          this.$refs.authDialog.show();
        } else {
          this.$refs.authDialog.hide();
        }
      }
    }
  });
</script>

<style>
  #authFormDialog [coral-dialog-size] {
    width: 500px;
    padding: 20;
  }
  #authFormDialog coral-dialog-footer {
    padding-top: 10px;
  }
</style>
