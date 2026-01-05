/* eslint-disable */
import React from "react";

const GRADIENTS = {
  emerald: "linear-gradient(135deg,#10b981,#059669)",
  green:   "linear-gradient(135deg,#22c55e,#16a34a)",
  indigo:  "linear-gradient(135deg,#6366f1,#4338ca)",
  blue:    "linear-gradient(135deg,#3b82f6,#06b6d4)",
  amber:   "linear-gradient(135deg,#f59e0b,#fbbf24)",
  slate:   "linear-gradient(135deg,#334155,#0f172a)",
};

/* === helpers copiés depuis tes KPI (identiques) === */
function useInView(ref, rootMargin = "0px") {
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return inView;
}

function AnimatedNumber({
  value,
  duration = 800,
  format = (n) => n.toLocaleString(),
  startOnView = true,
}) {
  const spanRef = React.useRef(null);
  const inView = useInView(spanRef, "0px");
  const [display, setDisplay] = React.useState(0);

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  React.useEffect(() => {
    if (startOnView && !inView) return;
    if (prefersReduced) { setDisplay(value); return; }

    let raf, start;
    const from = 0;
    const to = Number(value) || 0;
    const ease = (t) => 1 - Math.pow(1 - t, 3); // easeOutCubic

    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      const curr = Math.round(from + (to - from) * ease(p));
      setDisplay(curr);
      if (p < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, startOnView, inView, prefersReduced]);

  return <span ref={spanRef}>{format(display)}</span>;
}

/* === WidgetKids animé === */
function WidgetKids({
  tone = "blue",
  variant = "gradient",        // ⬅️ NEW
  bg,                          // ⬅️ NEW (ex: "#22c55e")
  iconBg,                      // ⬅️ NEW (par défaut = bg)
  size = "sm",
  icon,
  title,
  value, 
  iconClass = "text-2xl",             // ← passe un nombre ici pour l’animer
  subtitle,           // compat : si number on anime, sinon on affiche tel quel
  duration = 800,
  format = (n) => n.toLocaleString(),
  startOnView = true,
  fx = true,
  style,
  ...props
}) {
  const GRADIENTS = {
    blue:   "linear-gradient(135deg,#6366f1,#06b6d4)",
    green:  "linear-gradient(135deg,#10b981,#22d3ee)",
    orange: "linear-gradient(135deg,#f59e0b,#ef4444)",
    red:    "linear-gradient(135deg,#ef4444,#f97316)",
  };
  const gradient = GRADIENTS[tone] || GRADIENTS.blue;

  const SIZES = {
    sm: { iconBox: "h-9 w-9",  icon: "text-lg", number: "text-xl",   title: "text-[11px]" },
    md: { iconBox: "h-12 w-12",icon: "text-2xl",number: "text-3xl",  title: "text-xs" },
    lg: { iconBox: "h-14 w-14",icon: "text-3xl",number: "text-4xl",  title: "text-sm" },
  };
  const SZ = SIZES[size] || SIZES.sm;

  const numeric = value ?? (typeof subtitle === "number" ? subtitle : null);

  const cardBgStyle =
    variant === "solid"
      ? { background: bg || "#22c55e" }        // plein
      : {};                                    // gradient géré par overlay

  const overlayStyle =
    variant === "solid"
      ? { display: "none" }                    // pas d’overlay en solid
      : { background: gradient, opacity: 0.25 };

  const iconStyle =
    variant === "solid"
      ? { background: iconBg || bg || "#22c55e" }
      : { background: gradient };



  return (
  <div
  className={[
    "relative overflow-hidden rounded-2xl border border-white/50",
    fx ? "bg-white/70 backdrop-blur-md" : "bg-white",   
    "shadow-[0_14px_48px_rgba(2,6,23,.12)] min-h-[110px]"
  ].join(" ")}
  style={{ ...cardBgStyle, ...style }}
  {...props}
>

    
{fx && variant !== "solid" && (
  <div className="absolute inset-0" style={{ background: gradient, opacity: 0.25 }} />
)}


{fx && (
  <>
    <div className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/60 blur-2xl kpi-float" />
    <div className="pointer-events-none absolute -left-1/3 -top-1/2 h-[220%] w-1/3 rotate-[14deg] bg-white/40 blur-md kpi-shine" />
  </>
)}


      <div className="relative z-10 flex flex-col items-center justify-center gap-1.5 p-3 text-center text-white">
        <div
          style={iconStyle}
          className={`grid place-items-center rounded-xl shadow-lg  ${SZ.iconBox}`}
        >
          {React.isValidElement(icon)
            ? React.cloneElement(icon, { className: `${icon.props.className || ""} ${SZ.icon} text-white` })
            : icon}
        </div>

        <div className={`font-extrabold tracking-tight leading-none ${SZ.number}`}>
          {numeric !== null ? (
            <AnimatedNumber
              value={Number.isFinite(numeric) ? numeric : 0}
              duration={duration}
              format={format}
              startOnView={startOnView}
            />
          ) : (
            subtitle
          )}
        </div>

        <div className={`mt-0.5 font-medium opacity-90 ${SZ.title}`}>{title}</div>
      </div>

    {fx && (
  <style>{`
    @keyframes kpiFloat { 0%{transform:translateY(0)} 50%{transform:translateY(6px)} 100%{transform:translateY(0)} }
    @keyframes kpiShine { 0%{transform:translateX(-40%)} 100%{transform:translateX(180%)} }
    .kpi-float{ animation: kpiFloat 4s ease-in-out infinite; }
    .kpi-shine{ animation: kpiShine 2.2s ease-in-out infinite; }
  `}</style>
)}

    </div>
  );
}

export default WidgetKids;