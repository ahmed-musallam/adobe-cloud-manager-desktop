const workers: { [key: string]: Worker } = {};
import AuthParams from "../client/wrapper/AuthParams";
import { Pipeline } from "../client";
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
    return this.createWorker(function(e) {
      const notificationDetail: NotificationDetail = e.data;
      const pipeline = notificationDetail.pipeline;
      console.log("worker recieved: ", notificationDetail);
      fetch(
        `https://cloudmanager.adobe.io/api/program/${pipeline.programId}/pipeline/${pipeline.id}`,
        {
          headers: notificationDetail.authHeaders
        }
      )
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(err => console.error("got err: ", err));
    });
  }
  private static createWorker(fn: any) {
    var blob = new Blob(["self.onmessage = ", fn.toString()], { type: "text/javascript" });
    var url = URL.createObjectURL(blob);
    return new Worker(url);
  }
}
