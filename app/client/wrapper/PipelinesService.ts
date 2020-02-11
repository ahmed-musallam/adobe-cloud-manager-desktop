import { BaseService } from "./BaseService";
import { PipelinesApi, Pipeline } from "../typescript-axios";
export default class PipelinesService extends BaseService<PipelinesApi> {
  public deletePipeline(programId: string, pipelineId: string, options?: any) {
    return this.wrappedApi.deletePipeline(
      programId,
      pipelineId,
      this.orgId,
      this.authorization,
      this.apiKey,
      options
    );
  }

  public getPipeline(programId: string, pipelineId: string, options?: any) {
    return this.wrappedApi.getPipeline(
      programId,
      pipelineId,
      this.orgId,
      this.authorization,
      this.apiKey,
      options
    );
  }

  public getPipelines(programId: string, options?: any) {
    return this.wrappedApi.getPipelines(
      programId,
      this.orgId,
      this.authorization,
      this.apiKey,
      options
    );
  }

  public patchPipeline(
    programId: string,
    pipelineId: string,
    contentType: string,
    body: Pipeline,
    options?: any
  ) {
    return this.wrappedApi.patchPipeline(
      programId,
      pipelineId,
      this.orgId,
      this.authorization,
      this.apiKey,
      contentType,
      body,
      options
    );
  }
}
