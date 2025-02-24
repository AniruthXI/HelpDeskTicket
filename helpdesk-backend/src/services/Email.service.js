// src/services/email.service.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendResetPasswordEmail = async (email, resetToken) => {
  const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
  
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <p>You requested a password reset</p>
      <p>Click this link to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendResetPasswordEmail
};