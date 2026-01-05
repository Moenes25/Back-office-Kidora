import React, { useEffect, useRef, useState } from "react";
import WidgetKids from "components/widget/Widget";
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
const COLOR_BG = {
  indigo:  "#4f46e5",
  purple:  "#8b5cf6",
  sky:     "#0ea5e9",
  emerald: "#10b981",
  rose:    "#e11d48",
  orange:  "#f59e0b",
};
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
export default function StatCard(props) {
  // compat si la page passe `stat={s}`
  const p = props.stat ? { ...props.stat, ...props } : props;
  const { title, value, icon, color = "indigo" } = p;

  return (
 <WidgetKids
  variant="solid"
  size="sm"
  fx={false}
  bg={CARD_BG[stat.id] || "#4f46e5"}
  icon={stat.icon}             // ✅ existe maintenant
  title={stat.label}
  value={stat.value}
/>

  );
}
