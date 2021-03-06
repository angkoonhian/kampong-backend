import nodemailer from 'nodemailer';
import { get } from 'lodash';

export const sendEmail = async (options) => {
    // set transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    // set message object
    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        cc: get(options, 'cc', ''),
        subject: options.subject,
        text: options.message,
    };

    const info = await transporter.sendMail(message);

    console.log(`Message sent: ${info.messageId}`);
};
