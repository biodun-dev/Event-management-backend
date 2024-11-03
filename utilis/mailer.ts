const nodemailer = require('nodemailer');
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: to, 
      subject: subject,
      text: text,
    });

    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send email: ${error}`);
  }
};

export { sendEmail };
