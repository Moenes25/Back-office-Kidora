"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiStar, FiUsers, FiActivity } from "react-icons/fi";
import { useAuth } from "context/AuthContext";
import avatar4Img from "../../../assets/img/avatars/avatar4.png";

/* ---------------------- SKELETON LOADER ---------------------- */
const ProfileHeaderSkeleton = () => (
  <div className="relative flex flex-col overflow-hidden shadow-2xl animate-pulse rounded-2xl">
    <div className="relative bg-gray-300 h-36"></div>
    <div className="relative flex flex-col gap-4 p-6 bg-white dark:bg-indigo-900">
      <div className="absolute bg-gray-300 rounded-full -top-14 left-6 h-28 w-28 md:h-32 md:w-32"></div>
      <div className="flex items-start justify-between w-full pr-4 mt-8 md:ml-32">
        <div className="flex flex-col w-40 gap-2">
          <div className="w-32 h-4 bg-gray-300 rounded"></div>
          <div className="w-40 h-3 bg-gray-200 rounded"></div>
        </div>
        <div className="h-10 bg-gray-200 w-14 rounded-xl"></div>
      </div>
    </div>
  </div>
);

/* ---------------------- MAIN COMPONENT ---------------------- */
const ProfileHeader = () => {
  const { user, token } = useAuth();
  const [openMessages, setOpenMessages] = useState(false);
  
  /* ---------------------- Skeleton Loader ---------------------- */
  if (!user) return <ProfileHeaderSkeleton />;

  /* ---------------------- Image URL Logic ---------------------- */
  const getImageUrl = () => {
    if (!user.imageUrl) return avatar4Img;

    // if it's an absolute URL
    if (user.imageUrl.startsWith("http")) {
      return user.imageUrl;
    }

    // if it's a relative path
    return `${process.env.REACT_APP_API_URL}/auth/uploads/${user.imageUrl}`;
  };

  return (
    
     
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative flex flex-col items-center p-4 overflow-hidden shadow-2xl rounded-2xl"
      >
          {/* Avatar */}
          <motion.div className="flex items-center justify-center bg-white border-4 border-white rounded-full shadow-lg -top-14 left-6 h-28 w-28 md:h-32 md:w-32">
            <img
              src={getImageUrl()}
              alt="User"
              onError={(e) => {
                e.currentTarget.src = avatar4Img;
              }}
              className="object-cover w-24 h-24 rounded-full md:h-28 md:w-28"
            />
            <span className="absolute w-4 h-4 border-2 border-white rounded-full shadow-md bottom-2 right-2"></span>
          </motion.div>
        <div className="relative flex flex-col gap-4 p-6 ">

          {/* Name + Email */}
          <div className="flex items-start justify-between ">
            <div className="flex flex-col items-center ">
              <motion.h2
                className="text-xl font-bold text-gray-800"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {user.nom || "Guest"}
              </motion.h2>

              <motion.div
                className="flex items-center gap-2 text-sm text-gray-500"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                
                <span>{user.role || "role"}</span>
              </motion.div>
            </div>

            {/* Messages */}
            {/* <div>
              <button
                onClick={() => setOpenMessages(true)}
                className={`underline-offset-3 relative flex items-center gap-1 rounded-xl p-3 text-gray-600 transition-all hover:underline ${
                  openMessages ? "text-red-600" : ""
                }`}
              >
                <span className="absolute left-5 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  5
                </span>
                <FiMail className="text-xl text-gray-700" />
                <p className="mt-1 text-[12px] text-gray-600">Messages</p>
              </button>
            </div> */}
          </div>
        </div>

        {/* Messages Modal */}
        {openMessages && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="p-5 bg-white shadow-xl w-96 rounded-2xl">
              <h3 className="mb-3 text-lg font-semibold text-gray-700">
                Messages
              </h3>
              <p className="mb-4 text-sm text-gray-600">vide</p>
              <button
                onClick={() => setOpenMessages(false)}
                className="px-4 py-2 mt-2 text-white bg-purple-500 rounded-lg"
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
