const workers: { [key: string]: Worker } = {};
import AuthParams from "../client/wrapper/AuthParams";
import { Pipeline, PipelineStatusEnum } from "../client";
class NotificationDetail {
  constructor(public pipeline: Pipeline, public authHeaders: Headers) {}
}

export default class PipelineNotification {
  public static async startPipelineNotifications(pipeline: Pipeline) {
    const worker = this.createNotificationWorker();
    const authParams = await AuthParams.getDefault();
    worker.postMessage(new NotificationDetail(pipeline, authParams.asHeadersObject()));
    workers[String(pipeline.id)] = worker;
    return worker;
  }
  public static stopPipelineNotifications(pipelineId: string) {
    workers[pipelineId]?.terminate();
  }
  private static createNotificationWorker() {
    // code must all be here since this function is stringified and run as a webworker.
    return this.createWorker(function(e) {
      const notificationDetail: NotificationDetail = e.data;
      const pipeline = notificationDetail.pipeline;
      async function getPipeline() {
        return fetch(
          `https://cloudmanager.adobe.io/api/program/${pipeline.programId}/pipeline/${pipeline.id}`,
          { headers: notificationDetail.authHeaders }
        );
      }
      //console.log("worker recieved: ", notificationDetail);
      async function poll() {
        for (;;) {
          let response = await getPipeline();
          if (response.status != 200) {
            const err = `${response.status} Error while fetching Pipeline: ${pipeline?.id}. ${response.statusText}`;
            console.error(err);
            postMessage(err);
            break; //exit
          } else {
            let jsonResponse = await response.json();
            console.log("got response: ", jsonResponse);
          }
        }
      }
      poll();
    });
  }
  private static createWorker(fn: any) {
    var blob = new Blob(["self.onmessage = ", fn.toString()], { type: "text/javascript" });
    var url = URL.createObjectURL(blob);
    return new Worker(url);
  }
}
