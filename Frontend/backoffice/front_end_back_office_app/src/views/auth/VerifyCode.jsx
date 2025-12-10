import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { MdMail } from "react-icons/md";

export default function VerifyCode() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  const handleVerify = async (e) => {
    e?.preventDefault();
    setError("");
    if (!email) return setError("Invalid email.");
    if (!code) return setError("Enter the verification code.");
    setChecking(true);

    try {
      const API_URL = process.env.REACT_APP_API_URL;

      const res = await fetch(
        `${API_URL}/auth/verify-otp?email=${encodeURIComponent(
          email
        )}&otp=${encodeURIComponent(code)}`,
        {
          method: "POST",
        }
      );

      if (res.ok) {
        navigate(`/auth/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        const text = await res.text();
        setError(text || "Verification failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Try again.");
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (!email) navigate("/auth/forgot-password");
  }, [email, navigate]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#667eea,#764ba2)] px-4 py-12">
      <div className="relative z-10 w-full max-w-md p-8 bg-white shadow-xl rounded-3xl">
        <h2 className="mb-4 text-xl font-bold text-center">Verify code</h2>
        <p className="mb-4 text-sm text-gray-600">
          Enter the 6-digit code sent to <strong>{email}</strong>.
        </p>

        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.trim())}
            placeholder="Enter verification code"
            className="w-full px-4 py-3 border border-gray-400 outline-none rounded-xl"
          />

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={checking}
              className="px-4 py-2 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700"
            >
              {checking ? "Checking..." : "Verify"}
            </button>
            <Link
              to="/auth/forgot-password"
              className="text-sm text-gray-600 hover:underline"
            >
              Resend code
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
