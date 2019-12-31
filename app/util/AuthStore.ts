const CLIENT_SECRET = "clientSecret",
  API_KEY = "apiKey",
  TECH_ACCT = "techAcct",
  ORG_ID = "orgId",
  PRIVATE_KEY = "privateKey",
  ACCESS_TOKEN = "accessToken";

export default class AuthStore {
  static get = (key: string) => electronStore.get(key);
  static set = (key: string, val: string) => electronStore.set(key, val);

  static getClientSecret = () => AuthStore.get(CLIENT_SECRET);
  static getApiKey = () => AuthStore.get(API_KEY);
  static getTechAcct = () => AuthStore.get(TECH_ACCT);
  static getOrgId = () => AuthStore.get(ORG_ID);
  static getPrivateKey = () => AuthStore.get(PRIVATE_KEY);
  static getAccessToken = () => AuthStore.get(ACCESS_TOKEN);

  static setClientSecret = (val: string) => AuthStore.set(CLIENT_SECRET, val);
  static setApiKey = (val: string) => AuthStore.set(API_KEY, val);
  static setTechAcct = (val: string) => AuthStore.set(TECH_ACCT, val);
  static setOrgId = (val: string) => AuthStore.set(ORG_ID, val);
  static setPrivateKey = (val: string) => AuthStore.set(PRIVATE_KEY, val);
  static setAccessToken = (val: string) => AuthStore.set(ACCESS_TOKEN, val);
}
