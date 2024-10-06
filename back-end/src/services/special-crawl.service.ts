import {fetchDataFromYamlCcfddl} from './sub-services/ccfddl'
import {createOrUpdateConferences} from "./conference.service";
import logger from "../app/logger";

export async function ccfddlCrawlService(urlWebsite: string, websiteId: number, currentTime: string) {
    try {
        const rs = await fetchDataFromYamlCcfddl(urlWebsite, websiteId, new Date().getFullYear(), currentTime);
        rs && void createOrUpdateConferences(rs, urlWebsite);
    }catch (e){
        logger.error('[Crawler-Special]: Error when crawl website -' + urlWebsite);
    }

}
