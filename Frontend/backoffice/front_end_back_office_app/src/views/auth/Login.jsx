import { useState } from "react";
import { useAuth } from "context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import FloatingInput from "components/fields/FloatingInput";
import { MdMail } from "react-icons/md";
import { FaLock } from "react-icons/fa6";
import logoImg from "../../assets/img/auth/logo.png";
import { FaSignInAlt } from "react-icons/fa";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const success = await login(email, password);
      if (success) {
        console.log("✅ Login successful!"); 
        navigate("/admin"); 
      }
    } catch (error) {
      console.error("❌ Login failed:", error);
      setErrorMsg(
        error.response?.data || "Failed to log in. Please check your credentials."
      );
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
        <div className="flex flex-col justify-center w-full p-10 bg-white ">
          <div className="flex items-center justify-center w-full">
            <img src={logoImg} alt="Manage" className="w-[250px]" />
          </div>

          {errorMsg && (
            <p className="mb-4 text-center text-red-600">{errorMsg}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
           
            <FloatingInput
              id="login-email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<MdMail />}
              className="text-gray-700"
            />

            <FloatingInput
              id="login-password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<FaLock />}
              className="text-gray-700"
            />

            <button
              disabled={loading}
              className="w-full p-3 font-semibold text-white transition rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 "
            >
              <FaSignInAlt className="inline mr-2" />
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="flex justify-between p-2 text-sm text-gray-800">
              <Link
                to="/auth/forgot-password"
                className="font-semibold text-gray-700 cursor-pointer underline-none hover:text-blueSecondary hover:underline"
              >
                Forgot Password?
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
