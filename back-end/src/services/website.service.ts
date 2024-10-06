import Website from "../models/website.model";
import BaseResponse from "../utils/baseResponse";
import WebsiteSchema from "../models/website-schema.model";
import {Op} from "sequelize";
import dataConfigs from "../../data.json";
import mapping, {IEditSchema, IEditWebsite} from "../utils/mapingUtils";

export interface IWebsiteReqCreate {
    name: string;
    url: string;
    time: number;
    type: number;
    specialKey: string;
    schemas: { key: number; value: string; position: number; type: string }[];
}

export interface IWebsiteReqUpdate {
    name?: string;
    url?: string;
    timeCrawl?: number;
    active?: boolean;
}

async function createService(data: IWebsiteReqCreate) {
    try {
        const website = await Website.create({
            timeCrawl:data.time,
            url: data.url,
            name: data.name,
            type: data.type,
        });
        if (data.type === 0) {
            const schema = await WebsiteSchema.create({
                key: dataConfigs.SCHEMA_KEYS.SPECIAL,
                value: data.specialKey,
                type: "text",
                position: 0,
                websiteId: website.id,
                createdAt: new Date(),
            });
        } else {
            if (data.schemas.length > 0) {
                const schema = await WebsiteSchema.bulkCreate(
                    data.schemas.map((e) => {
                        return {
                            key: e.key,
                            value: e.value,
                            type: e.type,
                            position: e.position,
                            websiteId: website.id,
                            createdAt: new Date(),
                        };
                    }),
                );
            }
        }
        return new BaseResponse<{ id: string }>(true, "Website is created").setData(
            {id: `${website.id}`},
        );
    } catch (e: any) {
        return new BaseResponse(false, e?.message);
    }
}

interface IExtendData {
    specialKey: string;
    schemas: { key: number; value: string; type: string; position: number }[];
}

async function updateService(
    id: string,
    data: IWebsiteReqUpdate,
    extend?: IExtendData,
) {
    const item = await Website.findByPk(id, {
        include: [{model: WebsiteSchema}],
    });
    if (item) {
        const {active = true} = data;
        item.url = data?.url || item.url;
        item.name = data?.name || item.name;
        item.timeCrawl = data?.timeCrawl || item.timeCrawl;
        item.updatedAt = new Date();
        item.isDeleted = !active;
        await item.save();
        if (extend) {
            if (item.type === 0) {
                // @ts-ignore
                await item.WebsiteSchemas[0].update({
                    value: extend.specialKey,
                    updatedAt: new Date(),
                });
            } else {
                for (const x of extend.schemas) {
                    const schema = await WebsiteSchema.findOne({
                        where: {websiteId: id, key: x.key},
                    });
                    if (schema) {
                        await schema.update({
                            value: x.value,
                            position: x.position,
                            type: x.type,
                            updatedAt: new Date(),
                        });
                    } else {
                        await WebsiteSchema.create({
                            websiteId: parseInt(id),
                            key: x.key,
                            value: x.value,
                            position: x.position,
                            type: x.type,
                            createdAt: new Date(),
                        });
                    }
                }
            }
        }

        return new BaseResponse<{ id: string }>(true, "Website is updated").setData(
            {id},
        );
    } else {
        return new BaseResponse(false, "Website is not exist");
    }
}

async function deleteService(id: string) {
    const item = await Website.findByPk(id);
    if (item) {
        await item.destroy();
        return new BaseResponse<{ id: string }>(true, "Website is deleted").setData(
            {id},
        );
    } else {
        return new BaseResponse(false, "Website is not exist");
    }
}

async function getAllService() {
    const item = await Website.findAll({
        where: {
            isDeleted: {
                [Op.ne]: 1,
            },
        },
    });
    return item;
}

async function getWebsiteService(id: string) {
    const item = await Website.findByPk(id, {
        include: [{model: WebsiteSchema}],
    });
    let specialKey = "";
    let schemas: IEditSchema[] = [];
    if (item?.isDeleted === false) {
        if (item.type === 0) {
            // @ts-ignore
            const schemas = item?.WebsiteSchemas || [];
            if (schemas.length > 0) {
                specialKey = schemas[0].value;
            }
        } else {
            // @ts-ignore
            (item?.WebsiteSchemas || []).forEach((e: WebsiteSchema) => {
                schemas.push({
                    key: e.key,
                    position: e.position,
                    type: e.type,
                    value: e.value,
                });
            });
        }
        return new BaseResponse<IEditWebsite | null>(
            true,
            "Get all website successfully",
        ).setData(mapping.EditWebsite(item, {specialKey, schemas}));
    } else {
        return new BaseResponse<Website | null>(false, "Not found").setData(null);
    }
}

async function getWebsiteSchemaByWebsiteId(id: string) {
    const item = await Website.findOne({
        where: {id: id, isDeleted: false},
        include: [{model: WebsiteSchema, where: {isDeleted: false}}],
    });
    return item;
}

export {
    getAllService,
    createService,
    updateService,
    deleteService,
    getWebsiteService,
    getWebsiteSchemaByWebsiteId,
};
