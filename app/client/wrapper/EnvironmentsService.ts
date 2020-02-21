import { BaseService } from "./BaseService";
import { EnvironmentsApi } from "../typescript-axios";
export default class EnvironmentsService extends BaseService<EnvironmentsApi> {
  getEnvironment(programId: string, environmentId: string, options?: any) {
    return this.wrappedApi.getEnvironment(
      programId,
      environmentId,
      this.orgId,
      this.authorization,
      this.apiKey,
      options
    );
  }
  getEnvironments(programId: string, options?: any) {
    return this.wrappedApi.getEnvironments(
      programId,
      this.orgId,
      this.authorization,
      this.apiKey,
      options
    );
  }
  getEnvironmentLogs(
    programId: string,
    environmentId: string,
    days: number,
    service?: string[],
    name?: string[],
    options?: any
  ) {
    return this.wrappedApi.getEnvironmentLogs(
      programId,
      environmentId,
      days,
      this.orgId,
      this.authorization,
      this.apiKey,
      service,
      name
    );
  }
  downloadLogs(
    programId: string,
    environmentId: string,
    service: string,
    name: string,
    date: string,
    Accept?: string,
    options?: any
  ) {
    return this.wrappedApi.downloadLogs(
      programId,
      environmentId,
      service,
      name,
      date,
      this.orgId,
      this.authorization,
      this.apiKey,
      Accept,
      options
    );
  }
}
