// src/views/admin/index.jsx (ton fichier donné)
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "components/navbar";
import Sidebar from "components/sidebar";
import Footer from "components/footer/Footer";
import routes from "routes.js";

// 👇 importe le robot
import RobotAssistant from "components/ai/RobotAssistant";

export default function Admin(props) {
  const { ...rest } = props;
  const location = useLocation();

  const [open, setOpen] = React.useState(true);
  const [collapsed, setCollapsed] = React.useState(false);
  const [currentRoute, setCurrentRoute] = React.useState("Main Dashboard");

  React.useEffect(() => {
    const onResize = () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  React.useEffect(() => {
    getActiveRoute(routes);
  }, [location.pathname]);

  const getActiveRoute = (routes) => {
    let activeRoute = "Main Dashboard";
    for (let i = 0; i < routes.length; i++) {
      if (window.location.href.indexOf(routes[i].layout + "/" + routes[i].path) !== -1) {
        setCurrentRoute(routes[i].name);
      }
    }
    return activeRoute;
  };

  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].secondary;
      }
    }
    return activeNavbar;
  };

  const getRoutes = (routes) =>
    routes.map((prop, key) =>
      prop.layout === "/admin" ? (
        <Route path={`/${prop.path}`} element={prop.component} key={key} />
      ) : null
    );

  document.documentElement.dir = "ltr";
  const mainMarginXL = collapsed
    ? "xl:ml-[calc(7rem+12px)]"
    : "xl:ml-[calc(16rem+12px)]";

  return (
    <div className="flex h-full w-full relative">
      <Sidebar
        open={open}
        collapsed={collapsed}
        onClose={() => setOpen(false)}
        onToggleCollapsed={() => setCollapsed((v) => !v)}
      />

      {open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 xl:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900 relative z-0">
        <main className={["mx-[12px] h-full flex-none transition-all md:pr-2", mainMarginXL].join(" ")}>
          <div className="h-full">
            <Navbar
              onOpenSidenav={() => setOpen(!open)}
              brandText={currentRoute}
              secondary={getActiveNavbar(routes)}
              {...rest}
            />

            <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
              <Routes>
                {getRoutes(routes)}
                <Route path="/" element={<Navigate to="/admin/default" replace />} />
              </Routes>
            </div>

            <div className="p-3">
              <Footer />
            </div>
          </div>
        </main>

        {/* 👇 le robot (global à toutes les pages) */}
        <RobotAssistant
          // Optionnel: branche ton backend ici
          // ask={async (q) => {
          //   const res = await fetch("/api/assistant", { method: "POST", body: JSON.stringify({ q }) });
          //   const { answer } = await res.json();
          //   return answer;
          // }}
        />
      </div>
    </div>
  );
}
