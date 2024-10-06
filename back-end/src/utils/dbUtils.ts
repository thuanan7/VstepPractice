import moment from "moment";

export function getTimeCrawl(adjustedTime: number) {
  const currentTimeAsMs = Date.now();
  const adjustedTimeAsMs = moment(currentTimeAsMs).add(adjustedTime, 'm').toDate().getTime();
  return [currentTimeAsMs, adjustedTimeAsMs];
}

export const getOffset = ({
  page = 0,
  pageSize = 10,
}: {
  page?: number;
  pageSize?: number;
}) => {
  const offset = page * pageSize;
  const limit = pageSize;

  return [offset, limit, page];
};

export function TryParseInt(str: string, defaultValue = 0) {
  let retValue = defaultValue;
  if (str !== null) {
    if (str.length > 0) {
      if (!isNaN(Number(str))) {
        retValue = parseInt(str);
      }
    }
  }
  return retValue;
}
