import { format } from 'winston';

export const defaultFormat = format.combine(
    format.timestamp(),
    format.align(),
    format.splat(),
    format.printf(info => `[${info.timestamp}][${info.level}]: ${info.message}`),
);

export const defaultFormatWithColor = format.combine(format.colorize(),defaultFormat);
