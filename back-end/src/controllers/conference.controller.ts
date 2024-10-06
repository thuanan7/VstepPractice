import { Request, Response } from "express";
import {
  getAllConferences,
  deleteById as deleteConferenceById,
} from "../services/conference.service";
import { getAllService as getAllWebsiteServices } from "../services/website.service";
import BaseResponse from "../utils/baseResponse";
import { IConferenceModel } from "../models/conference.model";
import Website from "../models/website.model";
import { TryParseInt } from "../utils/dbUtils";

export const getAll = async (req: Request, res: Response) => {
  let rs = new BaseResponse(false, "Cant get Conferences");
  try {
    const { page = 1, websiteId = "all", keyword = "" } = req.query;

    const [dtConferences, websites] = await Promise.allSettled([
      getAllConferences(
        parseInt(`${page}`),
        `${keyword}`,
        websiteId === "all" ? undefined : parseInt(`${websiteId}`),
      ),
      getAllWebsiteServices(),
    ]);
    const data: {
      conferences: IConferenceModel[];
      websites: Website[];
      pagination: any;
    } = {
      conferences: [],
      websites: [],
      pagination: {},
    };
    if (dtConferences.status === "fulfilled") {
      const { conferences = [], pagination } = dtConferences.value as {
        conferences: IConferenceModel[];
        pagination: any;
      };
      data.conferences = conferences;
      data.pagination = pagination;
    }
    if (websites.status === "fulfilled") {
      data.websites = websites.value || [];
    }
    rs.setSuccess(true)
      .setMessage("Get Conferences success")
      .setData(data)
      .setStatus(200);
  } catch (error: any) {
    rs = new BaseResponse(false, error?.message);
  } finally {
    res.status(rs.status).json(rs.body);
  }
};

export const deleteById = async (req: Request, res: Response) => {
  let rs = new BaseResponse(false, "Not found any conference");
  try {
    const { id = "" } = req.params;
    const idNum = TryParseInt(id, 0);
    if (idNum !== 0) {
      const status = await deleteConferenceById(idNum);
      if (status > 0) {
        rs.setSuccess(true)
          .setMessage("Delete conference successfully")
          .setData(true)
          .setStatus(200);
      } else {
        if (status < 0) rs.setMessage(`Cant delete conference with id= ${id}`);
        rs.setData(false).setStatus(200);
      }
    } else {
      rs.setData(false).setStatus(200);
    }
  } catch (error: any) {
    rs = new BaseResponse(false, error?.message);
  } finally {
    res.status(rs.status).json(rs.body);
  }
};
