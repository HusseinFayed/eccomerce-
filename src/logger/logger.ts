
// import * as winston from 'winston';

// import { MongoDB } from 'winston-mongodb';


// const jsonLogFileFormat = winston.format.combine(
//     winston.format.errors({ stack: true }),
//     winston.format.timestamp(),
//     // winston.format.json(),
//     winston.format.prettyPrint(),
// );

// export const logger = winston.createLogger({
//     level: 'debug',
//     format: jsonLogFileFormat,
//     transports: [
//         new MongoDB(),
//         // new winston.transports.Console({level:'info'}),
//     ]
// });

// const {
//     createLogger,
//     transports,
//     format
// } = require('winston');
// require('winston-mongodb');
// const logger = createLogger({
//     transports: [
//         new transports.File({
//             filename: 'info.log',
//             level: 'info',
//             format: format.combine(format.timestamp(), format.json())
//         }),
//     ]
// })
// module.exports = logger;


// import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';

// @Injectable()
// export class LoggerMiddleware implements NestMiddleware {
//   private logger = new Logger('HTTP');

//   use(request: Request, response: Response, next: NextFunction): void {
//     const { ip, method, originalUrl } = request;
//     const userAgent = request.get('user-agent') || '';

//     response.on('finish', () => {
//       const { statusCode } = response;
//       const contentLength = response.get('content-length');

//       this.logger.log(
//         `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
//       );
//     });

//     next();
//   }
// }

// import { ConsoleLogger } from '@nestjs/common';

// export class MyLogger extends ConsoleLogger {
//   customLog() {
//     this.log('Please feed the cat!');
//   }
// }

import * as winston from 'winston';
// import * as winstonMongoDB from 'winston-mongodb';
import { MongoDB } from 'winston-mongodb';
// import { appSettings } from '../shared/app.settings';

const options = {
    db: process.env.LOGS_DB,
    options:{
        useUnifiedTopology: true,
    },

    collection: 'logs',
    level: 'warning',
    metaKey: 'stack',
    capped:true,
    // cappedMax: appSettings.maxNumberOfLogsInMongoDb,
    format: winston.format.json()


};

const jsonLogFileFormat = winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    // winston.format.json(),
    winston.format.prettyPrint(),
);

// winston.add(new winston.transports.MongoDB(options));

export const logger = winston.createLogger({
    level: 'debug',
    format: jsonLogFileFormat,
    transports: [
        new MongoDB(options),
        // new winston.transports.Console({level:'info'}),
    ]
});

export function closeWinstonConnection(){
    logger.transports[0].close();
}