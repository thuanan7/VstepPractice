import {Request, Response} from 'express'
import BaseResponse from "../utils/baseResponse";
import {crawlConferencesByWebsiteId} from "../services/crawl.service";
import job from "../app/job";
import {updateStatusJobRun} from "../services/setting.service";

export const crawManual = async (req: Request, res: Response) => {
    let rs = new BaseResponse(false, 'Params error');
    try {
        const {id = ''} = req.params;
        const websiteName = await crawlConferencesByWebsiteId(id);
        rs.setStatus(200).setSuccess(true).setMessage(`Crawl conferences website '${websiteName || ''}' successfully`)
    } catch (error: any) {
        rs.setStatus(500).setMessage(error?.message)
    } finally {
        res.status(rs.status).json(rs.body);
    }
};
export const runJob = async (req: Request, res: Response) => {
    const {status = false} = req.body;
    let rs = new BaseResponse(false, 'Params error');
    try {
        if (status) {
            console.log(`[Server]: Job scrape world conference is running`)
            await job?.start();
        } else {
            console.log(`[Server]: Job scrape world conference is not running`)
            await job?.stop();
        }
        const rsAfterUpdateDb = await updateStatusJobRun(status);
        rs.setSuccess(rsAfterUpdateDb).setStatus(rsAfterUpdateDb ? 200 : 500).setMessage(rsAfterUpdateDb ? `Turn ${status ? 'on' : 'off'} job successfully` : 'Error when update db')
    } catch (e: any) {
        rs.setMessage(e.toString())
    } finally {
        res.status(rs.status).json(rs.body);
    }
}
