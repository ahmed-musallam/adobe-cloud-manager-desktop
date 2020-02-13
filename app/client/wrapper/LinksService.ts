import { BaseService } from "./BaseService";
import { HalLink } from "../typescript-axios";
import globalAxios from "axios";
const UriTemplate = require("uritemplate");


interface TemplateParams {
  [key: string]: string;
}

/**
 * Service for requesting HalLinks that adobe did not document ¯\_(ツ)_/¯
 */
export default class LinksService extends BaseService<undefined> {
  getLink(link: HalLink, templateParams: TemplateParams) {
    let href = String(link?.href);
    if (link?.templated) {
      var template = UriTemplate.parse(href);
      href = template.expand(templateParams)
    }
    console.log("[LinksService] getting href: ", href)
    return globalAxios.get(String(href), {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        Authorization: this.authorization,
        "x-gw-ims-org-id": this.orgId
      }
    });
  }
}
