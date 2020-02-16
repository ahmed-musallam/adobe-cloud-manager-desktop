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
import LinksService from "./LinksService";
import LogsService from "./LogsService";

export interface CloudManagerApiInstance {
  branches: BrachesService;
  environments: EnvironmentsService;
  pipelineExecution: PipelineExecutionService;
  pipelines: PipelinesService;
  programs: ProgramsService;
  repositories: RepositoriesService;
  links: LinksService;
  logs: LogsService;
}
export default class CloudManagerApi {
  private static instance: CloudManagerApiInstance | undefined;
  private static interceptionSetup = false;
  static async getInstance(): Promise<CloudManagerApiInstance> {
    if (!CloudManagerApi.instance) {
      const authParams = await AuthParams.getDefault();
      CloudManagerApi.instance = {
        logs: new LogsService(authParams, undefined),
        links: new LinksService(authParams, undefined),
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
        deepRenameKeys(response, (key: string) => {
          // an unfortunate thing to do, really... the generated API interfaces
          // for links have properties like: http__ns_adobe_com_adobecloud_rel_program
          // but the actual response has properties like: http://ns.adobe.com/adobecloud/rel/program
          // so we do this so that the generated TS API works without having to mess with it.
          if (key && key.startsWith("http://ns.adobe.com")) {
            return key
              .replace("http://ns.adobe.com", "http__ns_adobe_com") // first part is strange, replace it on its own
              .replace(/\//g, "_"); // slash to underscore
          } else return key;
        }),
      async error => {
        if (401 === error?.response?.status) {
          console.log(
            "Got 401 with existing access token, attempting to get a new one"
          );
          try {
            const access_token = await AuthUtil.getAccessToken();
            (await AuthStore.getCurrentAccount()).setAccessToken(access_token);
            console.log(
              "Got the token!, saving it and retrying the same request."
            );
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
