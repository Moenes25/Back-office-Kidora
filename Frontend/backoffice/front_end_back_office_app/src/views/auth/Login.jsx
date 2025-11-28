import { useState } from "react";
import { useAuth } from "context/AuthContext";
import { Link } from "react-router-dom";
import FloatingInput from "components/fields/FloatingInput";
import { MdMail } from "react-icons/md";
import { FaLock } from "react-icons/fa6";
import logoImg from "../../assets/img/auth/logo.png";
import { FaSignInAlt } from "react-icons/fa";

export default function Login() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      await login(email, password);
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
      <div className="animate-pulse-slow absolute left-10 top-10 h-72 w-72 rounded-full bg-white/10 shadow-lg"></div>
      <div className="animate-pulse-slow absolute bottom-20 right-10 h-96 w-96 rounded-full bg-white/10 shadow-lg"></div>
      <div className="animate-pulse-slow absolute bottom-16 left-16 h-40 w-40 rounded-full bg-white/10 shadow-lg"></div>
      <div className="animate-pulse-slow absolute right-16 top-16 h-48 w-48 rounded-full bg-white/10 shadow-lg"></div>

      {/* Main container */}
      <div className="xl relative z-10 flex w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-xl backdrop-blur-xl">
        {/* RIGHT SECTION – Login form */}
        <div className="flex w-full flex-col justify-center bg-white p-10 ">
          <div className="flex w-full items-center justify-center">
            <img src={logoImg} alt="Manage" className="w-[250px]  " />
          </div>

          {errorMsg && (
            <p className="mb-4 text-center text-red-600">{errorMsg}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <h2 className="text-transparent mb-2 bg-gradient-to-r from-indigo-500 to-sky-400 bg-clip-text text-2xl font-bold">
              Login
            </h2>
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
              className="w-full rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 p-3 font-semibold text-white transition hover:from-purple-600 hover:to-blue-600 "
            >
              <FaSignInAlt className="mr-2 inline" />
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="flex justify-between p-2 text-sm text-gray-800">
              <Link
                to="/auth/forgot-password"
                className="underline-none cursor-pointer font-semibold text-gray-700 hover:text-blueSecondary hover:underline"
              >
                Forgot Password?
              </Link>
              <Link
                to="/auth/register"
                className="underline-none cursor-pointer font-semibold text-gray-700 hover:text-red-700 hover:underline"
              >
                Don't have an account?
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

// import { useState } from "react";
// import { useAuth } from "context/AuthContext";

// export default function Login() {
//   const { login, loading } = useAuth();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMsg, setErrorMsg] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMsg("");

//     try {
//       await login(email, password);
//     } catch (error) {
//       setErrorMsg(
//         error.response?.data ||
//           "Failed to log in. Please check your credentials."
//       );
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-slate-100">
//       <div className="w-full max-w-md p-8 bg-white shadow rounded-xl">
//         <h1 className="mb-5 text-2xl font-bold text-center">
//           Kidora Super Admin
//         </h1>

//         {errorMsg && (
//           <p className="mb-3 text-center text-red-500">{errorMsg}</p>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label>Email</label>
//             <input
//               type="email"
//               className="w-full p-2 border rounded-lg"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           <div>
//             <label>Password</label>
//             <input
//               type="password"
//               className="w-full p-2 border rounded-lg"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>

//           <button
//             disabled={loading}
//             className="w-full p-2 text-white rounded-lg bg-slate-900"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
