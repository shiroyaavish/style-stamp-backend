import { HttpException, HttpStatus } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { CreateInquiryDto } from 'src/inquiries/dto/create-inquiry.dto';

// Define email configuration interface
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

// Get email configuration from environment variables
const getEmailConfig = (): EmailConfig => {
  return {
    host: process.env.MAIL_HOST || 'smtp.example.com',
    port: parseInt(process.env.MAIL_PORT || '587', 10),
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
      user: process.env.MAIL_USER || '',
      pass: process.env.MAIL_PASSWORD || '',
    },
    from: process.env.MAIL_FROM || 'noreply@example.com',
  };
};

// Create a transporter instance
const createTransporter = () => {
  const config = getEmailConfig();
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
  });
};

// Email sending utility function
export const sendEmail = async (
  to: string[] | string,
  details: CreateInquiryDto,
) => {
  try {
    const transporter = createTransporter();
    const config = getEmailConfig();
    const subject = `Inquiry From ${details['firstName']} ${details['lastName']}`;
    const html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); background: linear-gradient(to bottom right, #ffffff, #f5f8ff);">
        <div style="text-align: center; margin-bottom: 25px;">
            <h2 style="color: #a085ec; margin-bottom: 5px; font-weight: 600;">New Inquiry Received</h2>
            <div style="width: 80px; height: 4px; background: linear-gradient(to right, #a085ec,rgb(162, 142, 218)); margin: 0 auto;"></div>
        </div>
        
        <div style="background-color: white; padding: 25px; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <div style="display: flex; margin-bottom: 15px; border-bottom: 1px solid #eaeef2; padding-bottom: 15px;">
                <div style="width: 120px; font-weight: 600; color: #566a7f;">First Name:</div>
                <div style="flex: 1; color: #333;">${details['firstName']}</div>
            </div>
            
            <div style="display: flex; margin-bottom: 15px; border-bottom: 1px solid #eaeef2; padding-bottom: 15px;">
                <div style="width: 120px; font-weight: 600; color: #566a7f;">Last Name:</div>
                <div style="flex: 1; color: #333;">${details['lastName']}</div>
            </div>
            
            <div style="display: flex; margin-bottom: 20px; border-bottom: 1px solid #eaeef2; padding-bottom: 15px;">
                <div style="width: 120px; font-weight: 600; color: #566a7f;">Email:</div>
                <div style="flex: 1; color: #333;">${details['email']}</div>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background-color: #f8fafc; border-radius: 6px; border-left: 4px solid #a085ec;">
                <h3 style="margin-top: 0; color: #a085ec; font-weight: 500; margin-bottom: 15px;">Message:</h3>
                <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${details['message']}</p>
            </div>
        </div>
        
        <div style="margin-top: 25px; text-align: center; color: #8996a8; font-size: 14px;">
            <p>This message was received on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        </div>
    </div>
    `;
    const mailOptions = {
      from: config.from,
      to: Array.isArray(to) ? to.join(',') : to,
      subject: subject,
      text: null,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    // return { success: false, error };
    throw new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        message: 'Email Is Not Valid',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
};
