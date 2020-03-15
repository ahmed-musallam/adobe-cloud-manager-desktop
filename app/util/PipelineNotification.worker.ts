// careful what you import here, this is a worker and it has limitied API access.
// for example, it cannot access `window`.
import { Pipeline, PipelineExecution, PipelineExecutionStatusEnum } from "../client";
import CloudManagerApi, { CloudManagerApiInstance } from "../client/wrapper/CloudManagerApi";
import AuthParams from "../client/wrapper/AuthParams";
import { NotificationMessage, NotificationMessageChange } from "./NotificationMessage";

const ctx: Worker = self as any;
const WAIT = 10000;
let currentPipelineExecutionStatus: PipelineExecutionStatusEnum;

let pipeline: Pipeline;
let authParams: AuthParams;
let client: CloudManagerApiInstance;

async function handleMessage(e: MessageEvent) {
  const notificationMessage: NotificationMessage = e.data;
  pipeline = notificationMessage.pipeline as Pipeline;
  authParams = notificationMessage.authParams as AuthParams;
  if (!pipeline || !authParams) {
    console.error("Missing pipeline or authParams, terminating worker.");
    ctx.terminate();
  }
  client = await CloudManagerApi.newInstance(authParams);
  poll();
}

function handlePipelineStatusChange(execution: PipelineExecution) {
  if (currentPipelineExecutionStatus !== execution.status) {
    ctx.postMessage(new NotificationMessageChange(pipeline, execution));
    currentPipelineExecutionStatus = execution.status as PipelineExecutionStatusEnum;
  }
}

async function poll() {
  for (;;) {
    let stopPolling = false;
    let response: any;
    try {
      response = await client.pipelineExecution.getCurrentExecution(
        String(pipeline.programId),
        String(pipeline.id)
      );
      const data = response.data;
      handlePipelineStatusChange(data);
    } catch (e) {
      var shouldError = false;
      const response = e.response;
      if (response) {
        switch (response.status) {
          case 404: // No pipeline execution exits or unknown pipeline or program
          case 409: // The resource was modified before the call. Client should reload and try again
          case 503: // This is an indicator of a potential server overload.
          case 504: // This is an indicator that the back-end service did not complete a response within an allowed time period.
            break; // do nothing, continue polling
          default:
            // an unknown error.
            shouldError = true;
            break;
        }
      } else {
        shouldError = true;
      }

      if (shouldError) {
        stopPolling = true; // stop polling
        const status = response?.status || "UNKNOWN";
        const error = `${status} Error while fetching Pipeline: ${pipeline?.id}. ${response?.statusText}`;
        console.error(error, e);
        throw new Error(error);
      }
    }

    if (stopPolling) {
      break; // break the poll for loop.
    }

    console.log(`wait ${WAIT / 1000} seconds before next call.`);
    const sleep = await new Promise(r => setTimeout(r, WAIT));
  }
}
ctx.onmessage = async function(e) {
  handleMessage(e);
};
