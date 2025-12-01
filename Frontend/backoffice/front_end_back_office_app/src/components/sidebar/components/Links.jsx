/* eslint-disable */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import DashIcon from "components/icons/DashIcon";

const BRAND = {
  barFrom: "from-indigo-500",
  barTo: "to-blue-500",
};

export default function SidebarLinks({ routes, collapsed = false }) {
  const { pathname } = useLocation();
  const isActive = (r) => pathname.includes(`${r.layout}/${r.path}`);

  return (
     <ul className="space-y-3 px-1 w-full" data-collapsed={collapsed ? "true" : "false"}>
      {routes
        .filter((r) => ["/admin", "/auth", "/rtl"].includes(r.layout))
        .map((route, i) => {
          const active = isActive(route);

          return (
            <li key={i}>
              <Link
                to={`${route.layout}/${route.path}`}
                aria-current={active ? "page" : undefined}
             className={[
   "group relative isolate flex items-center rounded-2xl",
   // centrer en compact, étirer en ouvert
   collapsed ? "justify-center w-[56px] mx-auto px-0 py-3 gap-0"
             : "justify-start w-full px-3 py-4 gap-3",
   "border border-black/5 bg-white shadow-xl transition-all duration-300",
                  "hover:bg-indigo-300/15 hover:border-indigo-300",

                  // anneau/glow quand sélectionnée
                  "aria-[current=page]:ring-1 aria-[current=page]:ring-indigo-400/70",
                  "aria-[current=page]:ring-offset-[3px] aria-[current=page]:ring-offset-indigo-50",
                  "aria-[current=page]:shadow-[0_12px_32px_rgba(99,102,241,.28)]",
                  "w-full",
                  collapsed ? "hover:translate-x-0" : "hover:translate-x-1",
                ].join(" ")}
              >
                {/* overlay translucide à l'intérieur de la pill */}
                <span
                  aria-hidden="true"
                  className={[
                    "absolute inset-0 z-0 rounded-2xl",
                    // ajuste l’opacité ici: /10, /15, /20
                    "bg-indigo-400/15",
                    "opacity-0 group-aria-[current=page]:opacity-100",
                    "transition-opacity duration-300",
                  ].join(" ")}
                />

                {/* pastille arrondie gauche */}
                <span
                  aria-hidden="true"
                  className={[
                    "absolute -left-1.5 top-1/2 -translate-y-1/2 z-20",
                    "h-9 w-2.5 rounded-r-full bg-gradient-to-b",
                    `${BRAND.barFrom} ${BRAND.barTo}`,
                    "opacity-0 group-aria-[current=page]:opacity-100",
                    "shadow-[0_0_10px_2px_rgba(99,102,241,.45)] transition-opacity duration-300",
                    collapsed ? "hidden" : "",
                  ].join(" ")}
                />

                {/* halo doux sous la carte */}
                <span
                  aria-hidden="true"
                  className={[
                    "pointer-events-none absolute inset-0 -z-10 rounded-2xl",
                    "opacity-0 group-aria-[current=page]:opacity-100 transition-opacity duration-300",
                    "shadow-[0_20px_60px_rgba(99,102,241,.35)]",
                     collapsed ? "hidden" : "",
                  ].join(" ")}
                />

                {/* contenu au-dessus de l’overlay */}
                <span className="z-10 grid h-8 w-8 place-items-center rounded-xl border text-lg
                   bg-slate-100 border-slate-200
                   group-aria-[current=page]:bg-indigo-50 group-aria-[current=page]:border-indigo-200">
                  <span className="transition-transform duration-300 group-hover:scale-110
                    text-indigo-500 group-aria-[current=page]:text-indigo-600">
                    {route.icon ? route.icon : <DashIcon />}
                  </span>
                </span>

                {/* libellé masqué en mode compact */}
                <span
                  className="z-10 text-[15px] font-semibold text-gray-700
                             group-hover:text-indigo-700 group-aria-[current=page]:text-indigo-700
                             data-[collapsed=true]:hidden"
                  data-collapsed={collapsed ? "true" : "false"}
               >
                  {route.name}
                </span>
              </Link>
            </li>
          );
        })}
    </ul>
    
  );
}
