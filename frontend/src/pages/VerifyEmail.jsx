import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { showToast } from "@/helper/ShowToast";
import { RouteSignIn } from "@/helper/RouteName";
import GuitarNotesBackground from "@/components/GuitarNotesBackground";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const email = location.state?.email;
  
  // Redirect if no email found (user tried to access page directly)
  useEffect(() => {
    if (!email) {
      showToast("No email found. Please login first.", "error");
      navigate(RouteSignIn);
    }
  }, [email, navigate]);

  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  
  // Resend Logic State
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(0);

  // Timer Countdown Effect
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // ✅ RESEND FUNCTION
  const handleResend = async () => {
    setResendDisabled(true);
    setTimer(30); // Disable for 30 seconds

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/resend-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Failed to resend", "error");
        setResendDisabled(false); // Enable if failed
        setTimer(0);
        return;
      }

      showToast("New code sent successfully!", "success");
    } catch (error) {
      showToast("Network error. Try again.", "error");
      setResendDisabled(false);
      setTimer(0);
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 4) {
      showToast("Please enter the full 4-digit code", "error");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/verify-email`, 
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Invalid Code", "error");
        return;
      }

      showToast("Email verified successfully!", "success");
      navigate(RouteSignIn); 
      
    } catch (error) {
      showToast("Verification failed", "error");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 overflow-hidden">
      <GuitarNotesBackground />
      
      <div className="relative z-10 bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden animate-fade-in-up">
        {/* Gradient Header Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

        <div className="p-8 pt-10 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter OTP Code</h2>
          <p className="text-sm text-gray-500 mb-8">
            We've sent a 4-digit code to <span className="font-semibold text-gray-700">{email}</span>. Please enter it below.
          </p>

          {/* OTP Inputs */}
          <div className="flex justify-center gap-4 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-14 h-14 text-center text-2xl font-semibold text-gray-900 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
              />
            ))}
          </div>

          {/* Verify Button */}
          <button 
            onClick={handleVerify}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200 active:scale-[0.98] mb-6"
          >
            Verify Code
          </button>

          {/* Resend Link with Timer Logic */}
          <p className="text-sm text-gray-500">
            Didn't receive code?{" "}
            <button 
              onClick={handleResend}
              disabled={resendDisabled}
              className={`font-semibold transition-colors ${
                resendDisabled 
                  ? "text-gray-400 cursor-not-allowed" 
                  : "text-blue-600 hover:text-blue-700 hover:underline"
              }`}
            >
              {resendDisabled ? `Resend in ${timer}s` : "Resend OTP"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;