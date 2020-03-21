const workers: { [key: string]: Worker } = {};
import AuthParams from "../client/wrapper/AuthParams";
import {
  Pipeline,
  PipelineStatusEnum,
  PipelineExecution,
  PipelineExecutionStatusEnum
} from "../client";
import { NotificationMessage, NotificationMessageChange } from "./NotificationMessage";

export default class NotificationUtil {
  public static async startPipelineNotifications(pipeline: Pipeline) {
    const worker = new Worker("./PipelineNotification.worker.ts");

    const authParams = await AuthParams.getDefault();
    worker.onerror = function(ev: ErrorEvent) {
      new Notification("Pipeline Error!", {
        body: `${pipeline.name} sent error: ${ev.error}`
      });
    };
    worker.onmessage = function(ev: MessageEvent) {
      const message = ev.data as NotificationMessageChange;
      NotificationUtil.sendPipelineChangeNotification(message.pipeline, message.execution);
    };
    worker.postMessage(new NotificationMessage(pipeline, authParams));
    workers[String(pipeline.id)] = worker;
    let myNotification = new Notification("Perfect!", {
      body: `You'll be notified with any changes to pipeline: ${pipeline.name}`
    });
    return worker;
  }
  public static stopPipelineNotifications(pipelineId: string) {
    workers[pipelineId]?.terminate();
  }

  private static sendPipelineChangeNotification(pipeline: Pipeline, execution: PipelineExecution) {
    new Notification(`Pipleine ${String(execution.status)}`, {
      body: `${pipeline.name}`
    });
  }
}
