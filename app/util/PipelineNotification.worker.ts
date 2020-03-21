// careful what you import here, this is a worker and it has limitied API access.
// for example, it cannot access `window`.
import { Pipeline, PipelineExecution } from "../client";
import CloudManagerApi, { CloudManagerApiInstance } from "../client/wrapper/CloudManagerApi";
import AuthParams from "../client/wrapper/AuthParams";
import { NotificationMessage, NotificationMessageChange } from "./NotificationMessage";
import { ExecutionPollerBuilder } from "./ExecutionPoller";

const WAIT = 5 * 1000; // 5 seconds
let currentExecutionId: string;

let pipeline: Pipeline;
let authParams: AuthParams;
let client: CloudManagerApiInstance;

function handleNewExecution(execution: PipelineExecution) {
  if (execution && currentExecutionId !== execution.id) {
    // new execution

    const worker = new Worker("./ExecutionNotification.worker.ts");
    worker.onerror = function(ev: ErrorEvent) {
      new Notification("Pipeline Error!", {
        body: `${pipeline.name} sent error: ${ev.error}`
      });
      worker.terminate();
    };
    worker.onmessage = function(ev: MessageEvent) {
      const message = ev.data as NotificationMessageChange;
      self.postMessage(new NotificationMessageChange(pipeline, message.execution));
    };

    worker.postMessage(new NotificationMessage(execution, authParams));
    currentExecutionId = String(execution.id);
  } else {
    console.log("still the same execution noting changed...");
  }
}

async function handleMessage(e: MessageEvent) {
  const notificationMessage: NotificationMessage<Pipeline> = e.data;
  pipeline = notificationMessage.data as Pipeline;
  authParams = notificationMessage.authParams as AuthParams;
  if (!pipeline || !authParams) {
    console.error("Missing pipeline or authParams, terminating worker.");
    self.close();
  }
  client = await CloudManagerApi.newInstance(authParams);

  client = await CloudManagerApi.newInstance(authParams);
  new ExecutionPollerBuilder()
    .setClient(client)
    .setTimeout(WAIT)
    .setExecution({} as PipelineExecution)
    .setExecutionGetter(client =>
      client.pipelineExecution.getCurrentExecution(String(pipeline.programId), String(pipeline.id))
    )
    .onData(handleNewExecution)
    .onError(error => {
      console.error(error, e);
      throw new Error(error);
    })
    .build();
}
self.onmessage = async function(e: MessageEvent) {
  handleMessage(e);
};
