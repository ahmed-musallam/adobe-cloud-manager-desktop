import {
  EnvironmentsApi,
  BranchesApi,
  PipelineExecutionApi,
  PipelinesApi,
  ProgramsApi,
  RepositoriesApi
} from "../typescript-axios";
import AuthParams from "./AuthParams";

type AnyAPI =
  | EnvironmentsApi
  | BranchesApi
  | PipelineExecutionApi
  | PipelinesApi
  | ProgramsApi
  | RepositoriesApi;
export class BaseService<T extends AnyAPI> {
  protected orgId: string;
  protected authorization: string;
  protected apiKey: string;
  constructor(authParams: AuthParams, protected wrappedApi: T) {
    this.orgId = authParams.orgId;
    this.authorization = authParams.authorization;
    this.apiKey = authParams.apiKey;
  }
}
