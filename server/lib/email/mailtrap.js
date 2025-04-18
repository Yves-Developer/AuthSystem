import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

const client = new MailtrapClient({ token: process.env.MAILTRAP_API_TOKEN });
const sender = { name: "Auth App", email: process.env.SENDER_EMAIL };

// Function to send an email with a 6-digit verification code
export const sendVerificationEmail = async (to, verificationCode) => {
  // HTML email template as a string with 6-digit code
  const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    background-color: #f4f4f4;
                }
                .container {
                    background-color: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                h2 {
                    color: #2c3e50;
                }
                .code {
                    font-size: 24px;
                    font-weight: bold;
                    color: #3498db;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Email Verification</h2>
                <p>Hello,</p>
                <p>Thank you for registering! Please use the code below to verify your email address.</p>
                <p>Your verification code is:</p>
                <p class="code">${verificationCode}</p>
                <p>If you did not request this, please ignore this email.</p>
            </div>
        </body>
        </html>
    `;

  try {
    const response = await client.send({
      from: sender,
      to: [{ email: to }],
      subject: "Verify Your Email",
      html: htmlContent,
    });

    console.log("Email sent:", response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
//function to send a password reset email with a reset link and reset token
export const sendPasswordResetEmail = async (to, resetToken) => {
  // HTML email template as a string with reset token
  const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    background-color: #f4f4f4;
                }
                .container {
                    background-color: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                h2 {
                    color: #2c3e50;
                }
                .reset-link {
                    font-size: 16px;
                    color: #3498db;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Password Reset Request</h2>
                <p>Hello,</p>
                <p>We received a request to reset your password. Please use the link below to reset it:</p>
                <p class="reset-link"><a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}">Reset Password</a></p>
                <p>If you did not request this, please ignore this email.</p>
            </div>
        </body>
        </html>
    `;

  try {
    const response = await client.send({
      from: sender,
      to: [{ email: to }],
      subject: "Password Reset Request",
      html: htmlContent,
    });

    console.log("Email sent:", response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

//exporting the function to send a welcome email
