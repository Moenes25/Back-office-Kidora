import { useState } from "react";
import { useAuth } from "context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { MdMail } from "react-icons/md";
import { FaLock, FaSignInAlt } from "react-icons/fa";
import logoImg from "../../assets/img/auth/logo.png";
import roketImg from "../../assets/img/auth/roket.png";

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
        navigate("/admin");
      }
    } catch (error) {
      setErrorMsg(
        error.response?.data ||
          "Failed to log in. Please check your credentials."
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
      {/* Rocket Kid Animation */}
      <div className="absolute z-0 flex flex-col items-center animate-fly top-20 right-32">
        <img
          src={roketImg}
          alt="Kid Rocket"
          className="w-64 h-auto drop-shadow-xl"
        />

        {/* Speech Bubble */}
        {/* <div className="relative w-20 px-4 py-2 mt-4 font-bold text-white shadow-lg animate-talk rounded-2xl ">
          Welcome to Kidora Dashboard 
          <span className="absolute w-4 h-4 rotate-45 -top-2 left-6 bg-white/90"></span>
        </div> */}
      </div>

      {/* Main container */}
      <div className="relative z-10 flex w-full max-w-lg overflow-hidden border shadow-xl rounded-3xl border-white/20 bg-white/10 backdrop-blur-xl">
        <div className="flex flex-col justify-center w-full p-10 bg-white ">
          <div className="flex items-center justify-center w-full mb-4">
            <img src={logoImg} alt="Manage" className="w-[250px]" />
          </div>

          {errorMsg && (
            <p className="mb-4 text-center text-red-600">{errorMsg}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* ================= EMAIL INPUT ================= */}
            <div className="relative w-full">
              <MdMail className="absolute text-gray-600 -translate-y-1/2 left-4 top-1/2" />

              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-4 pl-12 pr-4 text-gray-700 bg-transparent border border-gray-300 outline-none peer rounded-xl"
              />

              <label
                htmlFor="login-email"
                className="absolute px-1 text-gray-600 transition-all duration-200 -translate-y-1/2 bg-white left-12 top-1/2 peer-valid:top-0 peer-valid:text-sm peer-valid:text-gray-600 peer-focus:top-0 peer-focus:text-xs peer-focus:text-gray-600"
              >
                Email
              </label>
            </div>

            {/* ================= PASSWORD INPUT ================= */}
            <div className="relative w-full">
              <FaLock className="absolute text-gray-600 -translate-y-1/2 left-4 top-1/2" />

              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-4 pl-12 pr-4 text-gray-700 bg-transparent border border-gray-300 outline-none peer rounded-xl"
              />

              <label
                htmlFor="login-password"
                className="absolute px-1 text-gray-600 transition-all duration-200 -translate-y-1/2 bg-white left-12 top-1/2 peer-valid:top-0 peer-valid:text-sm peer-valid:text-gray-600 peer-focus:top-0 peer-focus:text-xs peer-focus:text-gray-600"
              >
                Password
              </label>
            </div>

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
                className="font-semibold text-gray-700 hover:text-blue-600 hover:underline"
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

        /* ==== Animation of robot ==== */
        @keyframes fly {
          0% {
            transform: translateY(0) rotate(-3deg);
          }
          50% {
            transform: translateY(-25px) rotate(3deg);
          }
          100% {
            transform: translateY(0) rotate(-3deg);
          }
        }
        .animate-fly {
          animation: fly 6s ease-in-out infinite;
        }

        /* ==== Animation of text ==== */
        @keyframes typing {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
        @keyframes blink {
          50% {
            border-color: transparent;
          }
        }

        .animate-talk {
          white-space: nowrap;
          overflow: hidden;
          width: 0;
          border-right: 3px solid #764ba2;
          animation: typing 3s steps(30, end) forwards,
            blink 0.6s step-end infinite;
        }
      `}</style>
    </div>
  );
}
