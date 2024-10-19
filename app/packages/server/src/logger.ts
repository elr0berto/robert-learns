import winston, { format } from "winston";
import { PrismaClient } from "@prisma/client";
import { PrismaWinstonTransporter } from "./winston-prisma-transporter/index.js";
const prisma = new PrismaClient();

const logger = winston.createLogger({
    format: format.json(),
    transports: [
        new PrismaWinstonTransporter({
            level: "http",
            prisma,
        }),
    ],
});

import { Request } from 'express';

export function logWithRequest<T, ResBody = unknown, ReqBody = unknown, ReqQuery = unknown>(
    level: 'info' | 'error' | 'warn' | 'debug' | 'verbose',
    req: Request<T, ResBody, ReqBody, ReqQuery>,
    message: string,
    meta?: object,
) {
    const requestInfo = {
        url: req.originalUrl,
        method: req.method,
        body: req.body,       // Add the request body
        params: req.params,   // Add the request parameters
        referer: req.headers.referer || req.headers.referrer, // Add the referer (both spellings are used for compatibility)
        userAgent: req.headers['user-agent'], // Add the user-agent
        ip: req.ip || (req.connection && req.connection.remoteAddress) || undefined, // Add the IP address
    };

    if (logger[level]) { // Check if the level method exists on the logger
        logger[level](message, {
            meta: {
                ...meta,
                request: requestInfo,
            },
        });
    } else {
        throw new Error(`Invalid log level: ${level}`);
    }
}

export default logger;
