import AuthUtil from "../../util/AuthUtil";
import AuthParams from "./AuthParams";
import {
  BranchesApi,
  EnvironmentsApi,
  PipelineExecutionApi,
  PipelinesApi,
  ProgramsApi,
  RepositoriesApi
} from "../typescript-axios";
import EnvironmentsService from "./EnvironmentsService";
import PipelineExecutionService from "./PipelineExecutionService";
import BrachesService from "./BrachesService";
import PipelinesService from "./PipelinesService";
import ProgramsService from "./ProgramsService";
import RepositoriesService from "./RepositoriesService";
import globalAxios from "axios";
import AuthStore from "../../util/AuthStore";
import Axios from "axios";
import deepRenameKeys from "deep-rename-keys";

export interface CloudManagerApiInstance {
  branches: BrachesService;
  environments: EnvironmentsService;
  pipelineExecution: PipelineExecutionService;
  pipelines: PipelinesService;
  programs: ProgramsService;
  repositories: RepositoriesService;
}
export default class CloudManagerApi {
  private static instance: CloudManagerApiInstance | undefined;
  private static interceptionSetup = false;
  static async getInstance(): Promise<CloudManagerApiInstance> {
    const authParams = await AuthParams.getDefault();
    if (!CloudManagerApi.instance) {
      CloudManagerApi.instance = {
        branches: new BrachesService(authParams, new BranchesApi()),
        environments: new EnvironmentsService(
          authParams,
          new EnvironmentsApi()
        ),
        pipelineExecution: new PipelineExecutionService(
          authParams,
          new PipelineExecutionApi()
        ),
        pipelines: new PipelinesService(authParams, new PipelinesApi()),
        programs: new ProgramsService(authParams, new ProgramsApi()),
        repositories: new RepositoriesService(authParams, new RepositoriesApi())
      };
      CloudManagerApi.setupRetryInterceptor();
    }
    return CloudManagerApi.instance;
  }

  static async refresh() {
    CloudManagerApi.instance = undefined;
  }

  static async setupRetryInterceptor() {
    if (CloudManagerApi.interceptionSetup) {
      return;
    }
    CloudManagerApi.interceptionSetup = true;

    // setup retry interceptor
    globalAxios.interceptors.response.use(
      response =>
        deepRenameKeys(response, (key: string) =>
          // an unfortunate thing to do, really... the generated API interfaces
          // have keys names "embedded" but the ACTUAL response retunrs keys "_embedded"
          // so we rename them here ¯\_(ツ)_/¯
          key === "_embedded" ? "embedded" : key 
        ),
      async error => {
        if (401 === error.response.status) {
          console.log(
            "Got 401 with existing access token, attempting to get a new one"
          );
          try {
            const access_token = await AuthUtil.getAccessToken();
            AuthStore.setAccessToken(access_token);
            console.log("Got the token!, saving it and retrying the same request.");
            CloudManagerApi.refresh();
            // just for this request, change auth
            error.config.headers["Authorization"] = "Bearer " + access_token;
            return Axios.request(error.config);
          } catch (err) {
            console.error(err);
          }
        } else {
          return Promise.reject(error);
        }
      }
    );
  }
}
