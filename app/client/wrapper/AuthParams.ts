import AuthStore from "../../util/AuthStore";
export default class AuthParams {
  public orgId: string;
  public authorization: string;
  public apiKey: string;
  constructor(orgId: string, accessToken: string, apiKey: string) {
    this.orgId = orgId;
    this.authorization = `Bearer ${accessToken}`;
    this.apiKey = apiKey;
  }
  static async getDefault() {
    const account = await AuthStore.getCurrentAccount();
    return new AuthParams(
      await account.getOrgId(),
      await account.getAccessToken(),
      await account.getApiKey()
    );
  }
}
