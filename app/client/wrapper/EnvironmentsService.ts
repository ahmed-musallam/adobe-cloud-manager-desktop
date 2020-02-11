import { BaseService } from "./BaseService";
import { EnvironmentsApi } from "../typescript-axios";
export default class EnvironmentsService extends BaseService<EnvironmentsApi> {
  getEnvironment(programId: string, environmentId: string) {
    return this.wrappedApi.getEnvironment(
      programId,
      environmentId,
      this.orgId,
      this.authorization,
      this.apiKey
    );
  }
  getEnvironments(programId: string) {
    return this.wrappedApi.getEnvironments(
      programId,
      this.orgId,
      this.authorization,
      this.apiKey
    );
  }
}
