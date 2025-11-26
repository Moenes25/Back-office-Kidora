import { useState } from "react";
import { register } from "api/mockAuth";
import { Link, useNavigate } from "react-router-dom";
import manageImg from "../../assets/img/auth/manage.png";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      await register(form);
      setMsg("Account created successfully!");
      setTimeout(() => navigate("/auth/login"), 1500);
    } catch {
      setMsg("Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-purple-500 via-sky-600 to-blue-500 px-4 py-12">
      {/* Floating shapes */}
      <div className="animate-pulse-slow absolute left-10 top-10 h-72 w-72 rounded-full bg-white/10 shadow-lg"></div>
      <div className="animate-pulse-slow absolute bottom-20 right-10 h-96 w-96 rounded-full bg-white/10 shadow-lg"></div>
      <div className="animate-pulse-slow absolute bottom-16 left-16 h-40 w-40 rounded-full bg-white/10 shadow-lg"></div>
      <div className="animate-pulse-slow absolute right-16 top-16 h-48 w-48 rounded-full bg-white/10 shadow-lg"></div>

      <div className="relative z-10 flex w-full max-w-5xl overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-xl backdrop-blur-xl">
        {/* LEFT SECTION – Register Form */}
        <div className="flex w-full flex-col justify-center bg-white p-10 lg:w-1/2">
          <h2 className="mb-6 text-center text-3xl font-bold text-purple-700">
            Create Account
          </h2>

          {msg && <p className="mb-4 text-center text-green-600">{msg}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-gray-300 p-3"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-xl border border-gray-300 p-3"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="w-full rounded-xl border border-gray-300 p-3"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <button
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 p-3 font-semibold text-white transition hover:from-purple-600 hover:to-blue-600"
            >
              {loading ? "Creating..." : "Register"}
            </button>

            <p className="mt-4 text-center text-gray-600">
              Already have an account?{" "}
              <Link
                to="/auth/login"
                className="font-semibold text-purple-700 underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>

        {/* RIGHT SECTION – Info */}
        <div className="hidden w-1/2 flex-col justify-center bg-white/5 p-12 text-white lg:flex">
          <h1 className="mb-4 text-4xl font-bold">
            Manage Kidora the best way
          </h1>
          <p className="text-lg text-white/80">
            Create your account and get access to the best file management
            tools.
          </p>

          <div className="">
            <div className="">
              <img src={manageImg} alt="Manage" className="w-[350px] " />
            </div>
          </div>
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
