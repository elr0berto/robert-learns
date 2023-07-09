import { createRequire } from 'module';
import winston, { format } from "winston";
import { PrismaClient } from "@prisma/client";

const require = createRequire(import.meta.url);
const PrismaWinstonTransporter = require('winston-prisma-transporter').default;

const prisma = new PrismaClient();

const logger = winston.createLogger({
    format: format.json(),
    transports: [
        new PrismaWinstonTransporter({
            level: "http",
            prisma,
            tableName: "Logs"
        }),
    ],
});

export default logger;
