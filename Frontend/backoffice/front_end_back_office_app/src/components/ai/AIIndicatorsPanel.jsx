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
function Cloud3D({ label, meta, x, y, dir = 1, onClick }) {
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
        animation: `floaty 6.4s ease-in-out ${Math.random() * 1000}ms infinite`,
        // perspective pour le “lift” en hover
        transformStyle: "preserve-3d",
      }}
      aria-label={`${label} — ${meta}`}
    >
      {/* Ombre au sol (donne le relief) */}
      <span
        aria-hidden
        className="absolute -z-10 h-4 w-[70%] rounded-full bg-slate-900/10 blur-md opacity-80 group-hover:opacity-60 transition-opacity"
        style={{ bottom: "-8px" }}
      />

      {/* Nuage (SVG masqué + couches) */}
      <span className="relative inline-block">
        {/* couche “puffy” principale */}
        <svg
          width="220"
          height="140"
          viewBox="0 0 220 110"
          className="drop-shadow-[0_22px_45px_rgba(2,6,23,.25)] transition-transform group-hover:-translate-y-0.5"
          aria-hidden
        >
          <defs>
            {/* dégradés */}
            <linearGradient id="cl-bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f1f5f9" />
            </linearGradient>
            <radialGradient id="cl-gloss" cx="35%" cy="15%" r="70%">
              <stop offset="0%" stopColor="rgba(255,255,255,.9)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
            {/* filtre 3D doux */}
            <filter id="cl-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity=".18" />
            </filter>
          </defs>

          {/* forme nuage (puffy path) */}
          <path
            d="M60 80h98c20 0 36-12 36-28s-16-28-36-28c-3 0-6 .3-9 .9C142 11 127 2 110 2 92 2 77 12 72 27c-2-1-5-1-7-1-19 0-35 13-35 30S46 80 60 80Z"
            transform="translate(6,18)"
            fill="url(#cl-bg)"
            filter="url(#cl-blur)"
          />

          {/* liseré bleu (bord 3D) */}
          <path
            d="M60 80h98c20 0 36-12 36-28s-16-28-36-28c-3 0-6 .3-9 .9C142 11 127 2 110 2 92 2 77 12 72 27c-2-1-5-1-7-1-19 0-35 13-35 30S46 80 60 80Z"
            transform="translate(6,18)"
            fill="none"
            stroke="rgba(59,130,246,.25)"
            strokeWidth="2"
          />

          {/* reflet glossy */}
          <ellipse cx="96" cy="40" rx="44" ry="16" fill="url(#cl-gloss)" />

          {/* halo neon discret au hover */}
          <g className="opacity-0 group-hover:opacity-100 transition-opacity">
            <path
              d="M60 80h98c20 0 36-12 36-28s-16-28-36-28c-3 0-6 .3-9 .9C142 11 127 2 110 2 92 2 77 12 72 27c-2-1-5-1-7-1-19 0-35 13-35 30S46 80 60 80Z"
              transform="translate(6,18)"
              fill="none"
              stroke="url(#clo)"
              strokeWidth="3"
              style={{ filter: "drop-shadow(0 0 10px rgba(56,189,248,.35))" }}
            />
            <linearGradient id="clo" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </g>
        </svg>

        {/* contenu texte + icône (posé “au-dessus”) */}
        <span
          className="
            absolute inset-0 grid place-items-center text-center pointer-events-none mt-6
          "
          style={{ transform: "translateZ(12px)" }}
        >
          <span className="px-3 py-2">
            <span className="inline-flex items-center gap-2 text-md font-extrabold">
             
              {label}
            </span>
            <span className="block text-[14px] font-semibold text-slate-500 mt-0.5">
              {meta}
            </span>
          </span>
        </span>

        {/* sheen animé (brillance) */}
        <span className="pointer-events-none absolute inset-0 rounded-[28px] overflow-hidden opacity-0 group-hover:opacity-100 transition">
          <span className="absolute -inset-1 animate-[sheen_2.4s_linear_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </span>
      </span>

      {/* Connecteur (vers la droite/gauche) */}
      <span
        aria-hidden
        className="absolute -z-10 left-1/2 top-1/2 h-[2px] w-[210px] origin-left rounded-full bg-gradient-to-r from-sky-300/50 to-transparent"
        style={{ transform: `rotate(${dir * 12}deg)` }}
      />

      {/* Ripple click (sur tout le nuage) */}
      <span className="pointer-events-none absolute inset-0 rounded-[30px] opacity-0 group-active:opacity-100 overflow-hidden">
        <span className="absolute left-1/2 top-1/2 h-0 w-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/20 animate-[ripple_.6s_ease-out]" />
      </span>

      <style>{`
        @keyframes floaty {
          0%,100% { transform: translate(-50%,-50%) }
          50%     { transform: translate(calc(-50% + ${dir * 6}px), calc(-50% - 10px)) }
        }
        @keyframes ripple {
          0% { width:0; height:0; opacity:.35 }
          100% { width:200%; height:200%; opacity:0 }
        }
        @keyframes sheen {
          0% { transform: translateX(-120%) }
          100% { transform: translateX(120%) }
        }
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
function TokenPill({ text, tone = "sky", glow = true }) {
  const palette = {
    sky:   ["from-sky-50 to-sky-100", "ring-sky-200", "text-slate-800"],
    mint:  ["from-emerald-50 to-teal-100","ring-emerald-200","text-slate-800"],
    violet:["from-violet-50 to-fuchsia-100","ring-violet-200","text-slate-800"],
  }[tone];
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-xl px-2 py-4 text-[18px] font-extrabold
        bg-gradient-to-b ${palette[0]} ring-1 ${palette[1]} ${palette[2]} select-none
        shadow-[0_10px_20px_-12px_rgba(2,6,23,.35),inset_0_1px_0_rgba(255,255,255,.9)]
      `}
      style={glow ? { boxShadow: "0 10px 20px -12px rgba(2,6,23,.35), 0 0 0 2px rgba(14,165,233,.08) inset" } : {}}
    >
      {text}
    </span>
  );
}

/* ---------- Souligné néon 3D ---------- */
function UnderlineBeam() {
  return (
    <div className="mt-4 mb-4 h-4 w-full rounded-full bg-black/10 relative overflow-hidden">
      <span
        className="absolute inset-y-0 left-0 w-[48%] rounded-full
                   bg-gradient-to-r from-indigo-400 via-sky-400 to-cyan-400 animate-[beam_2.4s_linear_infinite]"
      />
      {/* relief */}
      <span className="absolute inset-0 ring-1 ring-black/5 rounded-full pointer-events-none" />
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

/* =======================
   Header IA — 3D / Neon
======================= */
function HeaderFX() {
  return (
    <style>{`
      @keyframes scanLine { from{transform:translateX(-120%)} to{transform:translateX(120%)} }
      @keyframes sheen    { from{transform:translateX(-120%)} to{transform:translateX(120%)} }
      @keyframes floatSm  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
      @media (prefers-reduced-motion: reduce){
        .hdr-anim{ animation:none !important }
      }
    `}</style>
  );
}

export function FancyHeader({
  title = "Assistant IA — Enfance & Éducation",
  subtitle = "Demandez, cliquez un nuage IA ou ouvrez le chatbot pour agir.",
  icon = "🤖",
}) {
  return (
    <header className="relative z-10 mb-6" style={{ transform: "translateZ(22px)" }}>
      <HeaderFX />

      {/* halo doux derrière le cartouche */}
      <span
        aria-hidden
        className="absolute -inset-10 -z-10 blur-3xl opacity-40"
        style={{
          background:
            "radial-gradient(60% 60% at 25% 0%, rgba(56,189,248,.22), transparent 60%), radial-gradient(50% 50% at 85% 40%, rgba(99,102,241,.20), transparent 60%)",
        }}
      />

      {/* carte 3D avec bordure gradient */}
      <div
        className="
          group relative inline-flex items-center gap-3 rounded-2xl p-4 pr-3
          bg-white/75 backdrop-blur
          shadow-[0_24px_48px_-24px_rgba(2,6,23,.45),inset_0_1px_0_rgba(255,255,255,.8)]
        "
        style={{
          boxShadow:
            "inset 0 -1px 0 rgba(2,6,23,.06), 0 18px 40px -22px rgba(2,6,23,.36)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* bordure néon dégradée */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl p-[1px]"
          style={{
            background:
              "linear-gradient(135deg,#60a5fa, #a78bfa 40%, #22d3ee 70%, #60a5fa)",
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />

        {/* scan line subtile en haut */}
        <span className="absolute left-0 right-0 top-0 h-[3px] overflow-hidden rounded-t-2xl">
          <span className="block h-full w-[40%] hdr-anim animate-[scanLine_2.2s_linear_infinite] bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        </span>

        {/* avatar / puce IA */}
        <span
          className="
            inline-grid h-11 w-11 place-items-center rounded-xl
            bg-gradient-to-br from-indigo-500 via-violet-500 to-sky-500 text-white
            shadow-[0_12px_26px_-12px_rgba(2,6,23,.55)] ring-1 ring-white/40
          "
          style={{ transform: "translateZ(10px)" }}
        >
          <span className="hdr-anim animate-[floatSm_3.2s_ease-in-out_infinite]">
            {icon}
          </span>
        </span>

        {/* textes */}
        <div className="px-1 py-1 pr-2 leading-tight" style={{ transform: "translateZ(8px)" }}>
          <h2 className="text-[19px] md:text-[21px] font-black tracking-tight">
            <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          <p className="text-[12px] text-slate-600/90">{subtitle}</p>
        </div>

        {/* bouton secondaire (action rapide) */}
        <a
          href="#chatbot"
          className="
            relative ml-2 hidden sm:inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5
            text-[12px] font-extrabold text-slate-900
            bg-white/70 ring-1 ring-black/10
            shadow-[0_10px_20px_-14px_rgba(2,6,23,.45)]
            hover:-translate-y-0.5 transition
          "
          style={{ transform: "translateZ(8px)" }}
        >
          <span className="text-sky-600">●</span> Ouvrir
          {/* sheen */}
          <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 overflow-hidden">
            <span className="absolute -inset-1 hdr-anim animate-[sheen_2.2s_linear_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </span>
        </a>
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
<FancyHeader />



        {/* center */}
        <div className="relative z-10 grid grid-cols-[auto_1fr] items-center gap-6">
          {/* robot */}
          <div style={{ transform: "translateZ(16px)" }}>
            <div className="animate-[float_6s_ease-in-out_infinite]">
  <BotBubble size={280} />
</div>

            <span className="block -mt-6 h-2 w-40 mx-auto rounded-full bg-sky-500/20 blur-lg" aria-hidden />
            <a
              href={links.chatbot}
              className="mt-0 inline-flex items-center gap-2 rounded-2xl px-6 py-4 text-sm font-extrabold text-white
                         bg-gradient-to-br from-cyan-500 via-sky-500 to-indigo-500
                         shadow-[0_14px_30px_-16px_rgba(2,6,23,.4)] hover:-translate-y-0.5 transition
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ml-12"
            >
              💬 Ouvrir le chatbot
              <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 overflow-hidden">
                <span className="absolute -inset-1 animate-[sheen_2s_linear_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              </span>
            </a>

          </div>

          {/* pitch + KPIs compacts */}
          <div className="relative inline-block w-fit mb-6" style={{ transform: "translateZ(14px)" }}>
            <UnderlineBeam/>
           {/* phrase avec pills 3D + micro-icônes */}
<p className="text-md md:text-base font-semibold text-slate-800 leading-relaxed">
  Une vue IA sur vos{" "}
  <TokenPill text="inscriptions" tone="sky" />{", "}
  <TokenPill text="paiements" tone="mint" />{" "}
  et <TokenPill text="alertes" tone="violet" />.
</p>

{/* barre néon épaisse et plus “tech” */}
<UnderlineBeam/>



          
          </div>
        </div>

        {/* clouds clickable */}
        <Cloud3D label="Crèche IA"   meta={`${stats.creches.count} ${stats.creches.info}`}   x={70} y={16} dir={1}  onClick={() => onSelect?.("creches")} />
<Cloud3D label="Garderie IA" meta={`${stats.garderies.count} ${stats.garderies.info}`} x={86} y={58} dir={-1} onClick={() => onSelect?.("garderies")} />
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
