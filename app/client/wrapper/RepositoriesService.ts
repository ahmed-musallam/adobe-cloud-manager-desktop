import { BaseService } from "./BaseService";
import { RepositoriesApi } from "../typescript-axios";

/**
 * RepositoriesApi - object-oriented interface
 * @export
 * @class RepositoriesApi
 * @extends {BaseAPI}
 */
export default class RepositoriesService extends BaseService<RepositoriesApi> {
  public getRepositories(programId: string, options?: any) {
    return this.wrappedApi.getRepositories(
      programId,
      this.orgId,
      this.authorization,
      this.apiKey,
      options
    );
  }

  public getRepository(programId: string, repositoryId: string, options?: any) {
    return this.wrappedApi.getRepository(
      programId,
      repositoryId,
      this.orgId,
      this.authorization,
      this.apiKey,
      options
    );
  }
}
