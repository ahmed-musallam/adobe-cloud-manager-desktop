<template>
  <coral-dialog id="authFormDialog" ref="authDialog" backdrop="static">
    <coral-dialog-header>
      {{ header }}
    </coral-dialog-header>
    <coral-dialog-content>
      <!-- Use of v-if here is neccessary as it destroys this form component based on the condition -->
      <AuthForm v-if="show" :mode="mode" :account="account" v-model="formAuthData"></AuthForm>
    </coral-dialog-content>
    <coral-dialog-footer>
      <button v-if="mode === 'add'" @click="addNewAccount" is="coral-button" type="button">
        Add
      </button>
      <button v-if="mode === 'edit'" @click="saveAccount" is="coral-button" type="button">
        Save
      </button>
      <button @click="$emit('close')" is="coral-button" type="button">
        Close
      </button>
    </coral-dialog-footer>
  </coral-dialog>
</template>

<script lang="ts">
  import Vue from "vue";
  import AuthForm, { AuthFormData } from "./AuthForm.vue";
  import AuthStore, { Account } from "../util/AuthStore";
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
      async asyncSaveAuthDataToAccount(account: Account) {
        const formAuthData = this.formAuthData;
        await account.setOrgId(String(this.formAuthData.orgId));
        await account.setPrivateKey(String(this.formAuthData.privateKey));
        await account.setClientSecret(String(this.formAuthData.clientSecret));
        await account.setApiKey(String(this.formAuthData.apiKey));
        await account.setTechAcct(String(this.formAuthData.techAcct));
        await account.setAccessToken("empty"); // clear access token to force app to retrieve a new one.
      },
      async saveAccount() {
        const account = await AuthStore.getAccount(this.account);
        await this.asyncSaveAuthDataToAccount(account);
        this.$emit("close");
        this.$emit("save");
      },
      async addNewAccount() {
        const data = this.formAuthData as AuthFormData;
        const account = AuthStore.newAccount(String(data.name));
        await this.asyncSaveAuthDataToAccount(account);
        this.$emit("close");
        this.$emit("add", this.formAuthData.name);
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
