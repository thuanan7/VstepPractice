import {createLogger} from 'winston';
import * as env from '../../../env.json';
import {defaultExceptionHandler} from './exceptions';
import {defaultRejectionHandler} from './rejections';
import {toConsole, toFile} from './transports';

const logger = createLogger({
    exceptionHandlers: [defaultExceptionHandler],
    rejectionHandlers: [defaultRejectionHandler],
    exitOnError: false,
});

if (env.NODE_ENV === 'development') {
    logger.level = 'silly';
    logger.add(toConsole);
    logger.add(toFile);
} else {
    logger.level = 'info';
    logger.add(toFile);
}

export default logger