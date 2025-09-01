import nodemailer from 'nodemailer';
import { env } from '../utils/env.js';

const transporter = nodemailer.createTransport({
  host: env('SMTP_HOST'),
  port: env('SMTP_PORT'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: env('SMTP_USER'),
    pass: env('SMTP_PASSWORD'),
  },
});

export const sendEmail = async (options) => {
  return await transporter.sendMail(options);
};

export const sendResetPasswordEmail = async (email, token) => {
  const resetLink = `${env('APP_DOMAIN')}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: env('SMTP_FROM'),
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h2>Password Reset Request</h2>
      <p>You have requested to reset your password. Click the link below to reset your password:</p>
      <a href="${resetLink}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>This link will expire in 5 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `,
  };

  return await sendEmail(mailOptions);
};
