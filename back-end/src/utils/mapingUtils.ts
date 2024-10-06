import Conference, { IConferenceModel } from "../models/conference.model";
import { formatDateToFE } from "./dateUtils";
import Website from "../models/website.model";

export interface IEditWebsite {
  name: string;
  id: number;
  url: string;
  type: number;
  timeCrawl: number;
  specialKey: string;
  schemas: IEditSchema[];
}
export interface IEditSchema {
  key: number;
  type: string;
  position: number;
  value: string;
}
const mapping = {
  ModelToIConferenceModel: (
    model: Conference,
    index: number,
  ): IConferenceModel => {
    return {
      id: model.id,
      title: model.title,
      description: model.description,
      date: model.date,
      notificationDate: model.date,
      deadline: model.deadline || "",
      comment: model.comment || "",
      timezone: model.timezone,
      location: model.location,
      website: model.urlDestination,
      createdDate: model.createdAt ? formatDateToFE(model.createdAt) : "",
    };
  },
  EditWebsite: (
    model: Website,
    { specialKey, schemas }: { specialKey: string; schemas: IEditSchema[] },
  ): IEditWebsite => {
    return {
      id: model.id,
      type: model.type,
      name: model.name,
      url: model.url,
      timeCrawl: model.timeCrawl,
      specialKey: specialKey,
      schemas,
    };
  },
};
export default mapping;
