/* tslint:disable */

/**
 * This file was automatically generated by "Swaxios".
 * It should not be modified by hand.
 */

import { PipelineExecutionStepState } from "./PipelineExecutionStepState";
import { HalLink } from "./HalLink";

export interface PipelineExecution {
  id?: string;
  readonly programId?: string;
  readonly pipelineId?: string;
  artifactsVersion?: string;
  user?: string;
  status?: string;
  trigger?: string;
  createdAt?: string;
  updatedAt?: string;
  finishedAt?: string;
  readonly _embedded?: { stepStates?: Array<PipelineExecutionStepState> };
  readonly _links?: {
    http___ns_adobe_com_adobecloud_rel_program?: HalLink;
    http___ns_adobe_com_adobecloud_rel_pipeline?: HalLink;
    self?: HalLink;
  };
}
