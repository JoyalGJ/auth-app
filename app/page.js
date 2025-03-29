"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { sendOtp } from "@/app/send-otp";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); 
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSendOtp = async () => {
    try {
      await sendOtp(email);
      setStep(2);
      setError(null);
    } catch (err) {
      setError("Failed to send OTP. Try again.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      console.log("Verifying OTP...");
      const res = await signIn("credentials", { email, otp, redirect: false });

      if (res?.error) {
        throw new Error(res.error);
      }
      console.log("OTP Verified. Redirecting...");
      router.push("/login-success"); 
    } catch (err) {
      console.error("OTP Verification Error:", err.message);
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600">
      <div className="bg-white shadow-xl rounded-lg p-8 w-96">
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6">
          {step === 1 ? "Login via OTP" : "Enter OTP"}
        </h2>
        {step === 1 ? (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full text-black p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleSendOtp}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 mt-4 rounded-lg transition transform hover:scale-105"
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full text-black p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold p-3 mt-4 rounded-lg transition transform hover:scale-105"
            >
              Verify OTP
            </button>
          </>
        )}
        {error && <p className="text-red-500 text-sm text-center mt-3">{error}</p>}
      </div>
    </div>
  );
}
