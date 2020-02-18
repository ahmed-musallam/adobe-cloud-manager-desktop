import AuthStore from "../../util/AuthStore";
export default class AuthParams {
  public orgId: string | undefined;
  public authorization: string | undefined;
  public apiKey: string | undefined;
  constructor(orgId?: string, accessToken?: string, apiKey?: string) {
    this.orgId = orgId;
    this.authorization = `Bearer ${accessToken}`;
    this.apiKey = apiKey;
  }
  static async getDefault(): Promise<AuthParams> {
    const account = await AuthStore.getCurrentAccount();
    if (account) {
      return new AuthParams(
        String(await account.getOrgId()),
        String(await account.getAccessToken()),
        String(await account.getApiKey())
      );
    } else {
      return new AuthParams();
    }
  }
}
