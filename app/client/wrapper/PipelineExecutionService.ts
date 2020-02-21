import { PipelineExecutionApi } from "../typescript-axios";
import { BaseService } from "./BaseService";

export default class PipelineExecutionService extends BaseService<PipelineExecutionApi> {
  advancePipelineExecution(
    programId: string,
    pipelineId: string,
    executionId: string,
    phaseId: string,
    stepId: string,
    contentType: string,
    body: object,
    options?: any
  ) {
    return this.wrappedApi.advancePipelineExecution(
      programId,
      pipelineId,
      executionId,
      phaseId,
      stepId,
      this.orgId,
      this.authorization,
      this.apiKey,
      contentType,
      body,
      options
    );
  }
  cancelPipelineExecutionStep(
    programId: string,
    pipelineId: string,
    executionId: string,
    phaseId: string,
    stepId: string,
    contentType: string,
    body: object,
    options?: any
  ) {
    return this.wrappedApi.cancelPipelineExecutionStep(
      programId,
      pipelineId,
      executionId,
      phaseId,
      stepId,
      this.orgId,
      this.authorization,
      this.apiKey,
      contentType,
      body,
      options
    );
  }
  getCurrentExecution(programId: string, pipelineId: string, options?: any) {
    return this.wrappedApi.getCurrentExecution(
      programId,
      pipelineId,
      this.orgId,
      this.authorization,
      this.apiKey,
      options
    );
  }
  getExecution(programId: string, pipelineId: string, executionId: string, options?: any) {
    return this.wrappedApi.getExecution(
      programId,
      pipelineId,
      executionId,
      this.orgId,
      this.authorization,
      this.apiKey,
      options
    );
  }
  getExecutions(
    programId: string,
    pipelineId: string,
    start?: string,
    limit?: number,
    options?: any
  ) {
    return this.wrappedApi.getExecutions(
      programId,
      pipelineId,
      this.orgId,
      this.authorization,
      this.apiKey,
      start,
      limit,
      options
    );
  }
  getStepLogs(
    programId: string,
    pipelineId: string,
    executionId: string,
    phaseId: string,
    stepId: string,
    accept?: string,
    options?: any
  ) {
    return this.wrappedApi.getStepLogs(
      programId,
      pipelineId,
      executionId,
      phaseId,
      stepId,
      this.orgId,
      this.authorization,
      this.apiKey,
      accept,
      options
    );
  }
  startPipeline(programId: string, pipelineId: string, contentType: string, options?: any) {
    return this.wrappedApi.startPipeline(
      programId,
      pipelineId,
      this.orgId,
      this.authorization,
      this.apiKey,
      contentType,
      options
    );
  }
  stepMetric(
    programId: string,
    pipelineId: string,
    executionId: string,
    phaseId: string,
    stepId: string,
    options?: any
  ) {
    return this.wrappedApi.stepMetric(
      programId,
      pipelineId,
      executionId,
      phaseId,
      stepId,
      this.orgId,
      this.authorization,
      this.apiKey,
      options
    );
  }
  stepState(
    programId: string,
    pipelineId: string,
    executionId: string,
    phaseId: string,
    stepId: string,
    options?: any
  ) {
    return this.wrappedApi.stepState(
      programId,
      pipelineId,
      executionId,
      phaseId,
      stepId,
      this.orgId,
      this.authorization,
      this.apiKey,
      options
    );
  }
}
