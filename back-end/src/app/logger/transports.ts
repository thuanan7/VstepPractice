import {transports} from 'winston';
import 'winston-daily-rotate-file';
import {defaultFormat, defaultFormatWithColor} from './formats';

//Log to console
export const toConsole = new transports.Console({
    format: defaultFormatWithColor,
    handleExceptions: true,
});

//Log to files (day by day)
export const toFile = new transports.DailyRotateFile({
    filename: 'logs/%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '15d',
    format: defaultFormat,
    handleExceptions: true,
});
