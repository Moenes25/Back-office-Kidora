import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ProfileInfo from "./pages/ProfilInfo";

import NotificationSettings from "./pages/NotifSetting";
import ProfileHeader from "./ProfilHeader";
import ProfileTabs from "./ProfilTabs";
import AdminCarousel from "./components/AdminCarousel";

import ActivityFeedSection from "./pages/activity/Activity";
import SuperAdminSettings from "./pages/admin/AdminSetting";
import Notifications from "./components/Notification";
import SecuritySettings from "./pages/security/Security";
import Settings from "./pages/setting/Settings";
import ProfileTest from "./ProfileTest";
import CreativeCalendar from "./components/AgendaModal";


//For calender
const mockActivities = {
  "2025-03-02": [
    { type: "ADMIN", region: "Tunis" },
    { type: "USER", region: "Sfax" },
  ],
  "2025-03-05": [{ type: "SYSTEM", region: "Ariana" }],
  "2025-03-12": [{ type: "ADMIN", region: "Sousse" }],
};

const VALID_TABS = [
  "profile",
  "settings",
  "security",
  "activity",
  "admin",
  "notification",
];

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const location = useLocation();
  const navigate = useNavigate();

  // Sync activeTab from URL hash on mount & when hash changes
  useEffect(() => {
    const hash = (location.hash || "").replace("#", "");
    if (hash && VALID_TABS.includes(hash) && hash !== activeTab) {
      setActiveTab(hash);
    }
  }, [location.hash]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep URL hash in sync when activeTab changes
  useEffect(() => {
    if (location.hash.replace("#", "") !== activeTab) {
      navigate(`${location.pathname}#${activeTab}`, { replace: true });
    }
  }, [activeTab, location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const renderTab = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileInfo />;
      case "settings":
        return <Settings />;
      case "security":
        return <SecuritySettings />;
      case "activity":
        return <ActivityFeedSection />;
      case "admin":
        return <SuperAdminSettings />;
      case "notification":
        return <NotificationSettings />;
      default:
        return <ProfileInfo />;
    }
  };

  return (
    <div class="grid grid-cols-3 gap-4">
      <section className="w-full col-span-3 lg:col-span-2">

          {/* Animate the header with fade + slide */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ProfileHeader />
            {/* <CreativeCalendar month="March 2025" activities={mockActivities} /> */}
        <ProfileTest />
        </motion.div>

        {/*  Mobile Admin Carousel */}
        <motion.section className="my-4 lg:hidden">
          <AdminCarousel />
        </motion.section>
        {/* Animate the tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </motion.div>

        {/* Animate the active tab content with smooth fade */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
          className=""
        >
          {renderTab()}
        </motion.div>
      </section>

      <section className="min-w-[233px]  flex-col gap-4 md:flex ">
        <div className="hidden space-y-4 lg:block">

          <AdminCarousel />

          <Notifications />
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
