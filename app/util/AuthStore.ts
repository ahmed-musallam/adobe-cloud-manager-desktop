import Vue from "vue";

const CLIENT_SECRET = "clientSecret",
  API_KEY = "apiKey",
  TECH_ACCT = "techAcct",
  ORG_ID = "orgId",
  PRIVATE_KEY = "privateKey",
  ACCESS_TOKEN = "accessToken",
  KEYTAR_SERVICE = "adobe-cloud-manager-desktop";

interface KeytarCredintial {
  account: string;
  password: string;
}

export class Account {
  constructor(protected name: string) {}
  private getPassword(key: string) {
    return window.keytar.getPassword(KEYTAR_SERVICE, `${this.name}-${key}`);
  }
  private setPassword(key: string, val: string) {
    return window.keytar.setPassword(KEYTAR_SERVICE, `${this.name}-${key}`, val);
  }

  getName = () => this.name;
  // getters
  getClientSecret = () => this.getPassword(CLIENT_SECRET);
  getApiKey = () => this.getPassword(API_KEY);
  getTechAcct = () => this.getPassword(TECH_ACCT);
  getOrgId = () => this.getPassword(ORG_ID);
  getPrivateKey = () => this.getPassword(PRIVATE_KEY);
  getAccessToken = () => this.getPassword(ACCESS_TOKEN);
  // setters
  setClientSecret = (val: string) => this.setPassword(CLIENT_SECRET, val);
  setApiKey = (val: string) => this.setPassword(API_KEY, val);
  setTechAcct = (val: string) => this.setPassword(TECH_ACCT, val);
  setOrgId = (val: string) => this.setPassword(ORG_ID, val);
  setPrivateKey = (val: string) => this.setPassword(PRIVATE_KEY, val);
  setAccessToken = (val: string) => this.setPassword(ACCESS_TOKEN, val);
}

export class InMemoryAccount extends Account {
  slientSecret = "";
  apiKey = "";
  techAcct = "";
  orgId = "";
  privateKey = "";
  accessToken = "";

  getClientSecret = async () => this.slientSecret;
  getApiKey = async () => this.apiKey;
  getTechAcct = async () => this.techAcct;
  getOrgId = async () => this.orgId;
  getPrivateKey = async () => this.privateKey;
  getAccessToken = async () => this.accessToken;

  setClientSecret = async (slientSecret: string) => {
    this.slientSecret = slientSecret;
  };
  setApiKey = async (apiKey: string) => {
    this.apiKey = apiKey;
  };
  setTechAcct = async (techAcct: string) => {
    this.techAcct = techAcct;
  };
  setOrgId = async (orgId: string) => {
    this.orgId = orgId;
  };
  setPrivateKey = async (privateKey: string) => {
    this.privateKey = privateKey;
  };
  setAccessToken = async (accessToken: string) => {
    this.accessToken = accessToken;
  };
}

class DeletableAccount extends Account {
  private deletePassword(key: string) {
    return window.keytar.deletePassword(KEYTAR_SERVICE, `${this.name}-${key}`);
  }
  delete() {
    [CLIENT_SECRET, API_KEY, TECH_ACCT, ORG_ID, PRIVATE_KEY, ACCESS_TOKEN].forEach(
      this.deletePassword
    );
  }
}

export const currentAccountStore = Vue.observable({
  accountName: ""
});

export default class AuthStore {
  static async getAccount(account: string): Promise<Account> {
    if (!account) {
      return Promise.reject("Cannot get account with empty name")!;
    }
    const creds = await window.keytar.findCredentials(KEYTAR_SERVICE);
    const accountExists = creds?.some((cred: KeytarCredintial) =>
      cred?.account?.startsWith(account)
    );
    if (accountExists) {
      return new Account(account);
    } else {
      return Promise.reject("No Account found")!;
    }
  }

  private static getAccountFromKey(key: string): string | undefined {
    if (key?.indexOf("-") != -1) {
      return key.split("-")[0];
    } else return undefined;
  }

  static async getAccounts(excludeCurrent = false): Promise<Account[]> {
    const creds: KeytarCredintial[] = await window.keytar.findCredentials(KEYTAR_SERVICE);

    let accountNames = creds
      ?.map((o: KeytarCredintial) => AuthStore.getAccountFromKey(o.account))
      .filter(acc => !!acc);

    if (excludeCurrent) {
      const currentAccount = await this.getCurrentAccount();
      accountNames = accountNames.filter(acc => acc !== currentAccount?.getName());
    }

    const uniqueAccountNames = [...new Set(accountNames)];
    return uniqueAccountNames.map(acc => new Account(String(acc)));
  }

  static async getCurrentAccount(): Promise<Account | null> {
    let account: Account | null;
    try {
      account = await AuthStore.getAccount(currentAccountStore.accountName);
    } catch (e) {
      console.log("No current account set, setting first one we find");
      // no current account set, get the first one in the list
      const accounts = await AuthStore.getAccounts();
      if (accounts && accounts.length) {
        account = accounts[0];
        currentAccountStore.accountName = account.getName();
      } else {
        account = null;
      }
    }
    return account;
  }
  static newAccount(name: string) {
    return new Account(name);
  }
  static async deleteAccount(name: string) {
    const account = (await this.getAccount(name)) as DeletableAccount;
    account?.delete();
  }
}
