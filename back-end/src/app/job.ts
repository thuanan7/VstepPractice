import nodeCron from 'node-cron';
import {appConfigs, settingKeys} from './configs';
import {crawlConferencesByWebsiteId, getAllWebsiteWillCrawl} from "../services/crawl.service";

import logger from "./logger";
import Setting from "../models/setting.model";

export async function getDataAutoJob() {
    let rs = false;
    try {
        const setting = await Setting.findOne({
            where: {key: settingKeys.runJob},
        });
        if (setting) {
            rs = setting.value === "T";
        }
    } catch (e) {
    } finally {
        return rs;
    }
}

async function scrapeWorldConference() {
    const date = Date.now();
    const willRunJob = await getDataAutoJob();
    try {
        if (willRunJob) {
            const websiteIds = await getAllWebsiteWillCrawl(date);
            logger.info(`[Job]: Start job crawl ${websiteIds.length} website(s)`);
            if(websiteIds.length>0){
                const arrJobs = websiteIds.map(id => crawlConferencesByWebsiteId(`${id}`))
                Promise.allSettled(arrJobs).then(a => {
                })
            }

        }

    } catch (e: any) {
        logger.info(`[Job]: Error ${e.toString()}`);
    }
}

const job = nodeCron.schedule(appConfigs.JOB_LOOP, scrapeWorldConference);
export default job;
