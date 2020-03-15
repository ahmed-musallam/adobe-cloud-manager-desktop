import { Pipeline, PipelineExecution } from "../client";
import AuthParams from "../client/wrapper/AuthParams";

export class NotificationMessage {
  constructor(public pipeline: Pipeline, public authParams: AuthParams) {}
}

export class NotificationMessageChange {
  constructor(public pipeline: Pipeline, public execution: PipelineExecution) {}
}
