import React from "react";
import Card from "components/card";

/* Palette “kids” : grosses couleurs + motifs intégrés */
const KIDS = {
  bubblegum: {
    bg: `
      linear-gradient(180deg,#ffb3c7 0%,#ffa6b8 100%),
      radial-gradient(60% 100% at 120% -20%, rgba(255,255,255,.45), transparent 60%),
      radial-gradient(80% 60% at -10% 110%, rgba(255,255,255,.35), transparent 60%),
      repeating-radial-gradient( circle at 20% 30%, rgba(255,255,255,.25) 0 6px, transparent 6px 14px )
    `,
    title: "text-[#8a1840]",
    value: "text-[#6b0f2a]",
    badge: "bg-white/50 text-[#6b0f2a]",
  },
  sunny: {
    bg: `
      linear-gradient(180deg,#ffd76b 0%,#ffc24b 100%),
      radial-gradient(70% 120% at 110% -10%, rgba(255,255,255,.4), transparent 60%),
      radial-gradient(60% 60% at -10% 100%, rgba(255,255,255,.3), transparent 60%),
      repeating-linear-gradient(45deg, rgba(255,255,255,.25) 0 10px, transparent 10px 20px)
    `,
    title: "text-[#7a4a00]",
    value: "text-[#5b3700]",
    badge: "bg-white/50 text-[#5b3700]",
  },
  sky: {
    bg: `
      linear-gradient(180deg,#8ed0ff 0%,#66c0ff 100%),
      radial-gradient(70% 120% at -10% -10%, rgba(255,255,255,.5), transparent 60%),
      radial-gradient(60% 60% at 110% 100%, rgba(255,255,255,.35), transparent 60%),
      repeating-radial-gradient( circle at 70% 30%, rgba(255,255,255,.22) 0 6px, transparent 6px 14px )
    `,
    title: "text-[#0b3f6a]",
    value: "text-[#072a46]",
    badge: "bg-white/50 text-[#072a46]",
  },
  lime: {
    bg: `
      linear-gradient(180deg,#b7f46c 0%,#9dea3e 100%),
      radial-gradient(80% 120% at 120% -30%, rgba(255,255,255,.45), transparent 60%),
      radial-gradient(80% 60% at -10% 110%, rgba(255,255,255,.35), transparent 60%),
      repeating-linear-gradient( -45deg, rgba(255,255,255,.25) 0 10px, transparent 10px 20px )
    `,
    title: "text-[#235300]",
    value: "text-[#183a00]",
    badge: "bg-white/50 text-[#183a00]",
  },
  grape: {
    bg: `
      linear-gradient(180deg,#c7a6ff 0%,#b388ff 100%),
      radial-gradient(70% 120% at -10% -10%, rgba(255,255,255,.45), transparent 60%),
      radial-gradient(60% 60% at 110% 100%, rgba(255,255,255,.35), transparent 60%),
      repeating-radial-gradient( circle at 25% 60%, rgba(255,255,255,.22) 0 6px, transparent 6px 14px )
    `,
    title: "text-[#3b2173]",
    value: "text-[#2a1653]",
    badge: "bg-white/50 text-[#2a1653]",
  },
};



const WidgetKids = ({ icon, title, subtitle, tone = "bubblegum", animated = true, delay = 0, stacked = true }) => {
  const p = KIDS[tone] ?? KIDS.bubblegum;
  const kidIcon = React.isValidElement(icon) ? React.cloneElement(icon, { className: "h-8 w-8 drop-shadow-sm" }) : icon;

  return (
    <Card
      extra={[
        "relative isolate rounded-3xl",
        "transition-transform duration-300 hover:-translate-y-1",
        "ring-0 shadow-[0_14px_30px_-10px_rgba(0,0,0,.25)]",
        "overflow-visible",
        animated ? "animate-kid-pop" : "", 
      ].join(" ")}
      style={animated ? { animationDelay: `${delay}ms` } : undefined}
    >
      <span className="pointer-events-none absolute -top-4 -right-4 rotate-12 z-10">
        <span className="inline-flex items-center justify-center rounded-2xl px-3 py-1 text-sm font-black bg-white shadow-md">
          🎈 KI DORA
        </span>
      </span>

      <div
        className={[
          "relative rounded-3xl p-5 text-left",
          "border border-black/5",
          "overflow-hidden",
        ].join(" ")}
        style={{ backgroundImage: p.bg }}
      >
        <span className="pointer-events-none absolute -left-6 bottom-4 h-20 w-20 rounded-full bg-white/35 blur-2xl" />
        <span className="pointer-events-none absolute right-6 -top-6 h-16 w-16 rounded-full bg-white/40 blur-xl" />

        <div className={stacked ? "grid place-items-center gap-3 text-center" : "flex items-center gap-4"}>
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/80 shadow-inner animate-kid-bounce">
            {kidIcon}
          </div>

          <div className={stacked ? "space-y-1" : "space-y-0.5"}>
            <p className={["text-sm font-black tracking-wide uppercase", p.title].join(" ")}>{title}</p>
            <h4 className={["text-3xl font-extrabold drop-shadow-[0_1px_0_rgba(255,255,255,.6)]", p.value].join(" ")}>
              {subtitle}
            </h4>
          </div>
        </div>

        <span
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{ background: "radial-gradient(300px 180px at 20% 0%, rgba(255,255,255,.45), transparent 60%)" }}
        />
      </div>

      <style>{`
        @keyframes kid-pop { 0%{opacity:0; transform:translateY(6px) scale(.98)} 100%{opacity:1; transform:translateY(0) scale(1)} }
        .animate-kid-pop { animation: kid-pop .35s cubic-bezier(.2,0,0,1) both; }
        @keyframes kid-bounce { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-3px) } }
        .animate-kid-bounce { animation: kid-bounce 1.8s ease-in-out infinite; }
      `}</style>
    </Card>
  );
};


export default WidgetKids;
