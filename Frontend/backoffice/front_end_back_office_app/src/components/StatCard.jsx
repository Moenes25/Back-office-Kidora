import React, { useEffect, useRef, useState } from "react";

// --- hook: compter jusqu'au chiffre (sans lib)
function useCountUp(target, duration = 900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setVal(Math.round(target * ease(t)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

// --- hook: petite anim d'entrée à l'apparition
function useReveal() {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (setShow(true), io.unobserve(e.target))),
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, show };
}

/**
 * props:
 * - title: string
 * - value: number
 * - icon: ReactNode
 * - color: 'indigo' | 'purple' | 'sky' | 'emerald' | 'rose' | 'orange'
 */
export default function StatCard({ title, value, icon, color = "indigo" }) {
  const { ref, show } = useReveal();
  const count = useCountUp(value);

  // bulles de couleur pour l’icône
  const bubble =
    color === "indigo"  ? "from-indigo-500 to-purple-500" :
    color === "purple"  ? "from-purple-500 to-pink-500"   :
    color === "sky"     ? "from-sky-400 to-indigo-500"    :
    color === "emerald" ? "from-emerald-400 to-green-600" :
    color === "rose"    ? "from-rose-400 to-pink-600"     :
                          "from-orange-400 to-amber-600";

  return (
    <div
      ref={ref}
      className={[
        "group relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm",
        "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl",
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      ].join(" ")}
    >
      {/* halo animé */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute -inset-24 bg-gradient-to-br from-transparent via-white/40 to-transparent blur-2xl" />
      </div>

      <div className="flex items-center gap-3">
        {/* pastille icône */}
        <div className={`relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${bubble}`}>
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-400">
            <span className="absolute inset-0 rounded-full animate-ping bg-emerald-400/60" />
          </span>
          <div className="scale-100 transition-transform duration-300 group-hover:scale-110 text-white">
            {icon}
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {title}
          </span>
          <span className="text-2xl font-extrabold tabular-nums">{count}</span>
        </div>
      </div>

      {/* soulignement animé */}
      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-gray-100">
        <div className={`h-1 w-1/2 rounded-full bg-gradient-to-r ${bubble} transition-[transform] duration-700 group-hover:translate-x-1/2`} />
      </div>
    </div>
  );
}
