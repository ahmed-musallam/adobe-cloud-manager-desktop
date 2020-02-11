import { BaseService } from "./BaseService";
import { ProgramsApi } from "../typescript-axios";

export default class ProgramsService extends BaseService<ProgramsApi> {
  public getProgram(programId: string, options?: any) {
    return this.wrappedApi.getProgram(
      programId,
      this.orgId,
      this.authorization,
      this.apiKey,
      options
    );
  }

  public getPrograms(options?: any) {
    return this.wrappedApi.getPrograms(
      this.orgId,
      this.authorization,
      this.apiKey,
      options
    );
  }
}
