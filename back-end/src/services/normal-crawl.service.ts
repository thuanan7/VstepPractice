import {ConferenceAttributes} from "../models/conference.model";
import puppeteer from "puppeteer";
import cheerio, {Cheerio} from "cheerio";
import {Element} from "domhandler";
import {createOrUpdateConferences} from "./conference.service";
import {ISchemaWebsiteCheerio} from "../builds/normalSchema";
import logger from "../app/logger";

export async function normalCrawlService(urlWebsite: string, websiteId: number, schema: {
    [key: string]: ISchemaWebsiteCheerio
}) {
    const rs: ConferenceAttributes[] = [];
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let isSuccess = true;
    try {
        await page.goto(urlWebsite, {timeout: 0});
        const html = await page.content();
        const $ = cheerio.load(html);
        const main = $(schema?.main?.value).eq(schema?.main?.position || 0);
        const rows = main.find(schema?.rows?.value);
        if (rows.length > 0) {
            rows.each((i, el) => {
                let title = '';
                let urlDestination = '';
                title = getValue($(el).find(schema?.title?.value).eq(schema?.title?.position || 0), schema?.title?.type);
                urlDestination = getValue($(el).find(schema?.url.value).eq(schema?.url?.position || 0), schema?.url?.type);
                if (title !== '' && urlDestination !== '') {
                    const description = getValue($(el).find(schema?.description.value).eq(schema?.description?.position || 0), schema?.description?.type);
                    const deadline = getValue($(el).find(schema?.deadline?.value).eq(schema?.deadline?.position || 0), schema?.deadline?.type);
                    const date = getValue($(el).find(schema?.date?.value).eq(schema?.date?.position || 0), schema?.date?.type);
                    const location = getValue($(el).find(schema?.location?.value).eq(schema?.location?.position || 0), schema?.location?.type);
                    rs.push({
                        title,
                        description,
                        websiteId,
                        urlDestination,
                        location,
                        timezone: '',
                        date: date,
                        deadline: deadline,
                        comment: ''
                    })
                }

            });

        }
    } catch (e) {

        isSuccess = false;
    } finally {
        isSuccess && rs && rs.length > 0 && void createOrUpdateConferences(rs);
        void browser.close();
        if (!isSuccess) {
            logger.error('[Crawler-Normal]: Error when crawl website -' + urlWebsite);
        }else{
            logger.info(`[Crawler-Normal]: Crawl website - ${urlWebsite} successfully`);

        }
    }


}

function getValue(node?: Cheerio<Element>, type = 'text') {
    if (node) {
        if (type === 'text') {
            return node.text()?.trim() || '';
        } else if (type === 'href') {
            return node.attr('href')?.trim() || ''
        } else if (type === 'html') {
            return node.html()?.trim() || ''
        }
    }
    return ''
}