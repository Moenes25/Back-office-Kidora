import { useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ProfileInfo from "./components/ProfilInfo";
import Settings from "./components/Settings";
import Security from "./components/Security";
import NotificationSettings from "./components/NotifSection";
import ProfileHeader from "./ProfilHeader";
import ProfileTabs from "./ProfilTabs";
import AdminCarousel from "./components/AdminCarousel";
import Notifications from "./components/Notification";
import ActivityFeedSection from "./components/Activity";
import SuperAdminSettings from "./components/AdminSetting";





const VALID_TABS = ["profile", "settings", "security", "activity", "admin", "notification"];

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
        return <Security />;
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
      </motion.div>

       {/*  Mobile Admin Carousel */}
      <motion.section className="my-4 md:hidden">
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
      <section className="flex-col  gap-4 md:flex min-w-[233px] "> 
       
        <div className="hidden space-y-4 lg:block">
          <AdminCarousel />

          <Notifications />
        
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;





