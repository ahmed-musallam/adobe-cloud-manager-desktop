import { Pipeline, PipelineExecution } from "../client";
import AuthParams from "../client/wrapper/AuthParams";

export class NotificationMessage<T> {
  constructor(public data: T, public authParams: AuthParams) {}
}

export class NotificationMessageChange {
  constructor(public pipeline: Pipeline, public execution: PipelineExecution) {}
}
