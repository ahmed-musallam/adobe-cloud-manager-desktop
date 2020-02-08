import { APIClient } from "../client/APIClient";
import AuthStore from "./AuthStore";

export default class CMApiClient {
  private static instance: APIClient;

  private constructor() {}

  static async getInstance(): Promise<APIClient> {
    if (!CMApiClient.instance) {
      CMApiClient.instance = new APIClient({
        baseURL: "https://cloudmanager.adobe.io",
        headers: {
          "x-gw-ims-org-id": await AuthStore.getOrgId(),
          "x-api-key": await AuthStore.getApiKey(),
          Authorization: `Bearer ${await AuthStore.getAccessToken()}`
        }
      });
    }
    return CMApiClient.instance;
  }

  static async refresh(): Promise<APIClient> {
    CMApiClient.instance = null;
    return CMApiClient.getInstance();
  }
}
