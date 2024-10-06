const rootPath = 'website';
export const apiConfigs = {
  getAll: `${rootPath}`,
  getById: `${rootPath}/`,
  delete: `${rootPath}/`,
  put: `${rootPath}/`,
  create: `${rootPath}`,
  crawlManual: `crawl`,
};

export enum KeySchemas {
  main = 1,
  rows = 2,
  title = 3,
  url = 4,
  description = 5,
  deadline = 6,
  date = 7,
  location = 8,
}
export const TitleSchema: { [key: string]: string } = {
  [`${KeySchemas.main}`]: 'Main',
  [`${KeySchemas.rows}`]: 'Rows',
  [`${KeySchemas.title}`]: 'Title',
  [`${KeySchemas.url}`]: 'Url',
  [`${KeySchemas.description}`]: 'Description',
  [`${KeySchemas.deadline}`]: 'Deadline',
  [`${KeySchemas.date}`]: 'Date',
  [`${KeySchemas.location}`]: 'Location',
};
