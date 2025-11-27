// components/ai/AIIndicatorsPanel.jsx
import React, { useRef } from "react";

/* ============ Tilt 3D / Parallax ============ */
function useTilt(intensity = 9) {
  const ref = useRef(null);
  const onMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rx = ((y - r.height / 2) / r.height) * -intensity;
    const ry = ((x - r.width / 2) / r.width) * intensity;
    el.style.transform = `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  };
  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(1100px) rotateX(0) rotateY(0)";
  };
  return { ref, onMouseMove, onMouseLeave };
}

/* ============ Robot v2 (OLED + LEDs + Voice) ============ */
/* ============ BotBubble (style “rond + écran bleu”) ============ */
function BotBubble({ size = 240 }) {
  // taille responsive
  const w = size, h = size;
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 240 240"
      aria-hidden
      className="drop-shadow-[0_24px_60px_rgba(2,6,23,.25)]"
    >
      <defs>
        {/* volumes doux */}
        <radialGradient id="gWhiteVol" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </radialGradient>
        {/* bord froid (edge) */}
        <linearGradient id="gEdge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a5b4fc" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
        {/* écran OLED */}
        <radialGradient id="gVisor" cx="55%" cy="45%" r="80%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="60%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#0b2447" />
        </radialGradient>
        {/* glow cyan */}
        <filter id="fGlowCyan" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#22d3ee" floodOpacity=".55" />
        </filter>
        {/* ombre douce globale */}
        <filter id="fSoft" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="12" stdDeviation="10" floodOpacity=".18" />
        </filter>
      </defs>

      {/* ===== antenne (pulsation) ===== */}
      <g transform="translate(120,26)">
        <line x1="0" y1="0" x2="0" y2="16" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
        <circle r="8" fill="#22d3ee">
          <animate attributeName="r" values="8;10;8" dur="1.8s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* ===== tête ===== */}
      <g filter="url(#fSoft)">
        {/* calotte blanche + arête bleutée */}
        <rect x="38" y="46" width="164" height="112" rx="56" fill="url(#gWhiteVol)" stroke="url(#gEdge)" strokeWidth="3" />
        {/* écran */}
        <rect x="60" y="70" width="120" height="68" rx="34" fill="url(#gVisor)" />
        {/* reflets sur la calotte */}
        <path d="M56 76 C100 52, 140 52, 182 76" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="8" />
        <path d="M54 92 C98 70, 142 70, 186 92" fill="none" stroke="#fff" strokeOpacity=".25" strokeWidth="6" />
        {/* oreilles (capsules) */}
        <circle cx="42" cy="102" r="10" fill="url(#gEdge)" />
        <circle cx="198" cy="102" r="10" fill="url(#gEdge)" />
      </g>

      {/* yeux LED + bouche smile */}
      <g filter="url(#fGlowCyan)">
        {/* yeux ("=" qui clignotent) */}
        <rect x="88" y="96" width="20" height="10" rx="5" fill="#e0f2fe">
          <animate attributeName="height" values="10;2;10" dur="3.2s" repeatCount="indefinite" />
        </rect>
        <rect x="132" y="96" width="20" height="10" rx="5" fill="#e0f2fe">
          <animate attributeName="height" values="10;2;10" begin=".6s" dur="3.2s" repeatCount="indefinite" />
        </rect>
      </g>
      <path
        d="M96 122 Q120 136 144 122"
        fill="none"
        stroke="#b9e6fe"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* ===== bras (un qui salue) ===== */}
      {/* bras gauche - statique */}
      <g transform="translate(54,150)">
        <ellipse cx="0" cy="0" rx="18" ry="14" fill="url(#gWhiteVol)" stroke="url(#gEdge)" strokeWidth="2" />
        <ellipse cx="22" cy="6" rx="18" ry="14" fill="url(#gWhiteVol)" stroke="url(#gEdge)" strokeWidth="2" />
      </g>

      {/* bras droit - wave */}
      <g transform="translate(186,150)">
        <g>
          <ellipse cx="0" cy="0" rx="18" ry="14" fill="url(#gWhiteVol)" stroke="url(#gEdge)" strokeWidth="2" />
          <g transform="translate(-22,6)">
            <ellipse cx="0" cy="0" rx="18" ry="14" fill="url(#gWhiteVol)" stroke="url(#gEdge)" strokeWidth="2">
              <animateTransform attributeName="transform" type="rotate" values="-8;10;-8" dur="2.4s" repeatCount="indefinite" />
            </ellipse>
          </g>
        </g>
      </g>


    </svg>
  );
}


/* ============ Nuage cliquable pro ============ */
/* ============ Nuage 3D cliquable (forme nuage + 3D) ============ */
// ============ Cloud 3D ++ (épaisseur + ombres riches) ============
function Cloud3D({ label, meta, x, y, dir = 1, delayMs = 0, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group absolute grid place-items-center text-slate-800
        focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300
        transition-transform
      "
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%,-50%)",
        animation: `floaty 6.4s ease-in-out ${delayMs}ms infinite`,
        transformStyle: "preserve-3d",
        perspective: "1200px",
      }}
      aria-label={`${label} — ${meta}`}
    >
      {/* Ombre au sol plus dense */}
      <span
        aria-hidden
        className="absolute -z-10 h-5 w-[76%] rounded-full bg-slate-900/20 blur-xl opacity-90 group-hover:opacity-70 transition-opacity"
        style={{ bottom: "-10px" }}
      />

      {/* Nuage */}
      <span className="relative inline-block will-change-transform group-hover:-translate-y-0.5 transition-transform">
        <svg
          width="240"
          height="150"
          viewBox="0 0 240 120"
          aria-hidden
          className="drop-shadow-[0_28px_60px_rgba(2,6,23,.28)]"
          style={{ transform: "translateZ(8px) rotateX(0.0001deg)" }}
        >
          <defs>
            {/* base */}
            <linearGradient id="cl-base" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#eef2f7" />
            </linearGradient>
            {/* bord bleuté */}
            <linearGradient id="cl-rim" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(59,130,246,.35)" />
              <stop offset="100%" stopColor="rgba(14,165,233,.25)" />
            </linearGradient>
            {/* glossy */}
            <radialGradient id="cl-gloss" cx="30%" cy="10%" r="70%">
              <stop offset="0%" stopColor="rgba(255,255,255,.9)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>

            {/* Ombres multi-couches (profondeur) */}
            <filter id="cl-depth" x="-30%" y="-40%" width="160%" height="200%">
              {/* soft bottom */}
              <feDropShadow dx="0" dy="10" stdDeviation="8" floodOpacity="0.14" />
              {/* contact shadow */}
              <feDropShadow dx="0" dy="6" stdDeviation="3" floodOpacity="0.12" />
              {/* top ambient */}
              <feDropShadow dx="0" dy="-2" stdDeviation="2" floodColor="#60a5fa" floodOpacity="0.10" />
            </filter>

            {/* Inner shadow (occlusion autour du bord) */}
            <filter id="cl-inner" x="-20%" y="-20%" width="140%" height="140%">
              <feOffset dx="0" dy="2" />
              <feGaussianBlur stdDeviation="2.4" result="b" />
              <feComposite in="b" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.05  0 0 0 0 0.12  0 0 0 0 0.2  0 0 0 0.65 0"
              />
              <feComposite in2="SourceGraphic" operator="over" />
            </filter>

            {/* Glow de bord au hover */}
            <linearGradient id="clo" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>

          {/* forme nuage */}
          <g filter="url(#cl-depth)">
            {/* épaisseur (sous la lèvre) */}
            <path
              d="M60 84h100c21 0 38-12 38-28s-17-28-38-28c-3 0-6 .3-9 .9C145 13 129 4 112 4 94 4 79 14 74 29c-2-1-5-1-7-1-20 0-36 13-36 30S46 84 60 84Z"
              transform="translate(6,20)"
              fill="#dbe7ff"
              opacity=".28"
            />
            {/* corps */}
            <path
              d="M60 80h100c21 0 38-12 38-28s-17-28-38-28c-3 0-6 .3-9 .9C145 11 129 2 112 2 94 2 79 12 74 27c-2-1-5-1-7-1-20 0-36 13-36 30S46 80 60 80Z"
              transform="translate(6,18)"
              fill="url(#cl-base)"
              filter="url(#cl-inner)"
            />
            {/* liseré */}
            <path
              d="M60 80h100c21 0 38-12 38-28s-17-28-38-28c-3 0-6 .3-9 .9C145 11 129 2 112 2 94 2 79 12 74 27c-2-1-5-1-7-1-20 0-36 13-36 30S46 80 60 80Z"
              transform="translate(6,18)"
              fill="none"
              stroke="url(#cl-rim)"
              strokeWidth="2.2"
            />
            {/* glossy */}
            <ellipse cx="108" cy="40" rx="48" ry="18" fill="url(#cl-gloss)" />
          </g>

          {/* glow (hover) */}
          <g className="opacity-0 group-hover:opacity-100 transition-opacity">
            <path
              d="M60 80h100c21 0 38-12 38-28s-17-28-38-28c-3 0-6 .3-9 .9C145 11 129 2 112 2 94 2 79 12 74 27c-2-1-5-1-7-1-20 0-36 13-36 30S46 80 60 80Z"
              transform="translate(6,18)"
              fill="none"
              stroke="url(#clo)"
              strokeWidth="3"
              style={{ filter: "drop-shadow(0 0 14px rgba(56,189,248,.45))" }}
            />
          </g>
        </svg>

        {/* contenu surélevé */}
        <span
          className="absolute inset-0 grid place-items-center text-center pointer-events-none mt-6"
          style={{ transform: "translateZ(16px)" }}
        >
          <span className="px-3 py-2">
            <span className="inline-flex items-center gap-2 text-[15px] font-black drop-shadow">
              {label}
            </span>
            <span className="block text-[13px] font-semibold text-slate-500 mt-0.5 drop-shadow">
              {meta}
            </span>
          </span>
        </span>

        {/* sheen */}
        <span className="pointer-events-none absolute inset-0 rounded-[30px] overflow-hidden opacity-0 group-hover:opacity-100 transition">
          <span className="absolute -inset-1 animate-[sheen_2.4s_linear_infinite] bg-gradient-to-r from-transparent via-white/45 to-transparent" />
        </span>
      </span>

      {/* connecteur + ombre latérale */}
      <span
        aria-hidden
        className="absolute -z-10 left-1/2 top-1/2 h-[2px] w-[230px] origin-left rounded-full bg-gradient-to-r from-sky-300/60 to-transparent shadow-[0_8px_22px_-8px_rgba(2,6,23,.45)]"
        style={{ transform: `rotate(${dir * 12}deg)` }}
      />

      {/* ripple */}
      <span className="pointer-events-none absolute inset-0 rounded-[32px] opacity-0 group-active:opacity-100 overflow-hidden">
        <span className="absolute left-1/2 top-1/2 h-0 w-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/25 animate-[ripple_.6s_ease-out]" />
      </span>

      <style>{`
        @keyframes floaty {
          0%,100% { transform: translate(-50%,-50%) }
          50%     { transform: translate(calc(-50% + ${dir * 6}px), calc(-50% - 12px)) }
        }
        @keyframes ripple { 0% { width:0; height:0; opacity:.35 } 100% { width:220%; height:220%; opacity:0 } }
        @keyframes sheen  { 0% { transform: translateX(-120%) } 100% { transform: translateX(120%) } }
      `}</style>
    </button>
  );
}


/* ---------- HoloButton 3D ---------- */
function HoloButton3D({ href, children }) {
  const Cmp = href ? 'a' : 'button';
  return (
    <Cmp
      href={href}
      className="
        relative inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-extrabold
        text-white bg-gradient-to-br from-cyan-500 via-sky-500 to-indigo-500
        shadow-[0_22px_40px_-18px_rgba(2,6,23,.45),inset_0_-1px_0_rgba(255,255,255,.25)]
        ring-1 ring-white/25 transition will-change-transform
        hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70
      "
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* halo */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-1 rounded-2xl opacity-0 hover:opacity-100 transition"
      >
        <span className="absolute -inset-1 animate-[sheen_2.2s_linear_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </span>
      {/* ombre portée sous le bouton */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-1 left-2 right-2 h-2 rounded-full bg-black/25 blur-md"
        style={{ transform: "translateZ(-1px)" }}
      />
      {children}
    </Cmp>
  );
}

/* ---------- Token (pill) 3D ---------- */
function NeonChip({ text, icon, tone = "sky", pulse = true }) {
  const palette = {
    sky:    { bg:"from-sky-50 to-sky-100",    ring:"ring-sky-200",    glow:"shadow-[0_12px_26px_-14px_rgba(14,165,233,.55)]", dot:"bg-sky-400" },
    mint:   { bg:"from-emerald-50 to-teal-100", ring:"ring-emerald-200", glow:"shadow-[0_12px_26px_-14px_rgba(16,185,129,.55)]", dot:"bg-emerald-400" },
    violet: { bg:"from-violet-50 to-fuchsia-100", ring:"ring-violet-200", glow:"shadow-[0_12px_26px_-14px_rgba(139,92,246,.55)]", dot:"bg-fuchsia-400" },
  }[tone];

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[13px] font-extrabold select-none",
        "bg-gradient-to-b", palette.bg, "ring-1", palette.ring,
        "shadow-[inset_0_1px_0_rgba(255,255,255,.9)]", palette.glow,
      ].join(" ")}
      style={{ transform: "translateZ(6px)" }}
    >
      {/* micro led */}
      <span
        aria-hidden
        className={"relative h-1.5 w-1.5 rounded-full "+palette.dot}
        style={{ animation: pulse ? "chipPulse 2.2s ease-in-out infinite" : undefined }}
      />
      {/* icône */}
      {icon ? <span aria-hidden className="text-[13px]">{icon}</span> : null}
      {/* libellé */}
      <span className="text-slate-800">{text}</span>

      {/* léger sheen */}
      <span className="pointer-events-none absolute inset-0 rounded-xl overflow-hidden">
        <span className="absolute -inset-1 animate-[chipSheen_2.6s_linear_infinite] bg-gradient-to-r from-transparent via-white/35 to-transparent" />
      </span>

      <style>{`
        @keyframes chipSheen { 0%{ transform:translateX(-120%) } 100%{ transform:translateX(120%) } }
        @keyframes chipPulse { 0%,100%{ box-shadow:0 0 0 rgba(0,0,0,0) } 50%{ box-shadow:0 0 10px rgba(56,189,248,.8) } }
      `}</style>
    </span>
  );
}


/* ---------- Souligné néon 3D ---------- */
function UnderlineBeamPro() {
  return (
    <div className="relative my-3 h-3 w-full rounded-full overflow-hidden">
      {/* piste */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-slate-200/60 via-slate-100/40 to-slate-200/60" />
      {/* beam animé */}
      <span className="absolute inset-y-0 left-0 w-[46%] rounded-full
                       bg-gradient-to-r from-indigo-400 via-sky-400 to-cyan-300
                       animate-[beam_2.4s_linear_infinite]" />
      {/* grille fine pour le côté tech */}
      <span
        className="absolute inset-0 opacity-[.25]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(2,6,23,.2) 0 1px, transparent 1px 10px)"
        }}
      />
      {/* relief */}
      <span className="absolute inset-0 rounded-full ring-1 ring-black/5 pointer-events-none" />
      <style>{`
        @keyframes beam { 0% { transform: translateX(-120%) } 100% { transform: translateX(120%) } }
      `}</style>
    </div>
  );
}


/* ---------- Effets locaux ---------- */
function HeroFX(){return(
  <style>{`
    @keyframes sheen { 0% { transform: translateX(-120%) } 100% { transform: translateX(120%) } }
    @keyframes beam  { 0% { transform: translateX(-120%) } 100% { transform: translateX(120%) } }
  `}</style>
);}
function NeonAIButton({ href, children = "Ouvrir le chatbot" }) {
  const Cmp = href ? "a" : "button";
  return (
    <Cmp
      href={href}
      className="
        group relative inline-flex items-center gap-2 rounded-2xl px-5 py-3
        font-extrabold tracking-tight text-white
        bg-gradient-to-br from-indigo-600 via-sky-500 to-cyan-400
        shadow-[0_18px_38px_-16px_rgba(2,6,23,.55),inset_0_-1px_0_rgba(255,255,255,.25)]
        ring-1 ring-white/25
        transition-transform duration-200 will-change-transform
        hover:-translate-y-0.5 active:translate-y-0
        focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/80
      "
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* halo externe (neon) */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-2 -z-10 rounded-3xl blur-xl opacity-60
                   bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,.35),transparent_60%),radial-gradient(circle_at_80%_50%,rgba(99,102,241,.35),transparent_55%)]"
      />

      {/* bordure dégradée découpée */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl p-[1px]"
        style={{
          background:
            "linear-gradient(135deg,#60a5fa,#a78bfa 45%,#22d3ee 75%,#60a5fa)",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* highlight glossy */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,.5), rgba(255,255,255,0) 42%)",
        }}
      />

      {/* icône robot+bulb (SVG, glow) */}
      <span className="relative inline-grid h-6 w-6 place-items-center">
        <svg viewBox="0 0 56 56" className="h-5 w-5 drop-shadow">
          <defs>
            <linearGradient id="nbA" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a5b4fc" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
            <radialGradient id="nbV" cx="55%" cy="45%" r="80%">
              <stop offset="0%" stopColor="#7dd3fc" />
              <stop offset="55%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0b2447" />
            </radialGradient>
            <filter id="nbG" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="0" stdDeviation="1.6" floodColor="#22d3ee" floodOpacity=".9" />
            </filter>
          </defs>
          <g transform="translate(28,7)">
            <rect x="-1" y="0" width="2" height="6" rx="1" fill="#0f172a" opacity=".55" />
            <circle r="2.4" fill="#22d3ee">
              <animate attributeName="r" values="2.4;3;2.4" dur="1.8s" repeatCount="indefinite" />
            </circle>
          </g>
          <rect x="12" y="14" width="32" height="20" rx="9" fill="url(#nbA)" />
          <rect x="16" y="18" width="24" height="12" rx="6" fill="url(#nbV)" opacity=".95" />
          <g filter="url(#nbG)" fill="#e0f2fe">
            <rect x="21" y="22" width="5" height="3" rx="1.5">
              <animate attributeName="height" values="3;1.2;3" dur="2.4s" repeatCount="indefinite" />
            </rect>
            <rect x="30" y="22" width="5" height="3" rx="1.5">
              <animate attributeName="height" values="3;1.2;3" begin=".4s" dur="2.4s" repeatCount="indefinite" />
            </rect>
          </g>
          <path d="M21 28 Q28 32 35 28" fill="none" stroke="#b9e6fe" strokeWidth="2" strokeLinecap="round" />
        </svg>

        {/* petite LED pulsante */}
        <span
          aria-hidden
          className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-cyan-300"
          style={{ animation: "nbPulse 2s ease-in-out infinite" }}
        />
      </span>

      {children}

      {/* shimmer au survol */}
      <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 overflow-hidden">
        <span className="absolute -inset-1 animate-[nbSheen_2.2s_linear_infinite] bg-gradient-to-r from-transparent via-white/35 to-transparent" />
      </span>

      {/* ombre au sol pour le relief */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-1 left-3 right-3 h-2 rounded-full bg-black/30 blur-md"
        style={{ transform: "translateZ(-1px)" }}
      />

      {/* keyframes */}
      <style>{`
        @keyframes nbSheen { 0% { transform: translateX(-120%) } 100% { transform: translateX(120%) } }
        @keyframes nbPulse { 0%,100%{ box-shadow:0 0 0 rgba(34,211,238,0) } 50%{ box-shadow:0 0 12px rgba(34,211,238,.8) } }
      `}</style>
    </Cmp>
  );
}
function HeaderActionButton({ href, label = "Ouvrir" }) {
  const Cmp = href ? "a" : "button";
  return (
    <Cmp
      href={href}
      className="
        group relative inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5
        text-[12px] font-extrabold tracking-tight
        text-slate-900 bg-white/60 backdrop-blur-md
        ring-1 ring-white/40 shadow-[0_10px_24px_-16px_rgba(2,6,23,.55)]
        transition-transform duration-200 will-change-transform
        hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/80
      "
      style={{ transform: "translateZ(8px)" }}
    >
      {/* bordure néon animée (decoupe) */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl p-[1px]"
        style={{
          background:
            "linear-gradient(135deg,#60a5fa,#a78bfa 45%,#22d3ee 75%,#60a5fa)",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* glow externe */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-2 -z-10 rounded-2xl blur-lg opacity-60
                   bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,.35),transparent_60%),radial-gradient(circle_at_80%_50%,rgba(99,102,241,.35),transparent_55%)]"
      />

      {/* mini LED pulsante */}
      <span
        aria-hidden
        className="h-2 w-2 rounded-full bg-sky-500"
        style={{ animation: "btnLed 2.2s ease-in-out infinite" }}
      />

      {/* icône ‘spark’ robotique */}
      <svg viewBox="0 0 20 20" className="h-[14px] w-[14px]">
        <path d="M10 1.5l1.8 3.7 4.1.6-3 2.9.7 4.1-3.6-1.9-3.6 1.9.7-4.1-3-2.9 4.1-.6L10 1.5Z"
              fill="url(#g1)"/>
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee"/><stop offset="100%" stopColor="#818cf8"/>
          </linearGradient>
        </defs>
      </svg>

      {label}

      {/* sheen au survol */}
      <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 overflow-hidden">
        <span className="absolute -inset-1 animate-[btnSheen_2.1s_linear_infinite] bg-gradient-to-r from-transparent via-white/45 to-transparent" />
      </span>

      {/* ombre de contact */}
      <span aria-hidden className="pointer-events-none absolute -bottom-1 left-3 right-3 h-2 rounded-full bg-black/25 blur-md" />

      <style>{`
        @keyframes btnSheen { 0% { transform: translateX(-120%) } 100% { transform: translateX(120%) } }
        @keyframes btnLed { 0%,100%{ box-shadow:0 0 0 rgba(34,211,238,0) } 50%{ box-shadow:0 0 10px rgba(34,211,238,.9) } }
      `}</style>
    </Cmp>
  );
}

/* =======================
   Header FX (animations)
======================= */
function HeaderFX() {
  return (
    <style>{`
      @keyframes scanLine { from{transform:translateX(-120%)} to{transform:translateX(120%)} }
      @keyframes floatSm  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
      @keyframes pulseRing{
        0%{ transform:scale(0.9); opacity:.55 }
        70%{ transform:scale(1.2); opacity:0 }
        100%{ transform:scale(1.2); opacity:0 }
      }
      @keyframes glowDot {
        0%,100%{ box-shadow: 0 0 0 rgba(56,189,248,0) }
        50%    { box-shadow: 0 0 18px rgba(56,189,248,.6) }
      }
      @media (prefers-reduced-motion: reduce){
        .hdr-anim{ animation:none !important }
      }
    `}</style>
  );
}

/* =======================
   Icône Header — Badge 3D
======================= */
function HeaderIcon() {
  return (
    <span
      className="
        relative inline-grid h-12 w-12 place-items-center rounded-2xl
        bg-gradient-to-br from-[#2563eb] via-[#3b82f6] to-[#06b6d4]
        ring-1 ring-white/40
        shadow-[0_18px_32px_-16px_rgba(2,6,23,.55),inset_0_1px_0_rgba(255,255,255,.55),inset_0_-10px_18px_rgba(2,6,23,.25)]
        transition-transform will-change-transform hover:-translate-y-0.5
      "
      style={{ transform: "translateZ(10px)" }}
      aria-hidden
    >
      {/* halo doux autour du badge */}
      <span className="pointer-events-none absolute -inset-2 -z-10 rounded-3xl blur-xl opacity-50 bg-cyan-400/30" />
      {/* highlight de surface */}
      <span
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,.55), rgba(255,255,255,0) 45%)",
          mask: "linear-gradient(#000,#000)",
          WebkitMask: "linear-gradient(#000,#000)",
        }}
      />
      {/* bord interne (bevel) */}
      <span className="pointer-events-none absolute inset-px rounded-[14px] ring-1 ring-white/30 shadow-[inset_0_10px_20px_rgba(255,255,255,.15)]" />

      {/* Robot SVG avec glow cyan */}
      <svg viewBox="0 0 56 56" className="h-9 w-9 drop-shadow">
        <defs>
          <linearGradient id="botA" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <radialGradient id="botVisor" cx="55%" cy="45%" r="80%">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="55%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0b2447" />
          </radialGradient>
          <filter id="botGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="0" stdDeviation="2.2" floodColor="#22d3ee" floodOpacity=".85" />
          </filter>
        </defs>

        {/* antenne */}
        <g transform="translate(28,7)">
          <rect x="-1" y="0" width="2" height="6" rx="1" fill="#0f172a" opacity=".55" />
          <circle r="2.6" fill="#22d3ee">
            <animate attributeName="r" values="2.6;3.4;2.6" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* tête */}
        <rect x="10" y="13" width="36" height="24" rx="10" fill="url(#botA)" />
        <rect x="14" y="17" width="28" height="16" rx="8" fill="url(#botVisor)" opacity=".95" />

        {/* oreilles */}
        <circle cx="10" cy="25" r="2.5" fill="url(#botA)" />
        <circle cx="46" cy="25" r="2.5" fill="url(#botA)" />

        {/* yeux + smile avec glow */}
        <g filter="url(#botGlow)" fill="#e0f2fe">
          <rect x="21" y="23" width="6" height="3" rx="1.5">
            <animate attributeName="height" values="3;1.2;3" dur="2.4s" repeatCount="indefinite" />
          </rect>
          <rect x="29" y="23" width="6" height="3" rx="1.5">
            <animate attributeName="height" values="3;1.2;3" begin=".4s" dur="2.4s" repeatCount="indefinite" />
          </rect>
        </g>
        <path d="M21 29 Q28 33 35 29" fill="none" stroke="#b9e6fe" strokeWidth="2.2" strokeLinecap="round" />
      </svg>

      {/* ombre au “sol” pour le relief */}
      <span className="pointer-events-none absolute -bottom-1 left-3 right-3 h-2 rounded-full bg-black/30 blur-md" />
    </span>
  );
}


/* =======================
   FancyHeader (créatif)
======================= */
export function FancyHeader({
  title = "Assistant IA — Enfance & Éducation",
  subtitle = "Demandez, cliquez un nuage IA ou ouvrez le chatbot pour agir.",
  icon = "🤖",        // conservé pour compat
  iconType = "bot",   // NEW: "bot" | "emoji"
  actionHref = "#chatbot",
  actionLabel = "Ouvrir",
}) {
  return (
    <header className="relative z-10 mb-6" style={{ transform: "translateZ(22px)" }}>
      <HeaderFX />

      {/* halo mesh subtil */}
      <span
        aria-hidden
        className="absolute -inset-10 -z-10 blur-3xl opacity-35"
        style={{
          background:
            "radial-gradient(60% 60% at 25% 0%, rgba(56,189,248,.22), transparent 60%), radial-gradient(50% 50% at 85% 40%, rgba(99,102,241,.18), transparent 60%)",
        }}
      />

    <div
  className="
    group relative grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl p-4
    bg-white/10 backdrop-blur-md backdrop-saturate-150
    ring-1 ring-white/20 dark:ring-white/10
    shadow-[0_22px_46px_-24px_rgba(2,6,23,.4),inset_0_1px_0_rgba(255,255,255,.5)]
  "
  style={{ transformStyle: "preserve-3d" }}
>

        {/* bordure dégradée (découpée) */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl p-[1px]"
          style={{
            background:
              "linear-gradient(135deg,#60a5fa,#a78bfa 40%,#22d3ee 70%,#60a5fa)",
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />

        {/* scanline subtile */}
        <span className="absolute left-0 right-0 top-0 h-[3px] overflow-hidden rounded-t-2xl">
          <span className="block h-full w-[40%] hdr-anim animate-[scanLine_2.2s_linear_infinite] bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        </span>

        {/* icône */}
        <div className="h-12 w-12" style={{ transform: "translateZ(10px)" }}>
          {iconType === "emoji" ? (
            <span className="inline-grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-sky-500 text-white">
              <span className="hdr-anim animate-[floatSm_3.2s_ease-in-out_infinite]">{icon}</span>
            </span>
          ) : (
            <HeaderIcon type="bot" />
          )}
        </div>

   <div className="min-w-0 px-1" style={{ transform: "translateZ(8px)" }}>
  {/* Titre : dégradé sombre lisible */}
  <h2
    className="
      text-[19px] md:text-[21px] font-black tracking-tight truncate
      text-transparent bg-clip-text
      [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] !text-transparent
    "
    style={{
      backgroundImage:
        "linear-gradient(90deg, #263f79ff 0%, #075985 45%, #312e81 100%)" // slate-900 → sky-800 → indigo-900
    }}
  >
    {title}
  </h2>

  {/* Sous-titre : dégradé sombre un peu plus doux */}
  <p
    className="
      text-[12px] truncate
      text-transparent bg-clip-text
      [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] !text-transparent
    "
    style={{
      backgroundImage:
        "linear-gradient(90deg, #334155 0%, #0ea5e9 50%, #3730a3 100%)" // slate-600 → cyan-600 → indigo-800
    }}
  >
    {subtitle}
  </p>
</div>


        {/* action */}
        <HeaderActionButton href={actionHref} label={actionLabel} />

      </div>
    </header>
  );
}



/* ============ Scene ============ */
export default function AIIndicatorsPanel({
  stats = {
    creches: { count: 128, info: "actives" },
    garderies: { count: 140, info: "actives" },
    ecoles: { count: 44, info: "actives" },
  },
  onSelect,
  links = { chatbot: "/assistant" },
}) {
  const { ref, onMouseMove, onMouseLeave } = useTilt(10);

  return (
    <section className="mt-6">
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="
          relative overflow-hidden rounded-[28px] p-6 min-h-[350px]
          bg-gradient-to-b from-slate-50 to-white border border-black/10
          shadow-[0_34px_80px_-28px_rgba(2,6,23,.28),0_14px_30px_-18px_rgba(2,6,23,.2)]
          transition-[transform,box-shadow]
        "
        style={{ transform: "perspective(1100px)" }}
      >
        {/* liseré intérieur subtil */}
  <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-white/60 mix-blend-overlay" />
  {/* ombre “au sol” sous tout le hero */}
  <span aria-hidden className="absolute -bottom-2 left-10 right-10 h-6 rounded-full bg-black/10 blur-xl" />
        {/* grid & halo */}
        <span
          aria-hidden
          className="absolute inset-0 opacity-[.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(15,23,42,.35) 0 1px, transparent 1px 22px), repeating-linear-gradient(90deg, rgba(15,23,42,.35) 0 1px, transparent 1px 22px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div aria-hidden className="absolute -inset-32 bg-gradient-to-br from-cyan-400 via-indigo-400 to-violet-400 blur-3xl opacity-20" />

        {/* header */}
<HeroFX />  {/* tu peux le garder si besoin */}
<FancyHeader  />




        {/* center */}
        <div className="relative z-10 grid grid-cols-[auto_1fr] items-center gap-6">
          {/* robot */}
          <div style={{ transform: "translateZ(16px)" }}>
            <div className="animate-[float_6s_ease-in-out_infinite]">
  <BotBubble size={280} />
</div>

            <span className="block -mt-6 h-2 w-40 mx-auto rounded-full bg-sky-500/20 blur-lg" aria-hidden />
          <NeonAIButton href={links.chatbot}>💬 Ouvrir le chatbot</NeonAIButton>


          </div>

          {/* pitch + KPIs compacts */}
       {/* pitch + KPIs compacts */}
<div className="relative inline-block w-fit mb-6" style={{ transform: "translateZ(14px)" }}>
  <UnderlineBeamPro />

  <p className="text-[15px] md:text-base font-semibold text-slate-800/95 leading-relaxed">
    Une vue IA sur vos{" "}
    <NeonChip icon="🧾" text="inscriptions" tone="sky"  />{", "}
    <NeonChip icon="💳" text="paiements"   tone="mint" />{" "}
    et <NeonChip icon="⚠️" text="alertes"  tone="violet" />.
  </p>

  <UnderlineBeamPro />
</div>

        </div>

        {/* clouds clickable */}
        <Cloud3D label="Crèche IA"   meta={`${stats.creches.count} ${stats.creches.info}`}   x={70} y={36} dir={1}  onClick={() => onSelect?.("creches")} />
<Cloud3D label="Garderie IA" meta={`${stats.garderies.count} ${stats.garderies.info}`} x={90} y={58} dir={-1} onClick={() => onSelect?.("garderies")} />
<Cloud3D label="École IA"    meta={`${stats.ecoles.count} ${stats.ecoles.info}`}    x={62} y={88} dir={1}  onClick={() => onSelect?.("ecoles")} />


        {/* frame accents */}
        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-transparent hover:ring-cyan-300/60 transition-[ring] duration-500" />

        {/* keyframes */}
        <style>{`
          @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
          @keyframes flow  { 0% { transform: translateX(-120%) } 100% { transform: translateX(120%) } }
          @keyframes sheen { 0% { transform: translateX(-120%) } 100% { transform: translateX(120%) } }
          @media (prefers-reduced-motion: reduce){ section * { animation: none !important; transition: none !important; } }
        `}</style>
      </div>
    </section>
  );
}
