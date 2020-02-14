import { BaseService } from "./BaseService";
import { HalLink } from "../typescript-axios";
import globalAxios from "axios";
import { BASE_PATH } from "../typescript-axios/base";
const UriTemplate = require("uritemplate");

interface TemplateParams {
  [key: string]: string;
}

export default class LogsService extends BaseService<undefined> {
  private getHeaders() {
    return {
      // "x-api-key": this.apiKey,
      // Authorization: this.authorization,
      // "x-gw-ims-org-id": this.orgId
    };
  }
  async head(url: string, options?: any) {
    return globalAxios.head(
      url,
      Object.assign(
        {
          headers: this.getHeaders()
        },
        options
      )
    );
  }
  async get(url: string, options?: any) {
    return globalAxios.get(
      url,
      Object.assign(
        {
          headers: this.getHeaders()
        },
        options
      )
    );
  }
}
