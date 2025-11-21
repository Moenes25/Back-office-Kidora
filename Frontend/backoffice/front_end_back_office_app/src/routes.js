import React from "react";

// Admin Imports
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";





// Auth Imports
import SignIn from "views/auth/SignIn";

// Icon Imports
import {
 MdOutlineShoppingCart,
  MdBarChart,
  MdPerson,
  MdLock,
} from "react-icons/md";
import {
  MdHome,
  MdBusiness,
  MdPsychology,
  MdPayments,
  MdSupportAgent,
  MdSettings,
} from "react-icons/md";


import CrechesPage from "views/admin/creches";
import IAPage from "views/admin/ia";
import PaiementsPage from "views/admin/paiements";
import SupportPage from "views/admin/support";
import SettingsPage from "views/admin/settings";

const routes = [
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
    {
    name: "Crèches",
    layout: "/admin",
    path: "creches",
    icon: <MdBusiness className="h-6 w-6" />,
    component: <CrechesPage />,
  },

  {
    name: "Analyse IA",
    layout: "/admin",
    path: "ia",
    icon: <MdPsychology className="h-6 w-6" />,
    component: <IAPage />,
  },

  {
    name: "Paiements & Licences",
    layout: "/admin",
    path: "paiements",
    icon: <MdPayments className="h-6 w-6" />,
    component: <PaiementsPage />,
  },

  {
    name: "Support",
    layout: "/admin",
    path: "support",
    icon: <MdSupportAgent className="h-6 w-6" />,
    component: <SupportPage />,
  },

  {
    name: "Paramètres",
    layout: "/admin",
    path: "settings",
    icon: <MdSettings className="h-6 w-6" />,
    component: <SettingsPage />,
  },
  {
    name: "NFT Marketplace",
    layout: "/admin",
    path: "nft-marketplace",
    icon: <MdOutlineShoppingCart className="h-6 w-6" />,
    component: <NFTMarketplace />,
    secondary: true,
  },

  {
    name: "Profile",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },

];
export default routes;
