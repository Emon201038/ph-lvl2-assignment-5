/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { envVars } from "../config/env";
import AppError from "../helpers/appError";
import { HTTP_STATUS } from "./httpStatus";

const transporter = nodemailer.createTransport({
  host: envVars.SMTP_HOST,
  port: Number(envVars.SMTP_PORT),
  service: "gmail",
  secure: true,
  auth: {
    user: envVars.SMTP_USER,
    pass: envVars.SMTP_PASSWORD
  }
});
export interface ISendEmail {
  to: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, any>;
  attachments?: {
    filename: string;
    contentType: string;
    content: Buffer | string;
  }[];
}
export const sendEmail = async ({ to, subject, templateName, templateData, attachments }: ISendEmail) => {
  try {
    const templatePath = path.join(__dirname, `templates/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData);
    const info = await transporter.sendMail({
      from: envVars.SMTP_FROM,
      to,
      subject,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType
      }))
    });
    console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    console.log("Error sending email:", error);
    throw new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to send email.");
  }
};