import express from "express";
import {
  googleAuth,
  resetPassword,
  sendOtp,
  signIn,
  signOut,
  signUp,
  verifyOtp,
  forgotPassword   // 
} from "../controllers/auth.controllers.js";

const authRouter = express.Router();

// AUTH
authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);
authRouter.get("/signout", signOut);

// SIGNUP OTP
authRouter.post("/send-otp", sendOtp);
authRouter.post("/verify-otp", verifyOtp);

// FORGOT PASSWORD FLOW 
authRouter.post("/forgot-password", forgotPassword); // 👈 NEW
authRouter.post("/reset-password", resetPassword);   // password update

// GOOGLE
authRouter.post("/google-auth", googleAuth);

export default authRouter;
