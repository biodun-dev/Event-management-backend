import dotenv from 'dotenv';
import Twilio from 'twilio';

dotenv.config();

const client = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendSMS = async (to: string, body: string) => {
  try {
    const message = await client.messages.create({
      body: body,
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
      to: to,
    });

    console.log(`Message sent to ${to}: ${message.sid}`);
  } catch (error) {
    console.error(`Failed to send SMS: ${error}`);
  }
};

export { sendSMS };
