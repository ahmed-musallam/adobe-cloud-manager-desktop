import { APIClient } from "../client/APIClient";
import AuthStore from "./AuthStore";

export default class CMApiClient {
  private static instance: APIClient;

  private constructor() {}

  static getInstance(): APIClient {
    if (!CMApiClient.instance) {
      CMApiClient.instance = new APIClient({
        baseURL: "https://cloudmanager.adobe.io",
        headers: {
          "x-gw-ims-org-id": AuthStore.getOrgId(),
          "x-api-key": AuthStore.getApiKey(),
          Authorization: `Bearer ${AuthStore.getAccessToken()}`
        }
      });
    }
    return CMApiClient.instance;
  }

  static refresh(): APIClient {
    CMApiClient.instance = null;
    return CMApiClient.getInstance();
  }
}
