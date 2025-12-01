import React from "react";

/* === Admin pages === */
import MainDashboard from "views/admin/default";
import Profile from "views/admin/profile";
import IAPage from "views/admin/ia";
import PaiementsPage from "views/admin/paiements";
import SupportPage from "views/admin/support";
import SettingsPage from "views/admin/settings";

/* === Nouvelles pages selon cahier === */
import ClientsPage from "views/admin/clients";   // liste + filtres (types, statut, commercial)
import MapsPage from "views/admin/maps";         // cartographie
import TeamPage from "views/admin/team";         // équipe & rôles (RBAC)
import ReportsPage from "views/admin/reports";   // rapports & exports
import { MdCalendarToday } from "react-icons/md"; 

/* === Auth === */
import SignIn from "views/auth/SignIn";

/* === Icons === */
import {
  MdHome,
  MdBusiness,
  MdPayments,
  MdMap,
  MdGroups,
  MdSupportAgent,
  MdBarChart,
  MdPsychology,
  MdSettings,
  MdPerson,
  MdLock,
} from "react-icons/md";

/**
 * IMPORTANT :
 * - Export par défaut = routes (le thème fait `import routes from "routes"`).
 * - Ordre et intitulés = sections du cahier des charges.
 */
const routes = [
  /* 2.1 Dashboard Général */
  {
    name: "Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },

  /* 2.2 Gestion des Clients (Garderies / Crèches / Écoles) */
  {
    name: "Entreprises",
    layout: "/admin",
    path: "Entreprises",
    icon: <MdBusiness className="h-6 w-6" />,
    component: <ClientsPage />,
  },
  // (optionnel, caché du menu) détail client :
  // { name: "Client Details", layout: "/admin", path: "clients/:id", component: <ClientDetails />, secondary: true },

  /* 2.3 Paiements & Abonnements */
  {
    name: "Calendrier",
    layout: "/admin",
    path: "calendrier",
    icon: <MdCalendarToday className="h-6 w-6" />,
    component: <PaiementsPage />,
  },



  /* 2.5 Gestion interne de l’équipe Kidora (Admins & Staff) */
  {
    name: "Équipe Kidora",
    layout: "/admin",
    path: "equipe",
    icon: <MdGroups className="h-6 w-6" />,
    component: <TeamPage />,
  },

  /* 2.6 Support & Tickets */
  {
    name: "Support & Tickets",
    layout: "/admin",
    path: "support",
    icon: <MdSupportAgent className="h-6 w-6" />,
    component: <SupportPage />,
  },

 

  /* 3. Analyse IA */
  {
    name: "Analyse IA",
    layout: "/admin",
    path: "ia",
    icon: <MdPsychology className="h-6 w-6" />,
    component: <IAPage />,
  },



];

export default routes;
