import { PipelineExecution, CloudManagerApiInstance } from "../client";
import { AxiosPromise } from "axios";

type ExecutionFunction = (
  cloudManager: CloudManagerApiInstance
) => AxiosPromise<PipelineExecution> | any;
type OnDataFunction = (execution: PipelineExecution) => void;
type OnErrorFunction = (error: any) => void;

export class ExecutionPollerBuilder {
  private client: CloudManagerApiInstance = {} as CloudManagerApiInstance;
  private timeout: number = 5000;
  private _onData: OnDataFunction = data => console.log(data);
  private _onError: OnErrorFunction = data => console.error(data);
  private execution: PipelineExecution = {} as PipelineExecution;
  private executionGetter: ExecutionFunction = console.error;

  constructor() {}

  setClient(client: CloudManagerApiInstance) {
    this.client = client;
    return this;
  }

  setTimeout(timeout: number = 5000) {
    this.timeout = timeout;
    return this;
  }

  onData(_onData: OnDataFunction) {
    this._onData = _onData;
    return this;
  }

  onError(_onError: OnErrorFunction) {
    this._onError = _onError;
    return this;
  }

  setExecutionGetter(executionGetter: ExecutionFunction) {
    this.executionGetter = executionGetter;
    return this;
  }
  setExecution(execution: PipelineExecution) {
    this.execution = execution;
    return this;
  }

  build() {
    return new ExecutionPoller(
      this.timeout,
      this.client,
      this.execution,
      this.executionGetter,
      this._onData,
      this._onError
    );
  }
}

class ExecutionPoller {
  constructor(
    private timeout = 5000,
    private client: CloudManagerApiInstance,
    private execution: PipelineExecution,
    private executionFunction: ExecutionFunction,
    private onData: OnDataFunction,
    private onError: OnErrorFunction
  ) {
    this.poll();
  }
  async poll() {
    for (;;) {
      let stopPolling = false;
      let response: any;
      try {
        response = await this.executionFunction(this.client);
        this.onData(response.data);
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
          const error = `${status} Error while fetching Execution: ${this.execution?.id} for Pipeline ${this.execution.pipelineId}. ${response?.statusText}`;
          //console.error(error, e);
          self.close();
          this.onError(error);
        }
      }

      if (stopPolling) {
        break; // break the poll for loop.
      }

      console.debug(`wait ${this.timeout / 1000} seconds before next call.`);
      const sleep = await new Promise(r => setTimeout(r, this.timeout));
    }
  }
}
