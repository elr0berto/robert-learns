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

export default logger;
