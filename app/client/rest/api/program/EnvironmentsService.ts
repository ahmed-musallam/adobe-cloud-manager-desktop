/* tslint:disable */

/**
 * This file was automatically generated by "Swaxios".
 * It should not be modified by hand.
 */

import {AxiosInstance, AxiosRequestConfig} from 'axios';
import {EnvironmentList} from '../../../interfaces';

export class EnvironmentsService {
  private readonly apiClient: AxiosInstance;

  constructor(apiClient: AxiosInstance) {
    this.apiClient = apiClient;
  }

  /**
   * @param programId Identifier of the program
   * @param type Type of the environment
   * @param x-gw-ims-org-id IMS organization ID that the request is being made under.
   * @param Authorization Bearer [token] - An access token for the technical account created through integration with Adobe IO
   * @param x-api-key IMS Client ID (API Key) which is subscribed to consume services on console.adobe.io
   */
  getEnvironments = async (
    programId: string,
    params?: {
      type?: string;
    }
  ): Promise<EnvironmentList> => {
    const config: AxiosRequestConfig = {
      method: 'get',
      params,
      url: `/api/program/${programId}/environments`,
    };
    const response = await this.apiClient.request<EnvironmentList>(config);
    return response.data;
  };
}
