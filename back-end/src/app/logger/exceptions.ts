
/**
 * Handle uncaught exceptions
 */

import { transports } from "winston";
import { defaultFormat } from "./formats";

export const defaultExceptionHandler = new transports.File({format: defaultFormat, filename: 'logs/exceptions.log'});