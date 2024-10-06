import {Request, Response} from "express";
import {
    createService,
    updateService,
    deleteService,
    getAllService,
    getWebsiteService,
} from "../services/website.service";

import BaseResponse from "../utils/baseResponse";
import Website from "../models/website.model";
import {getDataAutoJob} from "../app/job";
import {appConfigs} from "../app/configs";

export const createWebsite = async (req: Request, res: Response) => {
    let rs = new BaseResponse(false, "Params error");
    try {
        const {
            name = "",
            url = "",
            time = 0,
            isSpecial = true,
            specialKey = "",
            schemas = [],
        } = req.body;
        if (name !== "" && url !== "") {
            let valid = true;
            if (isSpecial && specialKey === "") {
                valid = false;
                rs.setSuccess(false)
                    .setStatus(500)
                    .setMessage("Special website need key special");
            }
            if (valid) {
                rs = await createService({
                    name,
                    url,
                    time,
                    type: isSpecial ? 0 : 1,
                    specialKey,
                    schemas,
                });
            }
        }
    } catch (error: any) {
        rs = new BaseResponse(false, error?.message);
    } finally {
        res.status(rs.status).json(rs.body);
    }
};
export const updateWebsite = async (req: Request, res: Response) => {
    let rs = new BaseResponse(false, "Params error");
    try {
        const {id = ""} = req.params;
        const {
            name = undefined,
            url = undefined,
            time = undefined,
            specialKey = "",
            schemas = [],
        } = req.body;
        if (id !== "") {
            rs = await updateService(
                id,
                {name, url, timeCrawl: time},
                {specialKey, schemas},
            );
        }
    } catch (e: any) {
        rs = new BaseResponse(false, e?.message);
    } finally {
        res.status(rs.status).json(rs.body);
    }
};
export const deleteWebsite = async (req: Request, res: Response) => {
    let rs = new BaseResponse(false, "Params error");
    try {
        const {id = ""} = req.params;
        const {hard = false} = req.body;
        if (id !== "") {
            if (hard) {
                rs = await deleteService(id);
            } else {
                rs = await updateService(id, {active: false});
            }
        }
    } catch (e: any) {
        rs = new BaseResponse(false, e?.message);
    } finally {
        res.status(rs.status).json(rs.body);
    }
};
export const getAllWebsites = async (req: Request, res: Response) => {
    let rs = new BaseResponse(false);
    try {
        const dataJson: { websites?: Website[]; autoJob?: boolean, enabledJob: boolean } = {enabledJob: true};
        const rp = await Promise.allSettled([getAllService(), getDataAutoJob()]);
        if (rp[0].status === "fulfilled") {
            dataJson.websites = rp[0].value;
        }
        if (rp[1].status === "fulfilled") {
            dataJson.autoJob = rp[1].value;
        }
        dataJson.enabledJob = appConfigs.AUTO_START_JOB;
        rs.setStatus(200)
            .setSuccess(true)
            .setMessage("Get all website successfully")
            .setData(dataJson);
    } catch (e: any) {
        rs.setMessage(e?.message);
    } finally {
        res.status(rs.status).json(rs.body);
    }
};

export const editWebsite = async (req: Request, res: Response) => {
    let rs = new BaseResponse(false, "Params error");
    try {
        const {id = ""} = req.params;
        if (id !== "") {
            rs = await getWebsiteService(id);
        }
    } catch (e: any) {
        rs = new BaseResponse(false, e?.message);
    } finally {
        res.status(rs.status).json(rs.body);
    }
};
