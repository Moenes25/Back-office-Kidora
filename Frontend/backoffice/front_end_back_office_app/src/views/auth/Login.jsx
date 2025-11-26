import { useState } from "react";
import { useAuth } from "context/AuthContext";
import { Link } from "react-router-dom";
import manageImg from "../../assets/img/auth/manage.png";
import logoImg from "../../assets/img/auth/logo.png";

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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-purple-500 via-sky-600 to-blue-500 px-4 py-12 ">
      {/* Floating shapes */}
      <div className="animate-pulse-slow absolute left-10 top-10 h-72 w-72 rounded-full bg-white/10 shadow-lg"></div>
      <div className="animate-pulse-slow absolute bottom-20 right-10 h-96 w-96 rounded-full bg-white/10 shadow-lg"></div>
      <div className="animate-pulse-slow absolute bottom-16 left-16 h-40 w-40 rounded-full bg-white/10 shadow-lg"></div>
      <div className="animate-pulse-slow absolute right-16 top-16 h-48 w-48 rounded-full bg-white/10 shadow-lg"></div>

      {/* Main container */}
      <div className="relative z-10 flex w-full max-w-5xl overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-xl backdrop-blur-xl">
        {/* LEFT SECTION – Info */}
        <div className="hidden w-1/2 flex-col justify-center bg-white/5 p-12 text-white lg:flex">
          <h1 className="mb-4 text-4xl font-bold">
            Manage Kidora
            <br />
            the best way
          </h1>
          <p className="text-lg leading-relaxed text-white/80">
            Manage and oversee your school projects efficiently.
          </p>

          <div className="">
            <img src={manageImg} alt="Manage" className="w-[350px] " />
          </div>
        </div>

        {/* RIGHT SECTION – Login form */}
        <div className="flex w-full flex-col justify-center bg-white p-10 lg:w-1/2">
          <h2 className="mb-6 text-center text-3xl font-bold text-purple-700">
            <img
              src={logoImg}
              alt="Manage"
              className="mx-auto mt-4 w-[100px]"
            />
            Login
          </h2>

          {errorMsg && (
            <p className="mb-4 text-center text-red-600">{errorMsg}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-purple-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-purple-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 p-3 font-semibold text-white transition hover:from-purple-600 hover:to-blue-600 "
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="mt-4 text-center text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/auth/register"
                className="font-semibold text-blue-700 underline"
              >
                Create Account
              </Link>
            </p>
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
