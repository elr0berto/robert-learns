
// SMTP configuration with Zoho
import nodemailer from "nodemailer";

if (!process.env.ZOHO_SMTP_PASSWORD) {
    throw new Error("ZOHO_SMTP_PASSWORD environment variable is not set!");
}
export const smtpTransport = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
        user: 'robert@robertlearns.com',
        pass: process.env.ZOHO_SMTP_PASSWORD,
    },
    tls: {
        rejectUnauthorized: true,
    },
});