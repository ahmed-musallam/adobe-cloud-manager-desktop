import AuthStore from "./AuthStore";

export default class AuthUtil {
  private constructor() {}

  static async getAccessToken(): Promise<string> {
    const account = await AuthStore.getCurrentAccount();
    return adobeAuth({
      clientId: await account.getApiKey(),
      clientSecret: await account.getClientSecret(),
      privateKey: await account.getPrivateKey(),
      technicalAccountId: await account.getTechAcct(),
      orgId: await account.getOrgId(),
      metaScopes: ["https://ims-na1.adobelogin.com/s/ent_cloudmgr_sdk"]
    }).then(
      (tokenResponse: { access_token: any }) => tokenResponse.access_token
    );
  }
}
