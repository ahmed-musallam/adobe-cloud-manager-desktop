import { BranchesApi } from "../typescript-axios";
import { BaseService } from "./BaseService";

export default class BrachesService extends BaseService<BranchesApi> {
  getBranches(programId: string, repositoryId: string) {
    return this.wrappedApi.getBranches(
      programId,
      repositoryId,
      this.orgId,
      this.authorization,
      this.apiKey
    );
  }
}
