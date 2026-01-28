/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineX, HiOutlineMinus, HiOutlinePaperAirplane } from "react-icons/hi";




/* ---------- RobotHead (identique à ton style) ---------- */
function RobotHead({ pulsing = false, mood = "smile", speaking = false }) {
  return (
    <motion.div
      className="relative h-14 w-14 rounded-full shadow-xl ring-1 ring-white/30"
      style={{
        background:
          "radial-gradient(120% 120% at 30% 30%, #e0f2fe 0%, #bfdbfe 40%, #93c5fd 100%)",
      }}
      animate={pulsing ? { scale: [1, 1.06, 1] } : {}}
      transition={{ duration: 2.4, repeat: Infinity }}
    >
      {/* antenne + côtés */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 h-3 w-1 rounded bg-indigo-400" />
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-indigo-400 shadow" />
      <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 h-5 w-1.5 rounded bg-indigo-300" />
      <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 h-5 w-1.5 rounded bg-indigo-300" />
      <div className="absolute inset-1 rounded-full bg-white/70 backdrop-blur-sm ring-1 ring-black/5" />

      {/* yeux */}
      <motion.div
        className="absolute left-[10px] top-[15px] h-3 w-3 rounded-full bg-indigo-600 shadow-inner"
        animate={{ scaleY: [1, 0.15, 1] }}
      
      />
      <motion.div
        className="absolute right-[10px] top-[15px] h-3 w-3 rounded-full bg-indigo-600 shadow-inner"
        animate={{ scaleY: [1, 0.15, 1] }}
     
      />

      {/* bouche */}
      {mood === "smile" ? (
     <div className="absolute left-1/2 top-[28px] h-1.5 w-6 -translate-x-1/2 rounded-full bg-indigo-300" />
      ) : (
        // visage neutre (poker face)
        <div className="absolute left-1/2 top-[28px] h-1.5 w-6 -translate-x-1/2 rounded-full bg-indigo-300" />
      )}
    </motion.div>
  );
}


/* ---------- Bubble (identique) ---------- */
function Bubble({ role, children }) {
  const mine = role === "user";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={[
          "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
          mine
            ? "bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-lg"
            : "bg-white/80 text-slate-800 shadow ring-1 ring-black/5 backdrop-blur",
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}

/* ===================== Assistant ===================== */
export default function RobotAssistant({
  storageKey = "kidora_robot_chat_v1",
  ask = null, // async (text) => string
}) {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw
        ? JSON.parse(raw)
        : [{ role: "assistant", content: "Salut 👋 Je suis KidoBot. Pose-moi une question !" }];
    } catch {
      return [{ role: "assistant", content: "Salut 👋 Je suis KidoBot. Pose-moi une question !" }];
    }
  });
  const feedRef = useRef(null);

  // Persistance
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch {}
  }, [messages, storageKey]);

  // Auto-scroll
  useEffect(() => {
    if (!open) return;
    const el = feedRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open, busy]);

  // Fallback IA
  const fallbackAsk = async (q) => {
    await new Promise((r) => setTimeout(r, 600));
    const tips = [
      "J’analyse vos données en temps réel.",
      "Essayez: *\"montre-moi les établissements en alerte licence\"*",
      "Je peux aussi générer des graphiques sur la page **IA**.",
    ];
    return `Tu as demandé: **${q}**.\n\n${tips[Math.floor(Math.random() * tips.length)]}`;
  };

  // Timeout util
  const withTimeout = (promise, ms = 20000) =>
    Promise.race([
      Promise.resolve(promise),
      new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms)),
    ]);

  const onSend = async (presetText) => {
    const text = (presetText ?? input).trim();
    if (!text || busy) return;

    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setBusy(true);

    try {
      const responder = ask ? ask(text) : fallbackAsk(text);
      const answer = await withTimeout(responder, 20000);
      setMessages((m) => [...m, { role: "assistant", content: String(answer ?? "") }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Oups, je n’ai pas pu répondre (réseau lent ou indisponible). Réessayez dans un instant.",
        },
      ]);
    } finally {
      // quoi qu’il arrive, on débloque l’envoi
      setBusy(false);
    }
  };

  const suggestions = [
    "Synthèse du jour",
    "Clients en retard de paiement",
    "Prochaines expirations licence",
    "Génère un graphique d'utilisation",
  ];

  return (
    <>
      {/* BOUTON FLOTTANT */}
      <motion.button
        type="button"
        onClick={() => {
          setOpen(true);
          setMinimized(false);
        }}
        aria-label="Ouvrir l'assistant"
        className="fixed bottom-5 right-5 z-[60] h-16 w-16 grid place-items-center rounded-full shadow-2xl outline-none"
        style={{
          background: "linear-gradient(135deg,#6366f1 0%,#22d3ee 60%,#0ea5e9 100%)",
          boxShadow: "0 15px 35px -15px rgba(14,165,233,.65), inset 0 2px 8px rgba(255,255,255,.35)",
        }}
        whileHover={{ y: -2, scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
      >
        <RobotHead pulsing mood="smile" />
      </motion.button>

      {/* PANEL */}
   
<AnimatePresence>
  {open && (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
      className="fixed bottom-5 right-5 z-[70] w-[min(90vw,420px)]"
    >
      <div
        className="relative overflow-hidden rounded-2xl border border-white/15 shadow-2xl backdrop-blur-xl"
        style={{ background: "linear-gradient(180deg, rgba(2,6,23,.9), rgba(15,23,42,.85))" }}
      >
        {/* halos décoratifs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-48 w-48 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-indigo-500/15 blur-3xl" />

        {/* ==== CONTENEUR EN COLONNE (header / feed / input) ==== */}
        <motion.div
  className="relative flex flex-col overflow-hidden"
  initial={false}
  animate={{ height: minimized ? 64 :  Math.min(window.innerHeight * 0.7, 560) }}
  transition={{ type: "spring", stiffness: 260, damping: 24 }}
>
          {/* HEADER */}
          <div className="flex items-center gap-3 px-3 py-2 shrink-0">
            <RobotHead pulsing={false} mood="smile" speaking={busy} />
            <div className="min-w-0">
              <div className="text-sm font-bold text-white leading-tight">KidoBot</div>
              <div className="text-[11px] text-cyan-200/80">Assistant IA • en ligne</div>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <button
                onClick={() => setMinimized((v) => !v)}
                className="rounded-md p-1 text-cyan-200/90 hover:bg-white/10"
                aria-label="Réduire"
                title="Réduire"
              >
                <HiOutlineMinus className="h-5 w-5" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-cyan-200/90 hover:bg-white/10"
                aria-label="Fermer"
                title="Fermer"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* FEED scrolle seul */}
          <div className="relative flex-1">
            {!minimized && (
              <div
                ref={feedRef}
                className="custom-scroll absolute inset-0 overflow-y-auto px-3 pb-3"
              >
                {messages.map((m, i) => (
                  <Bubble key={i} role={m.role}>
                    <span className="whitespace-pre-wrap">{m.content}</span>
                  </Bubble>
                ))}

                {busy && (
                  <div className="flex items-center gap-1 text-cyan-200/80 text-xs pl-1">
                    <span className="h-2 w-2 rounded-full bg-cyan-300 animate-pulse" />
                    KidoBot réfléchit…
                  </div>
                )}

                {/* suggestions */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => onSend(s)}
                      className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-xs text-cyan-100 hover:bg-white/10"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* INPUT toujours visible */}
          {/* INPUT — version premium */}
{!minimized && (
  <div className="border-t border-white/10 p-2 shrink-0">
    {/* cadre dégradé (sert de border) */}
    <div className="group relative rounded-2xl p-[2px] bg-gradient-to-r from-indigo-400/50 via-cyan-400/50 to-blue-400/50">
      {/* glow focus */}
      <span className="pointer-events-none absolute -inset-1 rounded-3xl opacity-0 blur-xl transition
                        group-focus-within:opacity-100
                        bg-[radial-gradient(80%_120%_at_20%_0%,rgba(34,211,238,.25),transparent_60%)]" />

      {/* zone réelle */}
      <div className="relative flex items-center gap-2 rounded-2xl bg-white/95 px-3 py-2
                      backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,.7),0_10px_30px_-18px_rgba(2,6,23,.45)]">

        {/* (optionnel) bouton pièce jointe */}
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-xl text-slate-500/70 hover:text-slate-700
                     hover:bg-slate-100 transition "
          title="Joindre un fichier"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.5 6.5v9a4.5 4.5 0 1 1-9 0v-10a3 3 0 1 1 6 0v9a1.5 1.5 0 0 1-3 0V7h2v7a.5.5 0 0 0 1 0v-7a4 4 0 1 0-8 0v10a5.5 5.5 0 1 0 11 0v-9h-2Z"/>
          </svg>
        </button>

        {/* textarea auto-grow */}
    <textarea
  value={input}
  onChange={(e) => {
    setInput(e.target.value);
    const el = e.currentTarget;
    el.style.height = "0px";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }}
  rows={1}
  placeholder="Écrivez votre question…"
  className="
    kidobot-textarea
    min-h-[36px] max-h-[120px] flex-1 resize-none
    bg-transparent text-[13.5px] leading-5 text-slate-800
    placeholder:text-slate-400 caret-cyan-500
    outline-none border-0 focus:outline-none focus:ring-0 focus:border-0
    p-0 m-0 shadow-none appearance-none
  "
  style={{ WebkitAppearance: "none" }}
/>


        {/* bouton envoyer */}
        <button
          onClick={() => onSend()}
          disabled={busy || !input.trim()}
          className="send-btn relative grid h-10 w-10 place-items-center rounded-xl
                     disabled:opacity-50 disabled:cursor-not-allowed"
          title="Envoyer"
          aria-label="Envoyer"
        >
          <HiOutlinePaperAirplane className="h-5 w-5 -translate-y-[1px]" color="white" />
        </button>
      </div>
    </div>

    {/* barre d’aide */}
    <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 px-1">
      <span>Astuce : Entrée = envoyer • Shift+Entrée = nouvelle ligne</span>
      <span className="hidden sm:inline-flex items-center gap-1">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span> en ligne
      </span>
    </div>
  </div>
)}

        </motion.div>
        {/* ==== fin colonne ==== */}
      </div>
    </motion.div>
  )}
</AnimatePresence>


      {/* Scrollbar discrète */}
      <style>{`
        .custom-scroll::-webkit-scrollbar { height: 8px; width: 8px }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(148,163,184,.3); border-radius: 9999px }
        .custom-scroll::-webkit-scrollbar-track { background: transparent }
        .send-btn{
    background: linear-gradient(135deg,#6d78ff 0%,#62ccff 100%);
    box-shadow:
      0 8px 22px -10px rgba(14,165,233,.55),
      inset 0 1px 0 rgba(255,255,255,.6),
      inset 0 -2px 8px rgba(0,0,0,.08);
    transition: transform .15s ease, filter .2s ease;
  }
  .send-btn::after{
    content:""; position:absolute; inset:0; border-radius:12px;
    background: linear-gradient(180deg,rgba(255,255,255,.35),transparent 40%);
    mix-blend-mode: soft-light; pointer-events:none;
  }
  .send-btn:hover{ transform: translateY(-1px); filter: brightness(1.05); }
  .send-btn:active{ transform: translateY(0); filter: brightness(.98); }
  /* Reset agressif pour contrer les styles globaux des inputs */
.kidobot-textarea,
.kidobot-textarea:focus {
  background: transparent !important;
  border: 0 !important;
  outline: none !important;
  box-shadow: none !important;
}

      `}</style>
    </>
  );
}
