import AuthStore from "../../util/AuthStore";
import AuthUtil from "../../util/AuthUtil";
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
    return new AuthParams(
      await AuthStore.getOrgId(),
      await AuthStore.getAccessToken(),
      await AuthStore.getApiKey()
    );
  }
}
