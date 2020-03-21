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
  public static async startPipelineNotifications(pipeline: Pipeline, silent?: boolean) {
    if (workers[String(pipeline.id)]) {
      return; // exists
    }
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
    if (!silent) {
      let myNotification = new Notification("Perfect!", {
        body: `You'll be notified with any changes to pipeline: ${pipeline.name}`
      });
    }
    NotificationUtil.setWatchingPipeline(String(pipeline.id), true);
    return worker;
  }

  public static stopPipelineNotifications(pipeline: Pipeline, silent?: boolean) {
    const pipelineId = String(pipeline.id);
    workers[pipelineId]?.terminate();
    NotificationUtil.setWatchingPipeline(pipelineId, false);
    if (!silent) {
      let myNotification = new Notification("Noted!", {
        body: `You'll no longer be notified with any changes to pipeline: ${pipeline.name}`
      });
    }
  }

  private static sendPipelineChangeNotification(pipeline: Pipeline, execution: PipelineExecution) {
    new Notification(`Pipleine ${String(execution.status)}`, {
      body: `${pipeline.name}`
    });
  }

  public static isWatchingPipeline(pipelineId: string) {
    if (!pipelineId) {
      console.error("Cannot get watch-pipeline value of undefined ID");
    }
    const watchedPipelines = electronStore.get(`watched-pipelines`, []);
    const watchedPipelinesSet = new Set(watchedPipelines);
    return watchedPipelinesSet.has(pipelineId);
  }

  private static setWatchingPipeline(pipelineId: string, watching: boolean) {
    if (!pipelineId) {
      console.error("Cannot set watch-pipeline value of undefined ID");
    } else {
      const watchedPipelines = electronStore.get(`watched-pipelines`, []);
      const watchedPipelinesSet = new Set(watchedPipelines);
      if (watching) {
        watchedPipelinesSet.add(pipelineId);
      } else {
        watchedPipelinesSet.delete(pipelineId);
      }
      electronStore.set(`watched-pipelines`, [...watchedPipelinesSet]);
    }
  }
}
