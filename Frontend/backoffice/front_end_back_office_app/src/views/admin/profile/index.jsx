import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import ProfileInfo from "./components/ProfileInfo";
import Settings from "./components/Settings";
import Security from "./components/Security";
import Activity from "./components/Activity";
import SuperAdminSettings from "./components/AdminSettings";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";

const VALID_TABS = ["profile", "settings", "security", "activity", "superAdmin", "teams"];

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
        return <Activity />;
      case "Admin":
        return <SuperAdminSettings />;
      default:
        return <ProfileInfo />;
    }
  };

  return (
    <div className="px-6">
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
    </div>
  );
};

export default ProfilePage;





// import avatar from "assets/img/avatars/avatar4.png";
// import Banner from "./components/ProfileInfo";
// import Notification from "./components/Notification";

// export default function Profile() {
//   return (
//     <div>
//       <header>
//         <section className="relative h-40 w-full bg-blueSecondary bg-[linear-gradient(135deg,#667eea,#764ba2)]">
//           {/* Floating shapes */}
//           <div className="absolute w-4 h-4 border-red-700 rounded-full shadow-lg animate-pulse-slow left-64 top-64 bg-white/10"></div>
//           <div className="absolute w-8 h-8 rounded-full shadow-lg animate-pulse-slow bottom-64 right-64 bg-white/10"></div>
//           <div className="absolute w-6 h-6 rounded-full shadow-lg animate-pulse-slow bottom-64 left-64 bg-white/10"></div>
//           <div className="absolute w-10 h-10 rounded-full shadow-lg animate-pulse-slow right-64 top-64 bg-white/10"></div>
//           <button className="absolute px-4 py-2 text-sm text-white transition duration-300 border-2 border-white rounded-md bottom-4 right-4 hover:bg-white hover:text-blueSecondary">
//             {" "}
//             Edit Profile
//           </button>
//         </section>
//         <section className="bg-white border">
//           <div className="flex items-center gap-1 p-4">
//             <img
//               src={avatar}
//               className="absolute top-[215px] h-28 w-28 rounded-lg border-2 border-white"
//               alt="avatar"
//             />
//             <div className="mb-2 ml-32 ">
//               <h3 className="font-semibold text-md dark:text-white">
//                 User Name
//               </h3>
//               <p className="text-sm text-gray-600 dark:text-white/70">
//                 Super Admin
//               </p>
//             </div>
//           </div>
//         </section>
//       </header>
//       <nav className="flex items-center justify-center gap-6 px-4 py-8 font-semibold text-gray-700 ">
//         <a href="/login" className="hover:underline hover:underline-offset-1 hover:text-purple-600">Profile</a>
//         <a href="/login" className="hover:underline hover:underline-offset-1 hover:text-purple-600">Payment</a>
//         <a href="/login" className="hover:underline hover:underline-offset-1 hover:text-purple-600">Setting</a>
//       </nav>
//       <main>
//         <Banner />
//         <Notification />
//       </main>
//     </div>
//   );
// }
