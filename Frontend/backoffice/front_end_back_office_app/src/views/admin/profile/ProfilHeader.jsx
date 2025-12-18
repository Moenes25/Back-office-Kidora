"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiUsers, FiStar, FiActivity } from "react-icons/fi";
import { useAuth } from "context/AuthContext";
import avatar4Img from "../../../assets/img/avatars/avatar4.png";

const ProfileHeaderSkeleton = () => (
  <div className="relative flex flex-col overflow-hidden shadow-2xl animate-pulse rounded-3xl">
    <div className="w-full h-40 bg-gray-300"></div>
    <div className="flex flex-col gap-4 p-6 bg-white">
      <div className="absolute top-0 w-32 h-32 bg-gray-300 rounded-full left-6"></div>
      <div className="flex flex-col gap-2 mt-20">
        <div className="w-40 h-6 bg-gray-300 rounded"></div>
        <div className="w-32 h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

const ProfileHeader = () => {
  const { user } = useAuth();
  const [openMessages, setOpenMessages] = useState(false);

  if (!user) return <ProfileHeaderSkeleton />;

  const getImageUrl = () => {
    if (!user.imageUrl) return avatar4Img;
    return user.imageUrl.startsWith("http")
      ? user.imageUrl
      : `${process.env.REACT_APP_API_URL}/auth/uploads/${user.imageUrl}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full p-6 text-white shadow-2xl rounded-3xl bg-gradient-to-r from-purple-400 to-indigo-500"
    >
      {/* Avatar + Name */}
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
        <motion.div
          className="relative w-32 h-32 border-4 border-white rounded-full shadow-xl md:w-36 md:h-36"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={getImageUrl()}
            alt={user.nom}
            onError={(e) => (e.currentTarget.src = avatar4Img)}
            className="object-cover w-full h-full rounded-full"
          />
          <span
            className={`absolute bottom-2 right-2 h-5 w-5 rounded-full border-2 border-white ${
              user.isActive ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>
        </motion.div>

        <div className="flex flex-col gap-2 text-center md:text-left">
          <motion.h2
            className="text-3xl font-bold"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {user.nom || "Guest"}
          </motion.h2>
          <motion.span
            className="text-lg text-white/80"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {user.role || "Role"}
          </motion.span>

          {/* Stats */}
          <motion.div
            className="flex justify-center gap-4 mt-4 md:justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="flex flex-col items-center px-4 py-2 bg-white/20 rounded-2xl">
              <FiUsers className="text-2xl" />
              <span>15 Users</span>
            </div>
            <div className="flex flex-col items-center px-4 py-2 bg-white/20 rounded-2xl">
              <FiStar className="text-2xl" />
              <span>5 Stars</span>
            </div>
            <div className="flex flex-col items-center px-4 py-2 bg-white/20 rounded-2xl">
              <FiActivity className="text-2xl" />
              <span>Active</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Messages Button */}
      <div className="flex justify-center mt-6 md:justify-end">
        <button
          onClick={() => setOpenMessages(true)}
          className="flex items-center gap-2 px-4 py-2 text-white transition bg-purple-700 shadow-md hover:bg-purple-800 rounded-xl"
        >
          <FiMail /> Messages
        </button>
      </div>

      {/* Messages Modal */}
      {openMessages && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="p-6 bg-white shadow-2xl rounded-2xl w-80">
            <h3 className="mb-4 text-lg font-bold text-gray-700">Messages</h3>
            <p className="mb-4 text-sm text-gray-500">No messages yet.</p>
            <button
              onClick={() => setOpenMessages(false)}
              className="w-full px-4 py-2 text-white transition bg-purple-600 rounded-xl hover:bg-purple-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProfileHeader;


// "use client";

// import React, { useState } from "react";
// import {
//   FiMail,
//   FiPhone,
//   FiCalendar,
// } from "react-icons/fi";
// import { useAuth } from "context/AuthContext";
// import avatar4Img from "../../../assets/img/avatars/avatar4.png";

// const ProfileHeader = () => {
//   const { user } = useAuth();
//   const [openMessages, setOpenMessages] = useState(false);

//   if (!user) return null;

//   const getImageUrl = () => {
//     if (!user.imageUrl) return avatar4Img;
//     return user.imageUrl.startsWith("http")
//       ? user.imageUrl
//       : `${process.env.REACT_APP_API_URL}/auth/uploads/${user.imageUrl}`;
//   };

//   return (
//     <div className="relative flex flex-col items-center gap-6 p-6 bg-white border border-gray-100 shadow-lg rounded-2xl">
//       {/* Avatar */}
//       <div className="relative">
//         <img
//           src={getImageUrl()}
//           alt={user.nom}
//           onError={(e) => { e.currentTarget.src = avatar4Img; }}
//           className="object-cover border-4 border-purple-200 rounded-full shadow-sm w-28 h-28"
//         />
//         <span
//           className={`absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-white ${
//             user.isActive ? "bg-green-500" : "bg-red-500"
//           }`}
//         ></span>
//       </div>

//       {/* Info Section */}
//       <div className="flex flex-col items-center gap-3 text-center">
//         <h2 className="text-2xl font-bold text-gray-800">{user.nom}</h2>

//         <div className="flex flex-col gap-2 text-sm text-gray-600 sm:flex-row sm:gap-6 sm:text-base">
//           <div className="flex items-center gap-2">
//             <FiMail className="text-purple-500" /> {user.email}
//           </div>
//           <div className="flex items-center gap-2">
//             <FiPhone className="text-purple-500" /> {user.tel ?? "N/A"}
//           </div>
//         </div>

//         <div className="flex flex-wrap justify-center gap-2 mt-2">
//           <span className="px-3 py-1 text-sm font-medium text-purple-800 bg-purple-100 rounded-full">
//             {user.role}
//           </span>
//           <span
//             className={`rounded-full px-3 py-1 text-sm font-medium ${
//               user.isActive
//                 ? "bg-green-100 text-green-800"
//                 : "bg-red-100 text-red-800"
//             }`}
//           >
//             {user.isActive ? "Active" : "Inactive"}
//           </span>
//           {user.region && (
//             <span className="px-3 py-1 text-sm font-medium text-indigo-800 bg-indigo-100 rounded-full">
//               {user.region}
//             </span>
//           )}
//         </div>

//         <div className="flex flex-wrap justify-center gap-4 mt-2 text-xs text-gray-400 sm:text-sm">
//           <div className="flex items-center gap-1">
//             <FiCalendar /> Created: {new Date(user.createdAt).toLocaleDateString()}
//           </div>
//           <div className="flex items-center gap-1">
//             <FiCalendar /> Updated: {new Date(user.updatedAt).toLocaleDateString()}
//           </div>
//         </div>
//       </div>

//       {/* Messages Button */}
//       <div className="mt-4">
//         <button
//           onClick={() => setOpenMessages(true)}
//           className="flex items-center gap-2 px-4 py-2 text-sm text-white transition-all bg-purple-600 shadow rounded-xl hover:bg-purple-700"
//         >
//           <FiMail /> Messages
//           <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white animate-pulse">
//             5
//           </span>
//         </button>
//       </div>

//       {/* Messages Modal */}
//       {openMessages && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="p-6 bg-white shadow-2xl w-80 rounded-2xl">
//             <h3 className="mb-4 text-lg font-bold text-gray-700">Messages</h3>
//             <p className="mb-4 text-sm text-gray-500">No messages yet.</p>
//             <button
//               onClick={() => setOpenMessages(false)}
//               className="w-full px-4 py-2 text-white transition-all bg-purple-600 rounded-xl hover:bg-purple-700"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfileHeader;
