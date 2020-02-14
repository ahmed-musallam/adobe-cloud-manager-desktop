import { BaseService } from "./BaseService";
import { HalLink } from "../typescript-axios";
import globalAxios from "axios";
import { BASE_PATH } from "../typescript-axios/base";
const UriTemplate = require("uritemplate");

interface TemplateParams {
  [key: string]: string;
}

/**
 * Service for requesting HalLinks that adobe did not document ¯\_(ツ)_/¯
 */
export default class LinksService extends BaseService<undefined> {
  getLink(
    link: HalLink,
    templateParams?: TemplateParams,
    linkTransformer?: (link: string) => string,
    isAbsolute?: boolean
  ) {
    let href = String(link?.href);
    if (linkTransformer) {
      const temp = linkTransformer(href);
      href = temp ? temp : href;
    }
    if (link?.templated) {
      var template = UriTemplate.parse(href);
      href = template.expand(templateParams);
    }
    href = isAbsolute ? href : BASE_PATH + String(href);
    return globalAxios.get(href, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        Authorization: this.authorization,
        "x-gw-ims-org-id": this.orgId
      }
    });
  }
}
