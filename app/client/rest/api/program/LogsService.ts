/* tslint:disable */

/**
 * This file was automatically generated by "Swaxios".
 * It should not be modified by hand.
 */

import { AxiosInstance, AxiosRequestConfig } from "axios";

export class LogsService {
  private readonly apiClient: AxiosInstance;

  constructor(apiClient: AxiosInstance) {
    this.apiClient = apiClient;
  }

  /**
   * @param programId Identifier of the program.
   * @param pipelineId Identifier of the pipeline
   * @param executionId Identifier of the execution
   * @param phaseId Identifier of the phase
   * @param stepId Identifier of the step
   * @param Accept Specify application/json in this header to receive a JSON response. Otherwise, a 307 response code will be returned with a Location header.
   * @param x-gw-ims-org-id IMS organization ID that the request is being made under.
   * @param Authorization Bearer [token] - An access token for the technical account created through integration with Adobe IO
   * @param x-api-key IMS Client ID (API Key) which is subscribed to consume services on console.adobe.io
   */
  getStepLogs = async (
    programId: string,
    pipelineId: string,
    executionId: string,
    phaseId: string,
    stepId: string
  ): Promise<void> => {
    const config: AxiosRequestConfig = {
      method: "get",
      url: `/api/program/${programId}/pipeline/${pipelineId}/execution/${executionId}/phase/${phaseId}/step/${stepId}/logs`
    };
    await this.apiClient.request(config);
  };
}
