import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack, IoIosSend } from "react-icons/io";
import { MdMail } from "react-icons/md";
import logoImg from "../../assets/img/auth/logo.png";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [ripple, setRipple] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(String(v).trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(
        `${API_URL}/auth/forgot-password?email=${encodeURIComponent(email)}`,
        { method: "POST" }
      );

      if (res.ok) {
        setSuccess("Check your email, we've sent reset instructions.");
        navigate(`/auth/verify?email=${encodeURIComponent(email)}`);
      } else {
        const text = await res.text();
        setErrorMsg(text || "Failed to send OTP.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // tilt léger sur la carte (même que login)
  const cardRef = useRef(null);
  const handleMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rx = ((y - r.height / 2) / r.height) * -6;
    const ry = ((x - r.width / 2) / r.width) * 6;
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
  };
  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#667eea,#764ba2)] px-4 py-8">
      {/* quelques shapes pour matcher la page login */}
      <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-white/10 shadow-lg animate-pulse-slow" />
      <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-white/10 shadow-lg animate-pulse-slow" />
      <div className="pointer-events-none absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-white/10 blur-2xl animate-orbit-slow" />
      <div className="pointer-events-none absolute -right-16 top-1/4 h-56 w-56 rounded-full bg-white/10 blur-xl animate-orbit-rev" />

      {/* Carte glass */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative z-10 w-full max-w-lg"
        style={{
          transform:
            "perspective(1000px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))",
          transition: "transform 120ms ease",
        }}
      >
        {/* halo tournant */}
        <div className="absolute -inset-0.5 rounded-[28px] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(255,255,255,.5)_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,.5)_50%,rgba(255,255,255,0)_75%,rgba(255,255,255,.5)_100%)] blur-2xl opacity-70 animate-border-spin" />

        <div className="relative overflow-hidden rounded-[28px] border border-white/30 bg-white/10 shadow-2xl backdrop-blur-2xl">
          {/* motif doux */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,#000,transparent_0.9px)] [background-size:12px_12px]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/30 mix-blend-overlay" />

          <div
            className="relative z-10 flex w-full flex-col
                       rounded-[28px] bg-white/15 p-6 ring-1 ring-white/40
                       backdrop-blur-xl backdrop-saturate-150
                       shadow-[0_8px_40px_rgba(31,38,135,0.12)]"
            style={{ isolation: "isolate" }}
          >
            {/* header */}
            <div className="mb-2 flex flex-col items-center text-center">
              <img
                src={logoImg}
                alt="Logo"
                className="mb-2 mt-2 h-[140px] w-[180px] rounded-full shadow-lg"
              />
              <h2 className="mb-2 text-2xl font-bold text-gray-800">Forgot Password?</h2>
              <p className="max-w-sm text-sm text-gray-600">
                Enter your email and we'll send a link to reset your password.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 animate-shake-soft">
                {errorMsg}
              </div>
            )}
            {success && (
              <div className="mb-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-7">
              {/* EMAIL — même champ que login, icône à l’intérieur */}
            {/* EMAIL — même champ que login, icône à l’intérieur (fix z-index) */}
<div className="group relative w-full">
  {/* shell du champ (fond/verre) */}
  <div className="absolute inset-0 z-0 rounded-xl bg-white/20 ring-1 ring-white/40 backdrop-blur-md backdrop-saturate-150 shadow-[0_8px_24px_rgba(31,38,135,0.10)]" />

  {/* icône mail AU-DESSUS de l'input */}
  <span className="pointer-events-none absolute left-3 top-1/2 z-20 -translate-y-1/2">
    <MdMail className="text-gray-600" />
  </span>

  {/* input transparent (z-10) avec padding pour l’icône */}
  <input
    type="email"
    required
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="peer relative z-10 w-full rounded-xl border-0 bg-transparent
               py-4 pl-12 pr-10 text-gray-800 outline-none placeholder:text-gray-400
               focus:ring-2 focus:ring-white/60"
    placeholder=""
  />

  {/* label flottant (au-dessus de l’input pour rester visible) */}
  <label
    className="pointer-events-none absolute left-12 top-1/2 z-20 -translate-y-1/2
               rounded bg-white/70 px-1 text-gray-600 backdrop-blur-sm
               transition-all duration-200
               peer-focus:top-0 peer-focus:text-xs peer-focus:text-gray-700
               peer-valid:top-0 peer-valid:text-sm"
  >
    Email
  </label>

  {/* check valide à droite (au-dessus aussi) */}
  {validateEmail(email) && (
    <span className="pointer-events-none absolute right-3 top-1/2 z-20 -translate-y-1/2">
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-500">
        <path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
      </svg>
    </span>
  )}

  {/* underline animé */}
  <span className="pointer-events-none absolute inset-x-3 bottom-0 z-10 h-[2px]
                   origin-left scale-x-0 bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-400
                   transition-transform duration-500 group-focus-within:scale-x-100" />
</div>


              {/* SUBMIT (ripple comme login) */}
              <button
                type="submit"
                disabled={loading}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setRipple({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                  });
                  setTimeout(() => setRipple(null), 450);
                }}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 p-3 font-semibold text-white shadow-xl backdrop-blur-md transition hover:from-purple-600 hover:to-blue-600 disabled:opacity-70"
              >
                {ripple && (
                  <span
                    className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 animate-ripple rounded-full bg-white/60"
                    style={{ left: ripple.x, top: ripple.y, width: 20, height: 20 }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-sm">
                  <IoIosSend />
                  {loading ? "Sending..." : "Send Reset Link"}
                </span>
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/30 mix-blend-overlay transition group-hover:translate-x-0" />
              </button>

              {/* Back link */}
              <div className="flex justify-between text-sm text-gray-800">
                <Link
                  to="/auth/login"
                  className="flex items-center gap-2 font-semibold text-gray-700 hover:text-blue-600 hover:underline"
                >
                  <IoIosArrowRoundBack size={22} />
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Animations identiques à la page login */}
      <style jsx>{`
        @keyframes pulse-slow { 0%,100%{transform:translateY(0) scale(1);opacity:.5;} 50%{transform:translateY(-20px) scale(1.05);opacity:.9;} }
        .animate-pulse-slow { animation: pulse-slow 7s ease-in-out infinite; }

        @keyframes orbit { 0%{transform:rotate(0deg) translateX(12px) rotate(0deg);} 100%{transform:rotate(360deg) translateX(12px) rotate(-360deg);} }
        .animate-orbit-slow { animation: orbit 20s linear infinite; }
        .animate-orbit-rev { animation: orbit 26s linear infinite reverse; }

        @keyframes border-spin { to { transform: rotate(360deg); } }
        .animate-border-spin { animation: border-spin 18s linear infinite; }

        @keyframes shake-soft { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-4px)} 40%{transform:translateX(4px)} 60%{transform:translateX(-3px)} 80%{transform:translateX(3px)} }
        .animate-shake-soft { animation: shake-soft .35s ease-in-out; }

        @keyframes ripple { from{width:0;height:0;opacity:.6;filter:blur(0px);} to{width:600px;height:600px;opacity:0;filter:blur(2px);} }
        .animate-ripple { animation: ripple .45s ease-out forwards; }
      `}</style>
    </div>
  );
}
