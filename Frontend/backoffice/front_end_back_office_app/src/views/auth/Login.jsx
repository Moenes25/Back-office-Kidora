import { useMemo, useRef, useState } from "react";
import { useAuth } from "context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { MdMail } from "react-icons/md";
import {
  FaLock,
  FaSignInAlt,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import logoImg from "../../assets/img/auth/logo.png";
import roketImg from "../../assets/img/auth/roket.png";

// ⚠️ remplace quand tu as ton asset local si besoin
const womanFallback =
  "https://raw.githubusercontent.com/hicodersofficial/glassmorphism-login-form/master/assets/illustration.png";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  // form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [pwdScore, setPwdScore] = useState(0); // 0..4
  const [caps, setCaps] = useState(false);
  const [womanSrc, setWomanSrc] = useState(womanFallback);

  // ripple
  const [ripple, setRipple] = useState(null);

  const validateEmail = (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(String(v).trim());

  const computePwdScore = (pwd) => {
    let s = 0;
    if (pwd.length >= 8) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    return s;
  };

  const handlePwdChange = (e) => {
    const v = e.target.value;
    setPassword(v);
    setPwdScore(computePwdScore(v));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const success = await login(email, password);
      if (success) navigate("/admin");
    } catch (error) {
      setErrorMsg(
        error?.response?.data ||
          "Failed to log in. Please check your credentials."
      );
    }
  };

  // tilt
  const cardRef = useRef(null);
  const handleMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y - rect.height / 2) / rect.height) * -6;
    const ry = ((x - rect.width / 2) / rect.width) * 6;
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
  };
  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
  };

  const pwdLabel = useMemo(
    () => (["Weak", "Okay", "Good", "Strong", "Strong"][pwdScore] || "Weak"),
    [pwdScore]
  );

  const pwdTips = useMemo(() => {
    const tips = [];
    if (password.length < 8) tips.push("8+ chars");
    if (!/[A-Z]/.test(password)) tips.push("uppercase");
    if (!/[0-9]/.test(password)) tips.push("number");
    if (!/[^A-Za-z0-9]/.test(password)) tips.push("symbol");
    return tips;
  }, [password]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#667eea,#764ba2)] px-4 py-8">
      {/* shapes existantes */}
      <div className="absolute rounded-full shadow-lg animate-pulse-slow left-10 top-10 h-72 w-72 bg-white/10" />
      <div className="absolute rounded-full shadow-lg animate-pulse-slow bottom-20 right-10 h-96 w-96 bg-white/10" />
      <div className="absolute w-40 h-40 rounded-full shadow-lg animate-pulse-slow bottom-16 left-16 bg-white/10" />
      <div className="absolute w-48 h-48 rounded-full shadow-lg animate-pulse-slow right-16 top-16 bg-white/10" />

      {/* Rocket Kid */}
      <div className="absolute z-0 flex flex-col items-center animate-fly top-20 right-32">
        <img src={roketImg} alt="Kid Rocket" className="w-64 h-auto drop-shadow-xl" />
      </div>

 

      {/* Orbes orbitants derrière la carte */}
      <div className="pointer-events-none absolute z-0 h-72 w-72 -left-20 top-1/3 rounded-full bg-white/10 blur-2xl animate-orbit-slow" />
      <div className="pointer-events-none absolute z-0 h-56 w-56 -right-16 top-1/4 rounded-full bg-white/10 blur-xl animate-orbit-rev" />

      {/* Carte */}
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
        {/* halo + gloss + blur extra */}
        <div className="absolute -inset-0.5 rounded-[28px] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(255,255,255,.5)_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,.5)_50%,rgba(255,255,255,0)_75%,rgba(255,255,255,.5)_100%)] blur-2xl opacity-70 animate-border-spin" />
        <div className="absolute -inset-px rounded-[28px] bg-white/25 backdrop-blur-[6px] [mask-image:linear-gradient(#000,#000)_top,linear-gradient(#000,#000)_bottom,radial-gradient(25px_25px_at_25px_25px,#0000_98%,#000)_top_left,radial-gradient(25px_25px_at_calc(100%-25px)_25px,#0000_98%,#000)_top_right,radial-gradient(25px_25px_at_25px_calc(100%-25px),#0000_98%,#000)_bottom_left,radial-gradient(25px_25px_at_calc(100%-25px)_calc(100%-25px),#0000_98%,#000)_bottom_right;mask-composite:exclude]" />

        <div className="relative flex w-full overflow-hidden rounded-[28px] border border-white/30 bg-white/10 shadow-2xl backdrop-blur-2xl">
          {/* pattern doux + lueur interne */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,#000,transparent_0.9px)] [background-size:12px_12px]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/30 mix-blend-overlay" />
        <div
  className="relative z-10 flex w-full flex-col justify-center
             bg-white/15 backdrop-blur-xl backdrop-saturate-150
             p-10 ring-1 ring-white/40
             shadow-[0_8px_40px_rgba(31,38,135,0.12)]
             rounded-[28px]"
  style={{ isolation: "isolate" }}
>

            <div className="mb-2 flex w-full items-center justify-center">
              <img src={logoImg} alt="Manage" className="w-[260px]" />
            </div>
            <p className="mb-6 text-center text-sm text-gray-600">
              Welcome back! Please sign in to continue.
            </p>

            {/* erreur (shake) */}
            {errorMsg && (
              <p className="mb-4 text-center text-red-600 animate-shake-soft">
                {errorMsg}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-7">
              {/* EMAIL — champ verre + animations */}
            {/* ================= EMAIL (icon INSIDE input) ================= */}
<div className="fx-field group relative w-full">
  {/* soft blur shell */}
  <span className="fx-blur pointer-events-none absolute -inset-2 -z-10 rounded-2xl opacity-0 transition-opacity duration-300 group-focus-within:opacity-100" />

  {/* icon ON TOP of the input */}
  <span className="pointer-events-none absolute left-3 top-1/2 z-20 -translate-y-1/2">
    <MdMail className="text-gray-600" />
  </span>

  {/* the input (z-10) with left padding for icon */}
  <input
    id="login-email"
    type="email"
    required
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="peer relative z-10 w-full rounded-xl border border-white/40 bg-white/30
               py-4 pl-12 pr-10 text-gray-800 outline-none transition placeholder:text-gray-400
               focus:border-transparent focus:bg-white/50 focus:shadow-lg focus:backdrop-blur-md"
  />

  {/* floating label stays above input too */}
  <label
    htmlFor="login-email"
    className="pointer-events-none absolute left-12 top-1/2 z-20 -translate-y-1/2
               rounded bg-white/70 px-1 text-gray-600 backdrop-blur-sm transition-all duration-200
               peer-focus:top-0 peer-focus:text-xs peer-focus:text-gray-700
               peer-valid:top-0 peer-valid:text-sm"
  >
    Email
  </label>

  {/* right-side check, also above */}
  <span
    className={`pointer-events-none absolute right-3 top-1/2 z-20 -translate-y-1/2 transition-opacity ${
      validateEmail(email) ? "opacity-100" : "opacity-0"
    }`}
  >
    <FaCheckCircle className="text-emerald-500 drop-shadow-sm" />
  </span>

  {/* animated underline (z-10 is fine) */}
  <span className="fx-sweep pointer-events-none absolute inset-x-3 bottom-0 z-10 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-400 transition-transform duration-500 group-focus-within:scale-x-100" />
</div>


              {/* PASSWORD — champ verre + animations */}
          {/* =============== PASSWORD (lock + eye INSIDE input) =============== */}
<div className="fx-field group relative w-full">
  <span className="fx-blur pointer-events-none absolute -inset-2 -z-10 rounded-2xl opacity-0 transition-opacity duration-300 group-focus-within:opacity-100" />

  {/* left lock icon above input */}
  <span className="pointer-events-none absolute left-3 top-1/2 z-20 -translate-y-1/2">
    <FaLock className="text-gray-600" />
  </span>

  <input
    id="login-password"
    type={showPwd ? "text" : "password"}
    required
    value={password}
    onChange={handlePwdChange}
    onKeyUp={(e) => setCaps(e.getModifierState && e.getModifierState("CapsLock"))}
    className="peer relative z-10 w-full rounded-xl border border-white/40 bg-white/30
               py-4 pl-12 pr-12 text-gray-800 outline-none transition placeholder:text-gray-400
               focus:border-transparent focus:bg-white/50 focus:shadow-lg focus:backdrop-blur-md"
  />

  <label
    htmlFor="login-password"
    className="pointer-events-none absolute left-12 top-1/2 z-20 -translate-y-1/2
               rounded bg-white/70 px-1 text-gray-600 backdrop-blur-sm transition-all duration-200
               peer-focus:top-0 peer-focus:text-xs peer-focus:text-gray-700
               peer-valid:top-0 peer-valid:text-sm"
  >
    Password
  </label>

  {/* show/hide button INSIDE the input on the right, above input */}
  <button
    type="button"
    aria-label={showPwd ? "Hide password" : "Show password"}
    onClick={() => setShowPwd((v) => !v)}
    className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded p-2 text-gray-600 transition hover:bg-white/60"
    style={{ lineHeight: 0 }}
  >
    {showPwd ? <FaEyeSlash /> : <FaEye />}
  </button>

  {/* strength meter (unchanged) */}
  <div className="mt-3">
    <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-gray-200/70 backdrop-blur-sm">
      <span
        className={`transition-all duration-500 ${
          ["w-1/12", "w-3/12", "w-6/12", "w-9/12", "w-full"][pwdScore]
        } bg-gradient-to-r from-red-400 via-yellow-400 to-green-500`}
      />
    </div>
    <div className="mt-1 flex items-center justify-between text-[11px] font-medium text-gray-500">
      <span>Strength: {pwdLabel}</span>
      {caps && (
        <span className="flex items-center gap-1 text-amber-600">
          <FaExclamationTriangle /> Caps Lock is ON
        </span>
      )}
    </div>
    {pwdScore < 3 && password && (
      <div className="mt-2 text-[11px] text-gray-500">
        Try adding: <span className="font-semibold">{pwdTips.join(" • ")}</span>
      </div>
    )}
  </div>

  <span className="fx-sweep pointer-events-none absolute inset-x-3 bottom-0 z-10 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 transition-transform duration-500 group-focus-within:scale-x-100" />
</div>

              {/* SUBMIT avec ripple */}
              <button
                disabled={loading}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setRipple({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                    t: Date.now(),
                  });
                  setTimeout(() => setRipple(null), 450);
                }}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 p-3 font-semibold text-white shadow-xl backdrop-blur-md transition hover:from-purple-600 hover:to-blue-600 disabled:opacity-70"
              >
                {/* ripple */}
                {ripple && (
                  <span
                    className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 animate-ripple rounded-full bg-white/60"
                    style={{
                      left: ripple.x,
                      top: ripple.y,
                      width: 20,
                      height: 20,
                    }}
                  />
                )}

                <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-sm">
                  <FaSignInAlt className="inline" />
                  {loading ? "Logging in..." : "Login"}
                </span>

                {/* gloss */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/30 mix-blend-overlay transition group-hover:translate-x-0" />

                {/* spinner */}
                {loading && (
                  <span className="pointer-events-none absolute right-3 top-1/2 z-10 -translate-y-1/2">
                    <span className="block h-5 w-5 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
                  </span>
                )}
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
      </div>

      {/* ===== Animations/CSS ===== */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
          50% { transform: translateY(-20px) scale(1.05); opacity: 0.9; }
        }
        .animate-pulse-slow { animation: pulse-slow 7s ease-in-out infinite; }

        @keyframes fly {
          0% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-25px) rotate(3deg); }
          100% { transform: translateY(0) rotate(-3deg); }
        }
        .animate-fly { animation: fly 6s ease-in-out infinite; }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-12px) scale(1.02); }
        }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }

        /* orbits */
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(12px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(12px) rotate(-360deg); }
        }
        .animate-orbit-slow { animation: orbit 20s linear infinite; }
        .animate-orbit-rev { animation: orbit 26s linear infinite reverse; }

        /* border spin */
        @keyframes border-spin { to { transform: rotate(360deg); } }
        .animate-border-spin { animation: border-spin 18s linear infinite; }

        /* shake error */
        @keyframes shake-soft {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
        }
        .animate-shake-soft { animation: shake-soft .35s ease-in-out; }

        /* ripple */
        @keyframes ripple {
          from { width: 0; height: 0; opacity: .6; filter: blur(0px); }
          to { width: 600px; height: 600px; opacity: 0; filter: blur(2px); }
        }
        .animate-ripple { animation: ripple .45s ease-out forwards; }

        /* ===== Effets champs (blur + reflets + sweep) ===== */
        .fx-input {
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.6),
            0 10px 20px rgba(17, 12, 46, 0.08);
          -webkit-backdrop-filter: blur(6px);
          backdrop-filter: blur(6px);
        }
        .fx-field .fx-sweep::after {
          content: "";
          position: absolute;
          left: -10%;
          bottom: -1px;
          height: 2px;
          width: 20%;
          background: linear-gradient(90deg, transparent, #fff, transparent);
          transform: translateX(-100%);
          opacity: 0;
          transition: transform .6s ease, opacity .6s ease;
        }
        .fx-field:focus-within .fx-sweep::after {
          transform: translateX(500%);
          opacity: .8;
        }
        .fx-field .fx-blur {
          background:
            radial-gradient(120px 80px at 10% 20%, rgba(255,255,255,.25), transparent 60%),
            radial-gradient(120px 80px at 90% 60%, rgba(255,255,255,.18), transparent 60%);
          -webkit-backdrop-filter: blur(10px);
          backdrop-filter: blur(10px);
        }
        .fx-field .fx-icon {
          filter: drop-shadow(0 2px 6px rgba(0,0,0,.1));
        }

        /* confetti doux (flou + opacité faible) */
        .fx-confetti {
          width: 90px; height: 90px; pointer-events: none;
          background:
            radial-gradient(4px 4px at 10% 20%, rgba(99,102,241,.7),rgba(99,102,241,0) 60%),
            radial-gradient(3px 3px at 50% 30%, rgba(236,72,153,.7),rgba(236,72,153,0) 60%),
            radial-gradient(4px 4px at 80% 70%, rgba(59,130,246,.7),rgba(59,130,246,0) 60%),
            radial-gradient(3px 3px at 30% 80%, rgba(16,185,129,.7),rgba(16,185,129,0) 60%);
          filter: blur(1px);
          opacity: .0;
          animation: confetti-pop .9s ease forwards;
        }
        @keyframes confetti-pop {
          0% { transform: translateY(0) scale(.8); opacity: 0; }
          50% { transform: translateY(-6px) scale(1); opacity: .5; }
          100% { transform: translateY(-10px) scale(1.05); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
