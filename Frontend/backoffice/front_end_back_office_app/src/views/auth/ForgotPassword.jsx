import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { MdMail } from "react-icons/md";
import logoImg from "../../assets/img/auth/logo.png";
import { IoIosArrowRoundBack, IoIosSend } from "react-icons/io";
import { FaMailBulk } from "react-icons/fa";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const CODE_TTL_MS = 1000 * 60 * 10; // 10 minutes TTL for verification code

  const generateCode = () =>
    String(Math.floor(100000 + Math.random() * 900000)); // 6-digit code

  const storeCode = (email, code) => {
    const data = { code, expiresAt: Date.now() + CODE_TTL_MS, email };
    localStorage.setItem(`forgot_code:${email}`, JSON.stringify(data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccess("");
    setLoading(true);

    try {
      // Try server side first (if your backend exposes this API)
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        // backend handled sending the email. Still navigate to verify page.
        setSuccess("Check your email, we've sent reset instructions.");
        navigate(`/auth/verify?email=${encodeURIComponent(email)}`);
      } else {
        // Fallback: no backend or backend declined; simulate
        const code = generateCode();
        storeCode(email, code);
        // For development/demo: log the code. In production, remove this and rely on real email sending.
        console.info(`[Mock Email] Verification code for ${email}: ${code}`);
        setSuccess(
          "If an account exists, a reset code has been sent. Check your email."
        );
        navigate(`/auth/verify?email=${encodeURIComponent(email)}`);
      }
    } catch (err) {
      // fallback client-side generation
      const code = generateCode();
      storeCode(email, code);
      console.info(`[Mock Email] Verification code for ${email}: ${code}`);
      setSuccess(
        "If an account exists, a reset code has been sent. Check your email."
      );
      navigate(`/auth/verify?email=${encodeURIComponent(email)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#667eea,#764ba2)] px-4 py-12 ">
      {/* Floating shapes */}
      <div className="absolute rounded-full shadow-lg animate-pulse-slow left-10 top-10 h-72 w-72 bg-white/10"></div>
      <div className="absolute rounded-full shadow-lg animate-pulse-slow bottom-20 right-10 h-96 w-96 bg-white/10"></div>
      <div className="absolute w-40 h-40 rounded-full shadow-lg animate-pulse-slow bottom-16 left-16 bg-white/10"></div>
      <div className="absolute w-48 h-48 rounded-full shadow-lg animate-pulse-slow right-16 top-16 bg-white/10"></div>

      {/* Main container */}
      <div className="relative z-10 flex w-full max-w-lg overflow-hidden border shadow-xl xl rounded-3xl border-white/20 bg-white/10 backdrop-blur-xl">
        {/* RIGHT SECTION – Forgot password form */}
        <div className="flex flex-col justify-center w-full p-10 bg-white ">
          <div className="flex flex-col items-center justify-center w-full text-center">
            <img
              src={logoImg}
              alt="Manage"
              className="mb-2 h-[100px] w-[100px] rounded-full bg-[linear-gradient(135deg,#667eea,#764ba2)]  shadow-lg"
            />
            <h2 className="text-transparent mb-2 bg-[linear-gradient(135deg,#667eea,#764ba2)] bg-clip-text text-2xl font-bold">
              Forgot Password?
            </h2>
            <p className="max-w-sm mb-3 text-gray-600">
              Enter your email and we'll send a link to reset your password.
            </p>
          </div>

          {errorMsg && (
            <p className="mb-4 text-center text-red-600">{errorMsg}</p>
          )}
          {success && (
            <div className="px-4 py-2 mb-4 text-sm rounded-lg bg-emerald-50 text-emerald-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-8">
            <div className="relative w-full">
              <FaMailBulk
                size={20}
                className="absolute text-gray-600 -translate-y-1/2 left-4 top-1/2"
              />

              <input
                id="forgot-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-4 pl-12 pr-4 text-gray-700 bg-transparent border border-gray-600 outline-none peer rounded-xl"
              />

              <label
                htmlFor="forgot-email"
                className="absolute px-1 text-gray-600 transition-all duration-200 -translate-y-1/2 bg-white left-12 top-1/2 peer-valid:top-0 peer-valid:text-xs peer-valid:text-gray-600 peer-focus:top-0 peer-focus:text-sm peer-focus:text-gray-600"
              >
                Enter your email
              </label>
            </div>

            <button
              disabled={loading}
              className="flex items-center justify-center w-full gap-2 p-3 font-semibold text-white transition rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              aria-busy={loading}
            >
              <IoIosSend className="inline" />
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <div className="flex justify-between p-2 text-sm text-gray-800">
              <Link
                to="/auth/login"
                className="flex items-center gap-2 font-semibold text-gray-700 hover:text-blue-600 hover:underline"
              >
                <IoIosArrowRoundBack size={20} />
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%,
          100% {
            transform: translateY(0) scale(1);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-20px) scale(1.05);
            opacity: 0.9;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 7s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
