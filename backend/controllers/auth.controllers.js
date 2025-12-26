// Question: Auth Controller with Forgot Password (Email Reset Link)

import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import genToken from "../utils/token.js";
import { sendOtpMail, sendResetMail } from "../utils/mail.js";

/* ===================== SIGN UP ===================== */
export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      fullName,
      email,
      mobile,
      role,
      password: hashedPassword
    });

    const token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json(user);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ===================== SIGN IN ===================== */
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json(user);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ===================== SIGN OUT ===================== */
export const signOut = async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logged out successfully" });
};

/* ===================== OTP (SIGNUP ONLY – KEEP AS IS) ===================== */
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.isOtpVerified = false;

    await user.save();
    await sendOtpMail(email, otp);

    return res.status(200).json({ message: "OTP sent" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "OTP verified" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ===================== 🔐 FORGOT PASSWORD (EMAIL LINK) ===================== */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    const resetLink =
      `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await sendResetMail(email, resetLink);

    return res.status(200).json({ message: "Reset link sent to email" });

  } catch (error) {
    console.log("FORGOT PASSWORD ERROR", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ===================== 🔐 RESET PASSWORD (TOKEN) ===================== */
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Token invalid or expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    return res.status(200).json({ message: "Password reset successful" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ===================== GOOGLE AUTH ===================== */
export const googleAuth = async (req, res) => {
  try {
    const { fullName, email, mobile, role } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ fullName, email, mobile, role });
    }

    const token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json(user);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
