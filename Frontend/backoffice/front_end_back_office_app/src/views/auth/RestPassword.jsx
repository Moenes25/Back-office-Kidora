import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { FaLock } from "react-icons/fa";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const [loading, setLoading] = useState(false);

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
      const API_URL = process.env.REACT_APP_API_URL;

      const res = await fetch(
        `${API_URL}/auth/reset-password?email=${encodeURIComponent(
          email
        )}&newPassword=${encodeURIComponent(password)}`,
        { method: "POST" }
      );

      if (res.ok) {
        setOkMsg("Password reset successfully. Redirecting to login...");
        setTimeout(() => navigate("/auth/login"), 1500);
      } else {
        const text = await res.text();
        setError(text || "Failed to reset password.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#667eea,#764ba2)] px-4 py-12">
      <div className="relative z-10 w-full max-w-md p-8 bg-white shadow-xl rounded-3xl">
        <h2 className="mb-4 text-xl font-bold text-center">Reset password</h2>
        <p className="mb-4 text-sm text-gray-600">
          Set a new password for {email}
        </p>

        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
        {okMsg && (
          <div className="px-3 py-2 mb-3 text-sm rounded bg-emerald-50 text-emerald-700">
            {okMsg}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-400 outline-none rounded-xl"
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-400 outline-none rounded-xl"
          />

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700"
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
