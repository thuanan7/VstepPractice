import { getWebsiteSchemaByWebsiteId } from "./website.service";
import { TypeWebsite } from "../models/website.model";
import connection from "../db/connection";
import { ccfddlCrawlService } from "./special-crawl.service";
import { normalCrawlService } from "./normal-crawl.service";
import { getTimeCrawl } from "../utils/dbUtils";
import { convertToTimeUTC0 } from "../utils/dateUtils";
import { dataSpecialWebsite } from "../app/configs";
import NormalSchema from "../builds/normalSchema";
import { QueryTypes } from "sequelize";
import logger from "../app/logger";

export async function crawlConferencesByWebsiteId(id: string) {
  const currentTime = convertToTimeUTC0();
  const website = await getWebsiteSchemaByWebsiteId(id);
  const schemas = website?.WebsiteSchemas || [];
  if (website && schemas.length > 0) {
    if (website.type === TypeWebsite.Normal) {
      const sch = new NormalSchema(schemas).schema;
      void normalCrawlService(website.url, website.id, sch);
    }
    if (website.type === TypeWebsite.Special) {
      if (Object.hasOwnProperty.call(website, "WebsiteSchemas")) {
        const valueKeySchema =
          (website as any)["WebsiteSchemas"][0].value || "";
        if (valueKeySchema === dataSpecialWebsite.ccfddl) {
          void ccfddlCrawlService(website.url, website.id, currentTime);
        }else {
          logger.error('[Crawler-Special]: Not implement function for crawl website -' + website.url);
        }
      }
    }
    const [currentTimeAsMs, adjustedTimeAsMs] = getTimeCrawl(website.timeCrawl);
    await website.update({
      lastCrawl: currentTimeAsMs,
      nextCrawl: adjustedTimeAsMs,
    });
    return website.name;
  } else {
    return website?.name || "unknown";
  }
}

export async function getAllWebsiteWillCrawl(date: number) {
  const query = `Select w.id from Websites w where w.isDeleted = 0 AND w.timeCrawl > 0 AND (w.nextCrawl IS NULL OR w.nextCrawl <= ${date})`;
  const websites: { id: number }[] = await connection.query(query, {
    type: QueryTypes.SELECT,
  });
  return websites.map((x) => x.id);
}
