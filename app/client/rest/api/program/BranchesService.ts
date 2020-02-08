/* tslint:disable */

/**
 * This file was automatically generated by "Swaxios".
 * It should not be modified by hand.
 */

import { AxiosInstance, AxiosRequestConfig } from "axios";
import { BranchList } from "../../../interfaces";

export class BranchesService {
  private readonly apiClient: AxiosInstance;

  constructor(apiClient: AxiosInstance) {
    this.apiClient = apiClient;
  }

  /**
   * @param programId Identifier of the program.
   * @param repositoryId Identifier of the repository
   * @param x-gw-ims-org-id IMS organization ID that the request is being made under.
   * @param Authorization Bearer [token] - An access token for the technical account created through integration with Adobe IO
   * @param x-api-key IMS Client ID (API Key) which is subscribed to consume services on console.adobe.io
   */
  getBranches = async (
    programId: string,
    repositoryId: string
  ): Promise<BranchList> => {
    const config: AxiosRequestConfig = {
      method: "get",
      url: `/api/program/${programId}/repository/${repositoryId}/branches`
    };
    const response = await this.apiClient.request<BranchList>(config);
    return response.data;
  };
}
