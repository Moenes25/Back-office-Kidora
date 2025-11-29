import { useState } from "react";
import { register } from "api/mockAuth";
import { Link, useNavigate } from "react-router-dom";
import FloatingInput from "components/fields/FloatingInput";
import FloatingSelect from "components/fields/FloatingSelect";
import logoImg from "../../assets/img/auth/logo.png";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "Staff", // Staff | Admin | Super Admin
    accessCode: "", // only used for Super Admin flow
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    // Basic validation
    if (!form.username.trim() || !form.email.trim() || !form.password) {
      setMsg("Please fill in required fields (username, email, password).");
      setLoading(false);
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!emailOk) {
      setMsg("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    if (form.password !== form.confirmPassword) {
      setMsg("Passwords do not match.");
      setLoading(false);
      return;
    }
    if (form.role === "Super Admin" && !form.accessCode?.trim()) {
      // Backend must validate Admin access tokens --- demo requires non-empty
      setMsg("Registering Super Admin requires an access code.");
      setLoading(false);
      return;
    }

    try {
      // Attempt to register with backend; backend should handle roles/permissions in production
      if (typeof register === "function") {
        await register(form);
      } else {
        throw new Error("No register function");
      }
      setMsg("Account created successfully!");
      setTimeout(() => navigate("/auth/login"), 1500);
    } catch {
      // Fallback demo mode: store mocked users in localStorage
      try {
        const usersRaw = localStorage.getItem("mock_users");
        const users = usersRaw ? JSON.parse(usersRaw) : [];
        const newUser = {
          id: Date.now(),
          username: form.username,
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          role: form.role,
          // Never store plain passwords in production
          password: form.password,
        };
        users.push(newUser);
        localStorage.setItem("mock_users", JSON.stringify(users));
        setMsg("Registration saved (mock). Redirecting to login...");
        setTimeout(() => navigate("/auth/login"), 1500);
      } catch (err) {
        setMsg("Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#667eea,#764ba2)] px-4 py-12">
      {/* Floating shapes */}
      <div className="absolute rounded-full shadow-lg animate-pulse-slow left-10 top-10 h-72 w-72 bg-white/10"></div>
      <div className="absolute rounded-full shadow-lg animate-pulse-slow bottom-20 right-10 h-96 w-96 bg-white/10"></div>
      <div className="absolute w-40 h-40 rounded-full shadow-lg animate-pulse-slow bottom-16 left-16 bg-white/10"></div>
      <div className="absolute w-48 h-48 rounded-full shadow-lg animate-pulse-slow right-16 top-16 bg-white/10"></div>

      <div className="relative z-10 flex w-full max-w-lg overflow-hidden border shadow-xl rounded-3xl border-white/20 bg-white/10 backdrop-blur-xl">
        {/* LEFT SECTION – Register Form */}
        <div className="flex flex-col justify-center w-full gap-4 p-10 bg-white ">
          <div className="flex items-center justify-center w-full">
            <img src={logoImg} alt="Manage" className="w-[200px]  " />
          </div>

          {msg && <p className="text-center text-green-600 ">{msg}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role select */}
            <div className="mb-4 text-sm">
              <FloatingSelect
                id="register-role"
                name="role"
                label="Role"
                value={form.role}
                onChange={handleChange}
                options={[
                  { value: "Staff", label: "Staff" },
                  { value: "Admin", label: "Admin" },
                  { value: "Super Admin", label: "Super Admin" },
                ]}
              />
            </div>
            {form.role === "Super Admin" && (
              <FloatingInput
                id="register-access-code"
                name="accessCode"
                label="Super Admin Access Code"
                type="text"
                value={form.accessCode}
                onChange={handleChange}
              />
            )}
            <div className="flex items-center justify-between gap-4 ">
              <FloatingInput
                id="register-fullname"
                name="fullName"
                label="Full Name"
                value={form.fullName}
                onChange={handleChange}
                className="w-full"
              />
              <FloatingInput
                id="register-username"
                name="username"
                label="Username"
                value={form.username}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <FloatingInput
                id="register-phone"
                name="phone"
                label="Phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full"
              />
              <FloatingInput
                id="register-email"
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <FloatingInput
                id="register-password"
                name="password"
                label="Password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full"
              />
              <FloatingInput
                id="register-confirm-password"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <button
              disabled={loading}
              className="w-full p-3 font-semibold text-white transition rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
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
