import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack, IoIosSend } from "react-icons/io";
import { FaMailBulk } from "react-icons/fa";
import logoImg from "../../assets/img/auth/logo.png";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(
        `${API_URL}/auth/forgot-password?email=${encodeURIComponent(email)}`,
        { method: "POST" }
      );

      if (res.ok) {
        setSuccess("Check your email, we've sent reset instructions.");
        navigate(`/auth/verify?email=${encodeURIComponent(email)}`);
      } else {
        const text = await res.text();
        setErrorMsg(text || "Failed to send OTP.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#667eea,#764ba2)] px-4 py-12">
      <div className="relative z-10 w-full max-w-lg p-10 bg-white shadow-xl rounded-3xl">
        <div className="flex flex-col items-center mb-6 text-center">
          <img
            src={logoImg}
            alt="Logo"
            className="mb-2 h-[100px] w-[100px] rounded-full shadow-lg"
          />
          <h2 className="mb-2 text-2xl font-bold">Forgot Password?</h2>
          <p className="text-gray-600">
            Enter your email and we'll send a link to reset your password.
          </p>
        </div>

        {errorMsg && <p className="mb-4 text-red-600">{errorMsg}</p>}
        {success && (
          <div className="px-4 py-2 mb-4 text-sm rounded bg-emerald-50 text-emerald-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative w-full">
            <FaMailBulk
              size={20}
              className="absolute text-gray-600 -translate-y-1/2 left-4 top-1/2"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full py-4 pl-12 pr-4 border border-gray-600 outline-none rounded-xl"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full gap-2 py-3 font-semibold text-white rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            <IoIosSend />
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <div className="flex justify-between text-sm text-gray-800">
            <Link
              to="/auth/login"
              className="flex items-center gap-2 text-gray-700 hover:underline"
            >
              <IoIosArrowRoundBack size={20} />
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
