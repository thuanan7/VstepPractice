import Conference, { ConferenceAttributes } from "../models/conference.model";
import mapping from "../utils/mapingUtils";
import connection from "../db/connection";
import { getOffset } from "../utils/dbUtils";
import { Op } from "sequelize";
import Pagination from "../builds/modelPagination";
import logger from "../app/logger";

async function createOrUpdateConferences(params: ConferenceAttributes[],urlWebsite?:string) {
  const t = await connection.transaction();
  let isSuccess=true;
  try {
    const promise = params.map((x) => {
      return Conference.findOrCreate({
        where: {
          urlDestination: x.urlDestination,
          websiteId: x.websiteId,
        },
        defaults: {
          title: x.title,
          description: x.description,
          urlDestination: x.urlDestination,
          websiteId: x.websiteId,
          date: x.date,
          location: x.location,
          timezone: x.timezone,
          deadline: x.deadline,
          comment: x.comment,
        },
        transaction: t,
      }).then(([conference, created]) => {
        if (!created) {
          conference.update(
            {
              description: x.description,
              location: x.location,
              date: x.date,
              timezone: x.timezone,
              deadline: x.deadline,
              comment: x.comment,
            },
            { transaction: t },
          );
        }
      });
    });
    await Promise.allSettled(promise);
    await t.commit();
  } catch (e: any) {
    void t.rollback();
    isSuccess=false;
  }finally {
    if(urlWebsite){
      if (!isSuccess) {
        logger.error('[Crawler-Special]: Error when crawl website -' + urlWebsite);
      }else{
        logger.info(`[Crawler-Special]: Crawl website - ${urlWebsite} successfully`);
      }
    }
    return isSuccess;
  }
}

async function getAllConferences(
  page: number,
  keyword: string,
  websiteId?: number,
) {
  try {
    const [offset, limit, currentPage] = getOffset({ page: page - 1 });
    let where: any = keyword
      ? {
          [Op.or]: [
            {
              title: {
                [Op.like]: `%${keyword.toLowerCase().trim()}%`,
              },
            },
            {
              description: {
                [Op.like]: `%${keyword.toLowerCase().trim()}%`,
              },
            },
          ],
        }
      : {};
    where.deadline = {
      [Op.not]: "",
    };
    if (websiteId) {
      where.websiteId = { [Op.eq]: websiteId };
    }
    where.isDeleted = { [Op.ne]: 1 };
    const { rows, count } = await Conference.findAndCountAll({
      where,
      limit,
      offset,
      attributes: [
        "id",
        "title",
        "description",
        "date",
        "timezone",
        "location",
        "deadline",
        "comment",
        "createdAt",
        "urlDestination",
      ],
      order: [
        ["title", "ASC"],
        ["deadline", "ASC"],
      ],
    });
    const p = new Pagination(count, limit, currentPage).paging;
    return {
      conferences: rows.map(mapping.ModelToIConferenceModel),
      pagination: p,
    };
  } catch (e: any) {
    console.log("error", e.message);
    return false;
  }
}

async function deleteById(id: number) {
  try {
    const rs = await Conference.findByPk(id);
    if (rs) {
      await rs.update({
        isDeleted: true,
      });
      return id;
    }
    return 0;
  } catch (e: any) {
    return -1;
  }
}

export { createOrUpdateConferences, getAllConferences, deleteById };
