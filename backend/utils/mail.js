// utils/mail.js
// Question: Mail utility for OTP + Reset Password link

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// ================= TRANSPORTER =================
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // true for 465
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS, // Gmail App Password
  },
});

// ================= OTP MAIL (SIGNUP / FORGOT - OLD FLOW) =================
export const sendOtpMail = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject: "OTP Verification",
    html: `
      <h3>OTP Verification</h3>
      <p>Your OTP is <b>${otp}</b></p>
      <p>This OTP will expire in 5 minutes.</p>
    `,
  });
};

// ================= DELIVERY OTP MAIL =================
export const sendDeliveryOtpMail = async (user, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: user.email,
    subject: "Delivery OTP",
    html: `
      <h3>Delivery OTP</h3>
      <p>Your delivery OTP is <b>${otp}</b></p>
      <p>This OTP will expire in 5 minutes.</p>
    `,
  });
};

// ================= RESET PASSWORD LINK MAIL (NEW FLOW) =================
export const sendResetMail = async (to, resetLink) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject: "Reset Your Password",
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password.</p>
      <p>Click the button below to set a new password:</p>

      <a href="${resetLink}"
         style="
           display:inline-block;
           padding:12px 20px;
           background-color:#ff4d2d;
           color:#ffffff;
           text-decoration:none;
           border-radius:5px;
           font-weight:bold;
         ">
        Reset Password
      </a>

      <p style="margin-top:15px;">
        This link will expire in <b>15 minutes</b>.
      </p>

      <p>If you did not request this, please ignore this email.</p>
    `,
  });
};
