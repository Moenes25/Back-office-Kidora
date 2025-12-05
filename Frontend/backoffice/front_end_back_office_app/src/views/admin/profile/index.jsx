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
import AgendaModal from "./components/AgendaModal";
import ActivityFeedSection from "./components/Activity";
import SuperAdminSettings from "./components/AdminSetting";




const VALID_TABS = ["profile", "settings", "security", "activity", "admin", "notification"];

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const location = useLocation();
  const navigate = useNavigate();
  const [headerNotes, setHeaderNotes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

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
      <section className="col-span-2">
        {/* Animate the header with fade + slide */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <ProfileHeader />
      </motion.div>

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
      <section className="flex flex-col gap-4">
        <AdminCarousel />

      
          {/* Notes List */}
          <div className="relative flex flex-col w-full h-10 gap-4 p-4 pl-4 overflow-y-auto bg-white border-2 border-gray-200 rounded-lg shadow-md scrollbar-none">
            <div className="absolute w-1 rounded-full bottom-2 left-2 top-2 bg-gradient-to-b from-purple-400 to-blue-400"></div>
            {headerNotes.map((note) => (
              <div key={note.id} className="relative flex items-start gap-3">
                <div className="w-3 h-3 mt-1 rounded-full bg-gradient-to-br from-purple-400 to-blue-400"></div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {note.title}
                  </p>
                  <p className="text-xs text-gray-400">{note.date}</p>
                </div>
              </div>
            ))}

            {/* Button to open modal */}
            <button
              onClick={() => setModalOpen(true)}
              className="absolute px-3 py-1 font-bold text-white bg-purple-400 rounded-full shadow-md bottom-1 right-1 w-fit hover:bg-purple-500"
            >
              +
            </button>
          </div>
       

        {/* Modal */}
      {modalOpen && (
        <AgendaModal
          onClose={() => setModalOpen(false)}
          onSave={(note) => setHeaderNotes((prev) => [...prev, note])}
        />
      )}
        
        <Notifications />
      </section>
    </div>
  );
};

export default ProfilePage;





