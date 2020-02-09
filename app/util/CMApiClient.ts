import { APIClient } from "../client/APIClient";
import AuthStore from "./AuthStore";
import Axios from "axios";

export default class CMApiClient {
  private static instance: APIClient | undefined;

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

  static async getInstance (): Promise<APIClient> {
    if (!CMApiClient.instance) {
      CMApiClient.instance = new APIClient({
        baseURL: "https://cloudmanager.adobe.io",
        headers: {
          "x-gw-ims-org-id": await AuthStore.getOrgId(),
          "x-api-key": await AuthStore.getApiKey(),
          Authorization: `Bearer ${await AuthStore.getAccessToken()}`
        }
      });
      // handle 401, try to get the token again
      CMApiClient.instance.interceptors.response.use(
        response => response,
        async error => {
        if (401 === error.response.status) {
          try {
            const access_token = await CMApiClient.getAccessToken()
            AuthStore.setAccessToken(access_token);
            CMApiClient.refresh();
            error.config.headers['Authorization'] = 'Bearer ' + access_token;
            return Axios.request(error.config)
          } catch (err) {
            console.error(err)
          }
        } else {
          return Promise.reject(error);
        }
    });
    }
    return CMApiClient.instance;
  }

  static async refresh(): Promise<APIClient> {
    CMApiClient.instance = undefined;
    return CMApiClient.getInstance();
  }
}
