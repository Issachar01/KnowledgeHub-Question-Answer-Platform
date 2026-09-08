// src/services/emailService.js

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  await transporter.sendMail({
    from: `"KnowledgeHub" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email Address",
    html: `
      <h2>Welcome to KnowledgeHub!</h2>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
    `
  });
};

const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"KnowledgeHub" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset Request",
    html: `
      <h2>Password Reset</h2>
      <p>You requested a password reset. Click the link below to set a new password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link expires in 1 hour.</p>
    `
  });
};

const sendAnswerNotificationEmail = async (email, questionTitle, answererName) => {
  await transporter.sendMail({
    from: `"KnowledgeHub" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "New Answer on Your Question",
    html: `
      <h2>New Answer</h2>
      <p><strong>${answererName}</strong> has answered your question: "${questionTitle}".</p>
      <a href="${process.env.FRONTEND_URL}/questions">View Question</a>
    `
  });
};

const sendAcceptedAnswerEmail = async (email, questionTitle) => {
  await transporter.sendMail({
    from: `"KnowledgeHub" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Answer Was Accepted!",
    html: `
      <h2>Answer Accepted!</h2>
      <p>Your answer for the question "${questionTitle}" has been marked as accepted.</p>
      <a href="${process.env.FRONTEND_URL}/questions">View Question</a>
    `
  });
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendAnswerNotificationEmail,
  sendAcceptedAnswerEmail
};