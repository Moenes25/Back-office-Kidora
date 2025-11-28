import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import FloatingInput from "components/fields/FloatingInput";
import { MdMail } from "react-icons/md";

export default function VerifyCode() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  const getStoredCode = () => {
    try {
      const raw = localStorage.getItem(`forgot_code:${email}`);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const handleVerify = async (e) => {
    e?.preventDefault();
    setError("");
    if (!email) return setError("Invalid email.");
    if (!code) return setError("Enter the verification code.");
    setChecking(true);

    try {
      // try server verification if available
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      if (res.ok) {
        navigate(`/auth/reset-password?email=${encodeURIComponent(email)}`);
        return;
      }

      // fallback localStorage verification
      const stored = getStoredCode();
      if (!stored) {
        setError("No verification code was requested for this email.");
        return;
      }
      if (Date.now() > stored.expiresAt) {
        setError("Verification code expired. Please request again.");
        return;
      }
      if (stored.code !== code) {
        setError("Invalid code. Please try again.");
        return;
      }
      // verified
      navigate(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError("Verification failed — please try again.");
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    // if no email, redirect to forgot password
    if (!email) navigate("/auth/forgot-password");
  }, [email, navigate]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#667eea,#764ba2)] px-4 py-12">
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h2 className="mb-4 text-center text-xl font-bold">Verify code</h2>
        <p className="mb-4 text-sm text-gray-600">
          Enter the 6-digit code sent to <strong>{email}</strong>.
        </p>

        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleVerify} className="space-y-4">
          <FloatingInput
            id="verify-code"
            label="Verification code"
            value={code}
            onChange={(e) => setCode(e.target.value.trim())}
            icon={<MdMail />}
            className="text-gray-700"
          />

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={checking}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
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
