import React from "react";
import Dropdown from "components/dropdown";
import { FiAlignJustify } from "react-icons/fi";
import { Link } from "react-router-dom";
import navbarimage from "assets/img/layout/Navbar.png";
import { BsArrowBarUp } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import { MdTranslate } from "react-icons/md";
import { HiMenu } from "react-icons/hi";

import {
  IoMdNotificationsOutline,
  IoMdInformationCircleOutline,
} from "react-icons/io";
import avatar from "assets/img/avatars/avatar4.png";

import { motion } from "framer-motion";




const sampleNotifs = [
  {
    id: "n1",
    title: "Nouvelle facture payée",
    text: "Crèche Arc-en-ciel vient de régler #F202405.",
    time: "il y a 2 min",
    unread: true,
    colorFrom: "#a78bfa",
    colorTo: "#22d3ee",
    emoji: "💳",
  },
  {
    id: "n2",
    title: "Ticket résolu",
    text: "Serveur – Maintenance clôturé par Y. Ben Ali.",
    time: "il y a 1 h",
    unread: false,
    colorFrom: "#34d399",
    colorTo: "#10b981",
    emoji: "🛠️",
  },
  {
    id: "n3",
    title: "Abonnement à renouveler",
    text: "Happy Kids • Standard annuel expire dans 7 jours.",
    time: "hier",
    unread: true,
    colorFrom: "#f59e0b",
    colorTo: "#ef4444",
    emoji: "⏳",
  },
];

const unreadCount = sampleNotifs.filter(n => n.unread).length; // adapte si tu as un state
const badgeText   = unreadCount > 99 ? "99+" : String(unreadCount);
function NotificationsPanel({
  items = sampleNotifs,
  onMarkAll = () => {},
  onOpenAll = () => {},
}) {
  // animations d'ensemble
  const container = {
    hidden: { opacity: 0, y: 6, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 220, damping: 20, staggerChildren: 0.06 }
    }
  };
  const itemVar = {
    hidden: { opacity: 0, y: 10 },
    show:   { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 18 } }
  };

  // effet tilt 3D au survol
  const handleMouse = (e, set) => {
    const b = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - b.left;        // 0 → width
    const y = e.clientY - b.top;         // 0 → height
    const rx = ((y / b.height) - 0.5) * -8; // rotationX
    const ry = ((x / b.width)  - 0.5) *  10; // rotationY
    set({ rotateX: rx, rotateY: ry });
  };

  return (
    <motion.div
  variants={container}
  initial="hidden"
  animate="show"
 className="relative w-[360px] sm:w-[420px] max-w-[90vw]
             rounded-2xl p-3 sm:p-4
             bg-white/90 backdrop-blur-xl border border-black/10
             dark:bg-slate-900/90 dark:border-white/10"
  style={{
    perspective: 900,
    boxShadow:
      "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
  }}
>
      {/* halo décoratif */}
      <div className="pointer-events-none absolute -top-20 -right-16 h-40 w-40 rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-44 w-44 rounded-full bg-cyan-400/15 blur-3xl" />

      {/* header */}
      <div className="mb-2 flex items-center justify-between">
        <div>
          <div className="text-sm font-extrabold text-slate-900 dark:text-white">Notifications</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">Mises à jour récentes</div>
        </div>
        <button
          onClick={onMarkAll}
          className="rounded-full px-3 py-1 text-[11px] font-semibold
                     bg-slate-100 text-slate-700 hover:bg-slate-200
                     dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
        >
          Tout marquer lu
        </button>
      </div>

      {/* liste */}
      <motion.ul className="space-y-3">
        {items.map((n) => (
          <TiltCard key={n.id} variants={itemVar}>
            <NotifItem {...n} />
          </TiltCard>
        ))}
      </motion.ul>

      {/* footer */}
      <div className="mt-3 sm:mt-4 flex items-center justify-between">
        <div className="text-[11px] text-slate-400 dark:text-slate-500">
          {items.filter(i => i.unread).length} non lus
        </div>
        <button
          onClick={onOpenAll}
          className="rounded-xl px-3 py-1.5 text-xs font-bold
                     bg-gradient-to-r from-indigo-600 to-sky-600 text-white
                     shadow-[0_12px_32px_rgba(37,99,235,.35)] hover:brightness-110 active:brightness-95"
        >
          Voir tout
        </button>
      </div>
    </motion.div>
  );
}

// Carte avec tilt 3D
function TiltCard({ children, variants }) {
  const [t, setT] = React.useState({ rotateX: 0, rotateY: 0 });
  return (
    <motion.li
      variants={variants}
      onMouseMove={(e) => {
        const b = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - b.left;
        const y = e.clientY - b.top;
        const rx = ((y / b.height) - 0.5) * -8;
        const ry = ((x / b.width)  - 0.5) *  10;
        setT({ rotateX: rx, rotateY: ry });
      }}
      onMouseLeave={() => setT({ rotateX: 0, rotateY: 0 })}
      style={{ transformStyle: "preserve-3d" }}
      className="group relative rounded-2xl"
    >
    <motion.div
  style={{
    transformStyle: "preserve-3d",
    boxShadow:
      "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px",
  }}
  animate={t}
  transition={{ type: "spring", stiffness: 250, damping: 18 }}
  className="relative rounded-2xl bg-white/90 border border-black/10
             px-3 py-3 sm:px-4 sm:py-3.5
             dark:bg-slate-900/80 dark:border-white/10"
>
        {/* lueur 3D */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition
                        bg-[radial-gradient(120%_120%_at_10%_0%,rgba(99,102,241,.15),transparent_60%)]" />
        {/* contenu */}
        <div style={{ transform: "translateZ(22px)" }}>
          {children}
        </div>
      </motion.div>
    </motion.li>
  );
}

// Ligne de notification
function NotifItem({ title, text, time, unread, colorFrom, colorTo, emoji }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="relative grid h-10 w-10 place-items-center rounded-xl text-white shadow-lg ring-1 ring-white/40"
        style={{ background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})` }}
      >
        <span className="text-lg">{emoji}</span>
        {unread && (
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
        )}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{title}</p>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">{time}</span>
        </div>
        <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">{text}</p>
      </div>
    </div>
  );
}


const Navbar = (props) => {
  const { onOpenSidenav, brandText } = props;
  const [darkmode, setDarkmode] = React.useState(false);
  // initialise à partir du localStorage ou de la préférence système
  React.useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;

    const wantDark = stored ? stored === "dark" : prefersDark;
    setDarkmode(wantDark);
    root.classList.toggle("dark", wantDark);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const next = !darkmode;
    setDarkmode(next);
    root.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };
  return (
  <nav className="nav-animated sticky top-2 z-40 mb-2 md:mb-2 xl:mb-3 w-full
  flex items-center justify-between rounded-xl
  bg-[linear-gradient(115deg,_#6d28d9_0%,_#7c3aed_30%,_#8b5cf6_60%,_#a78bfa_100%)]
  text-white px-2 py-1.5 md:px-3 md:py-2 shadow-xl min-h-[52px]">

      <div className="ml-[6px]">

       <p className="shrink text-xl md:text-2xl font-semibold capitalize text-white leading-none">
          <Link
            to="#"
           className="font-bold capitalize hover:opacity-90"
          >
            {brandText}
          </Link>
        </p>
      </div>

       <div
 className="relative mt-0 flex h-10 w-[330px] items-center rounded-full
 pl-0 pr-3 shadow-xl md:w-[340px]
 bg-white/90 ring-1 ring-black/5
  dark:bg-navy-800/70 dark:ring-white/10"
>
  <div
  className="flex h-full flex-1 items-center px-3 xl:w-[210px]
             rounded-full overflow-hidden
             bg-slate-100 ring-1 ring-black/5
             dark:bg-slate-800 dark:ring-white/10 mr-2" 
>
  <FiSearch className="mr-2 h-6 w-6 text-slate-400 dark:text-slate-300" />
  <input
    type="text"
    placeholder="Search..."
    className="h-7 w-full border-0 rounded-full
               bg-slate-100 text-sm font-medium text-slate-800
               placeholder:text-slate-400 outline-none focus:ring-0
               dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400
               appearance-none shadow-none"
  />
</div>

       <span className="flex cursor-pointer text-xl text-gray-600 xl:hidden leading-none mr-2"
          onClick={onOpenSidenav}
        >
          <FiAlignJustify className="h-5 w-5" />
        </span>
   <button
  type="button"
  onClick={toggleTheme}
  aria-label={darkmode ? "Passer en mode clair" : "Passer en mode sombre"}
  title={darkmode ? "Mode clair" : "Mode sombre"}
 className="flex h-8 w-8 items-center justify-center rounded-full
            bg-white text-gray-700 ring-1 ring-black/5 shadow
            hover:bg-white/90 transition active:scale-95
            dark:bg-slate-800 dark:text-white dark:ring-white/10 mr-2"
>
  {darkmode ? (
    <RiSunFill className="h-4 w-4" />
  ) : (
    <RiMoonFill className="h-4 w-4" />
  )}
</button>

<div className="ml-auto flex items-center gap-3">
        {/* start Notification */}
        <Dropdown
  button={
<button
  type="button"
  aria-label={`Notifications (${unreadCount} non lus)`}
  title="Notifications"
  className="relative grid h-8 w-8 place-items-center rounded-full
             bg-white ring-1 ring-black/5 shadow text-slate-700 hover:bg-white/90
             dark:bg-slate-800 dark:text-slate-100 dark:ring-white/10
             overflow-visible"
>
  {/* Icône au-dessus du halo */}
  <IoMdNotificationsOutline className="relative z-10 h-5 w-5" />

  {/* Halo pulse derrière l’icône */}
  {unreadCount > 0 && (
    <span
      aria-hidden
      className="pointer-events-none absolute -top-2 -right-2 h-3 w-3
                 rounded-full bg-red-500/70 animate-ping z-0"
    />
  )}

  {/* Badge rouge au-dessus de tout */}
  {unreadCount > 0 && (
   <span className="absolute -top-2 -right-2 grid place-items-center
                 min-w-[20px] h-[20px] rounded-full bg-red-600
                 text-white text-[11px] font-bold z-20 shadow-2xl
                 animate-[badgepop_.25s_ease-out]">
  {badgeText}
</span>

  )}
</button>




  }
  animation="origin-[65%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
  classNames="py-2 top-4 -left-[230px] md:-left-[420px] w-max"
>
  <NotificationsPanel
    onMarkAll={() => {
      // ici: API “mark all read” si besoin
      console.log("Tout marqué comme lu");
    }}
    onOpenAll={() => {
      // ici: navigation vers /notifications
      console.log("Voir toutes les notifications");
    }}
  />
</Dropdown>

    
        <div
          className="cursor-pointer text-gray-600"
          onClick={() => {
            if (darkmode) {
              document.body.classList.remove("dark");
              setDarkmode(false);
            } else {
              document.body.classList.add("dark");
              setDarkmode(true);
            }
          }}
        >
        
        </div>
        {/* Profile & Dropdown */}
        <Dropdown
          button={
            <img
              className="h-9 w-9 rounded-full "
              src={avatar}
              alt="Elon Musk"
            />
          }
          children={
            <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">
                    👋 Hey, Adela
                  </p>{" "}
                </div>
              </div>
              <div className="h-px w-full bg-gray-200 dark:bg-white/20 " />

              <div className="flex flex-col p-4">
                <a
                  href=" "
                  className="text-sm text-gray-800 dark:text-white hover:dark:text-white"
                >
                  Profile Settings
                </a>
                <a
                  href=" "
                  className="mt-3 text-sm text-gray-800 dark:text-white hover:dark:text-white"
                >
                  Newsletter Settings
                </a>
                <a
                  href=" "
                  className="mt-3 text-sm font-medium text-red-500 hover:text-red-500 transition duration-150 ease-out hover:ease-in"
                >
                  Log Out
                </a>
              </div>
            </div>
          }
          classNames={"py-2 top-8 -left-[180px] w-max"}
        />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
<style>{`
  .notif-scroll::-webkit-scrollbar { height: 8px; width: 8px }
  .notif-scroll::-webkit-scrollbar-thumb { background: rgba(148,163,184,.35); border-radius: 9999px }
  .notif-scroll::-webkit-scrollbar-track { background: transparent }
  @keyframes badgepop {
  0% { transform: scale(.6); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

`}</style>
