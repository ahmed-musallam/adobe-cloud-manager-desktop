// careful what you import here, this is a worker and it has limitied API access.
// for example, it cannot access `window`.
import { Pipeline, PipelineExecution, PipelineExecutionStatusEnum } from "../client";
import CloudManagerApi, { CloudManagerApiInstance } from "../client/wrapper/CloudManagerApi";
import AuthParams from "../client/wrapper/AuthParams";
import { NotificationMessage, NotificationMessageChange } from "./NotificationMessage";
import { ExecutionPollerBuilder } from "./ExecutionPoller";
const WAIT = 2000;
let currentPipelineExecutionStatus: PipelineExecutionStatusEnum;

let execution: PipelineExecution;
let authParams: AuthParams;
let client: CloudManagerApiInstance;

function handleExecutionStatusChange(execution: PipelineExecution) {
  if (currentPipelineExecutionStatus !== execution.status) {
    self.postMessage(new NotificationMessageChange({} as Pipeline, execution), []);
    currentPipelineExecutionStatus = execution.status as PipelineExecutionStatusEnum;
  }

  if (
    currentPipelineExecutionStatus !== PipelineExecutionStatusEnum.NOT_STARTED &&
    currentPipelineExecutionStatus !== PipelineExecutionStatusEnum.RUNNING &&
    currentPipelineExecutionStatus !== PipelineExecutionStatusEnum.CANCELLING
  ) {
    self.close(); // if this execution is not started, or not running, terminate
  }
}

async function handleMessage(e: MessageEvent) {
  const notificationMessage: NotificationMessage<PipelineExecution> = e.data;
  execution = notificationMessage.data as PipelineExecution;
  authParams = notificationMessage.authParams as AuthParams;
  if (!execution || !authParams) {
    console.error("Missing pipeline or authParams, terminating worker.");
    self.close();
  }
  client = await CloudManagerApi.newInstance(authParams);
  new ExecutionPollerBuilder()
    .setClient(client)
    .setTimeout(WAIT)
    .setExecution(execution)
    .setExecutionGetter(client =>
      client.pipelineExecution.getExecution(
        String(execution.programId),
        String(execution.pipelineId),
        String(execution.id)
      )
    )
    .onData(handleExecutionStatusChange)
    .onError(error => {
      self.close();
      throw new Error(error);
    })
    .build();
}

self.onmessage = async function(e: MessageEvent) {
  handleMessage(e);
};
