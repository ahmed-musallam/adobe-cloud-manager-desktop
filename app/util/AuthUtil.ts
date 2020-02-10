import AuthStore from "./AuthStore";

export default class AuthUtil {
  private constructor() {}

  static async getAccessToken (): Promise<string> {
    return adobeAuth({
      clientId: await AuthStore.getApiKey(),
      clientSecret: await AuthStore.getClientSecret(),
      privateKey: await AuthStore.getPrivateKey(),
      technicalAccountId: await AuthStore.getTechAcct(),
      orgId: await AuthStore.getOrgId(),
      metaScopes: ["https://ims-na1.adobelogin.com/s/ent_cloudmgr_sdk"]
    })
    .then((tokenResponse: { access_token: any; }) => tokenResponse.access_token);
  }
}
