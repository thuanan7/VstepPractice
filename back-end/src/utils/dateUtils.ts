import moment from "moment-timezone";
// Sat May 11th 2024 18:59:59 +07
export const formatDate = "YYYY-MM-DD HH:mm:ss";
export const formatDateWithUTC = `${formatDate}Z`;
export const AoETime = `AoE`;
const utcOffsetMap = {
  "-12": "Pacific/Kwajalein",
  "-11": "Pacific/Samoa",
  "-10": "Pacific/Honolulu",
  "-9": "America/Juneau",
  "-8": "America/Los_Angeles",
  "-7": "America/Denver",
  "-6": "America/Mexico_City",
  "-5": "America/New_York",
  "-4": "America/Caracas",
  "-3.5": "America/St_Johns",
  "-3": "America/Argentina/Buenos_Aires",
  "-2": "Atlantic/Azores",
  "-1": "Atlantic/Azores",
  "0": "UTC",
  "1": "Europe/Paris",
  "2": "Europe/Helsinki",
  "3": "Europe/Moscow",
  "3.5": "Asia/Tehran",
  "4": "Asia/Baku",
  "4.5": "Asia/Kabul",
  "5": "Asia/Karachi",
  "5.5": "Asia/Calcutta",
  "6": "Asia/Colombo",
  "7": "Asia/Bangkok",
  "8": "Asia/Singapore",
  "9": "Asia/Tokyo",
  "9.5": "Australia/Darwin",
  "10": "Pacific/Guam",
  "11": "Asia/Magadan",
  "12": "Asia/Kamchatka",
};

function convertUtcOffsetToTimeZone(utcOffset = "") {
  const data = utcOffset.toLowerCase().replace("utc", "").replace("+", "");
  if (Object.hasOwnProperty.call(utcOffsetMap, data)) {
    return (utcOffsetMap as any)[data];
  } else {
    if (utcOffset !== AoETime) {
      return utcOffsetMap["0"];
    }

    return AoETime;
  }
}

export function convertToTimeUTC0(inputTime = "", utcString = "") {
  if (inputTime === "") return moment.utc().format(formatDate);
  const timeZone = convertUtcOffsetToTimeZone(utcString);
  if (timeZone === utcOffsetMap["0"])
    return moment(inputTime).utc().format(formatDate);
  if (timeZone === AoETime)
    return moment
      .utc(`${inputTime}-12:00`, formatDateWithUTC)
      .format(formatDate);
  const convertedTime = moment(inputTime, formatDate).tz(timeZone);
  const convertedTimeUTC0 = convertedTime.clone().utc();
  return convertedTimeUTC0.format(formatDate);
}
export function formatDateToFE(date: Date): string {
  return moment(date).format(formatDate);
}
