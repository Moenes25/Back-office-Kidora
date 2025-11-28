import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import FloatingInput from "components/fields/FloatingInput";
import { FaLock } from "react-icons/fa6";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) navigate("/auth/forgot-password");
  }, [email, navigate]);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setOkMsg("");

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        setOkMsg("Password reset successfully. Redirecting to login...");
        setTimeout(() => navigate("/auth/login"), 1500);
      } else {
        // fallback mock update (store password in local storage)
        localStorage.setItem(`mock_password:${email}`, password);
        setOkMsg("Password reset (mock). Redirecting to login...");
        setTimeout(() => navigate("/auth/login"), 1500);
      }
    } catch {
      localStorage.setItem(`mock_password:${email}`, password);
      setOkMsg("Password reset (mock). Redirecting to login...");
      setTimeout(() => navigate("/auth/login"), 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#667eea,#764ba2)] px-4 py-12">
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h2 className="mb-4 text-center text-xl font-bold">Reset password</h2>
        <p className="mb-4 text-sm text-gray-600">
          Set a new password for {email}
        </p>

        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
        {okMsg && (
          <div className="mb-3 rounded bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {okMsg}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <FloatingInput
            id="reset-password"
            label="New password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<FaLock />}
            className="text-gray-700"
          />
          <FloatingInput
            id="reset-confirm"
            label="Confirm password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            icon={<FaLock />}
            className="text-gray-700"
          />

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              {loading ? "Saving..." : "Save password"}
            </button>
            <Link
              to="/auth/login"
              className="text-sm text-gray-600 hover:underline"
            >
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
