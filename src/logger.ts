import * as winston from 'winston';

export const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.simple(),
  transports: [
    new winston.transports.File({ filename: 'debug-log.txt', level: 'debug' }),
  ],
});
