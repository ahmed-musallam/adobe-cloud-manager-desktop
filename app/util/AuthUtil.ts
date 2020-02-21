import AuthStore, { Account } from "./AuthStore";

export default class AuthUtil {
  private constructor() {}

  static async getAccessToken(account?: Account): Promise<string> {
    let currentAccount: Account | null;
    if (account) {
      currentAccount = account;
    } else {
      currentAccount = await AuthStore.getCurrentAccount();
    }
    // @ts-ignore // wthis comes from preload.js, cannot import it here because
    //it has some FS depepndecies and cannot be actually bundled with the application from here
    return adobeAuth({
      clientId: await currentAccount?.getApiKey(),
      clientSecret: await currentAccount?.getClientSecret(),
      privateKey: await currentAccount?.getPrivateKey(),
      technicalAccountId: await currentAccount?.getTechAcct(),
      orgId: await currentAccount?.getOrgId(),
      metaScopes: ["https://ims-na1.adobelogin.com/s/ent_cloudmgr_sdk"]
    }).then((tokenResponse: { access_token: any }) => tokenResponse.access_token);
  }
}
