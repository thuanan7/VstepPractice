
/**
 * Handle uncaught promise rejections
 */

import winston from "winston";

export const defaultRejectionHandler = new winston.transports.File({ filename: 'logs/rejections.log' });
