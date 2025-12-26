// Question: Forgot Password using Reset Link (No OTP)

import axios from "axios";
import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔐 Send Reset Link
  const handleSendResetLink = async () => {
    if (!email) {
      setErr("Email is required");
      return;
    }

    try {
      setLoading(true);
      setErr("");

      const res = await axios.post(
        `${serverUrl}/api/auth/forgot-password`,
        { email },
        { withCredentials: true }
      );

      alert("Reset password link sent to your email");
      setLoading(false);

    } catch (error) {
      setErr(error?.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full items-center justify-center min-h-screen p-4 bg-[#fff9f6]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        
        <div className="flex items-center gap-4 mb-4">
          <IoIosArrowRoundBack
            size={30}
            className="text-[#ff4d2d] cursor-pointer"
            onClick={() => navigate("/signin")}
          />
          <h1 className="text-2xl font-bold text-[#ff4d2d]">
            Forgot Password
          </h1>
        </div>

        <div>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            className="w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323]"
            onClick={handleSendResetLink}
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Send Reset Link"}
          </button>

          {err && (
            <p className="text-red-500 text-center mt-4">*{err}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
