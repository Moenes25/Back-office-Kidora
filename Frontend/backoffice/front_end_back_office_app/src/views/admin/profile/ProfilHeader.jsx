// "use client";

// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { FiMail, FiUsers, FiStar, FiActivity } from "react-icons/fi";
// import { useAuth } from "context/AuthContext";
// import avatar4Img from "../../../assets/img/avatars/avatar4.png";

// const ProfileHeaderSkeleton = () => (
//   <div className="relative flex flex-col overflow-hidden shadow-2xl animate-pulse rounded-3xl">
//     <div className="w-full h-40 bg-gray-300"></div>
//     <div className="flex flex-col gap-4 p-6 bg-white">
//       <div className="absolute top-0 w-32 h-32 bg-gray-300 rounded-full left-6"></div>
//       <div className="flex flex-col gap-2 mt-20">
//         <div className="w-40 h-6 bg-gray-300 rounded"></div>
//         <div className="w-32 h-4 bg-gray-200 rounded"></div>
//       </div>
//     </div>
//   </div>
// );

// const ProfileHeader = () => {
//   const { user } = useAuth();
//   const [openMessages, setOpenMessages] = useState(false);

//   if (!user) return <ProfileHeaderSkeleton />;

//   const getImageUrl = () => {
//     if (!user.imageUrl) return avatar4Img;
//     return user.imageUrl.startsWith("http")
//       ? user.imageUrl
//       : `${process.env.REACT_APP_API_URL}/auth/uploads/${user.imageUrl}`;
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//       className="relative w-full p-6 text-white shadow-2xl rounded-3xl bg-gradient-to-r from-purple-400 to-indigo-500"
//     >
//       {/* Avatar + Name */}
//       <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
//         <motion.div
//           className="relative w-32 h-32 border-4 border-white rounded-full shadow-xl md:w-36 md:h-36"
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <img
//             src={getImageUrl()}
//             alt={user.nom}
//             onError={(e) => (e.currentTarget.src = avatar4Img)}
//             className="object-cover w-full h-full rounded-full"
//           />
//           <span
//             className={`absolute bottom-2 right-2 h-5 w-5 rounded-full border-2 border-white ${
//               user.isActive ? "bg-green-500" : "bg-red-500"
//             }`}
//           ></span>
//         </motion.div>

//         <div className="flex flex-col gap-2 text-center md:text-left">
//           <motion.h2
//             className="text-3xl font-bold"
//             initial={{ x: -20, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ duration: 0.5 }}
//           >
//             {user.nom || "Guest"}
//           </motion.h2>
//           <motion.span
//             className="text-lg text-white/80"
//             initial={{ x: -20, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ delay: 0.2, duration: 0.5 }}
//           >
//             {user.role || "Role"}
//           </motion.span>

//           {/* Stats */}
//           <motion.div
//             className="flex justify-center gap-4 mt-4 md:justify-start"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.4, duration: 0.5 }}
//           >
//             <div className="flex flex-col items-center px-4 py-2 bg-white/20 rounded-2xl">
//               <FiUsers className="text-2xl" />
//               <span>15 Users</span>
//             </div>
//             <div className="flex flex-col items-center px-4 py-2 bg-white/20 rounded-2xl">
//               <FiStar className="text-2xl" />
//               <span>5 Stars</span>
//             </div>
//             <div className="flex flex-col items-center px-4 py-2 bg-white/20 rounded-2xl">
//               <FiActivity className="text-2xl" />
//               <span>Active</span>
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Messages Button */}
//       <div className="flex justify-center mt-6 md:justify-end">
//         <button
//           onClick={() => setOpenMessages(true)}
//           className="flex items-center gap-2 px-4 py-2 text-white transition bg-purple-700 shadow-md hover:bg-purple-800 rounded-xl"
//         >
//           <FiMail /> Messages
//         </button>
//       </div>

//       {/* Messages Modal */}
//       {openMessages && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="p-6 bg-white shadow-2xl rounded-2xl w-80">
//             <h3 className="mb-4 text-lg font-bold text-gray-700">Messages</h3>
//             <p className="mb-4 text-sm text-gray-500">No messages yet.</p>
//             <button
//               onClick={() => setOpenMessages(false)}
//               className="w-full px-4 py-2 text-white transition bg-purple-600 rounded-xl hover:bg-purple-700"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </motion.div>
//   );
// };

// export default ProfileHeader;


import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiStar, FiUsers, FiActivity } from "react-icons/fi";
import { useAuth } from "context/AuthContext";

const ProfileHeader = () => {
  const { user, token, updateUser } = useAuth(); 
  const [openMessages, setOpenMessages] = useState(false);
  const [newNom, setNewNom] = useState(user?.nom || "");
  const [newEmail, setNewEmail] = useState(user?.email || "");

  const handleUpdate = async () => {
    const form = new FormData();
    form.append("email", user.email);
    form.append("nom", newNom);


    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/update-profile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      if (!res.ok) throw new Error("Failed to update profile");
      const data = await res.json();
      updateUser(data); 
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.id) return;

      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        updateUser(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [user?.id, token]);

  const messageCount = 5;

  return (
    <div className="relative flex flex-col overflow-hidden shadow-2xl rounded-2xl">
      {/* Top Gradient */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative h-36 bg-gradient-to-r from-purple-400 via-blue-400 to-blue-200"
      >
        <span className="absolute w-24 h-24 rounded-full animate-pulse-slow -left-6 -top-6 bg-white/10"></span>
        <span className="absolute w-16 h-16 rounded-full animate-pulse-slow bottom-4 right-8 bg-white/20"></span>
      </motion.div>

      {/* Bottom White Section */}
      <div className="relative flex flex-col gap-4 p-6 bg-white dark:bg-indigo-900">
        {/* Avatar + Active */}
        <motion.div className="absolute overflow-hidden border-4 border-white rounded-full shadow-lg -top-14 left-6 h-28 w-28 md:h-32 md:w-32">
          <img
            src={user?.imageUrl || "../../../assets/img/avatars/avatar11.png"}
            alt="User"
            className="object-cover w-full h-full"
          />
          <span className="absolute w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-md bottom-2 right-2"></span>
        </motion.div>

        {/* Name + Email + Messages icon */}
        <div className="flex items-start justify-between pr-4 mt-8 md:ml-32">
          <div className="flex flex-col">
            <motion.h2
              className="text-xl font-bold text-gray-800"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {user?.nom || "Guest"}
            </motion.h2>

            <motion.div
              className="flex items-center gap-2 text-sm text-gray-500"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <FiMail className="text-gray-400" />
              <span>{user?.email || "guest@example.com"}</span>
            </motion.div>
          </div>

          {/* Messages Icon */}
          <div>
            <button
              onClick={() => setOpenMessages(true)}
              className={`underline-offset-3 relative flex items-center gap-1 rounded-xl p-3 text-gray-600 transition-all hover:underline ${
                openMessages ? "text-red-600" : ""
              }`}
            >
              <span className="absolute left-5 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {messageCount}
              </span>

              <FiMail className="text-xl text-gray-700" />
              <p className="mt-1 text-[12px] text-gray-600">Messages</p>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mt-6 md:grid-cols-4">
          {[
            { label: "Admins", value: 12, icon: <FiUsers />, gradient: "from-purple-500 to-purple-300" },
            { label: "Entreprises", value: 8, icon: <FiActivity />, gradient: "from-blue-400 to-blue-200" },
            { label: "Activity Score", value: "92%", icon: <FiStar />, gradient: "from-yellow-400 to-yellow-200" },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              className={`rounded-xl bg-gradient-to-br p-[1px] shadow-lg ${card.gradient}`}
              whileHover={{ scale: 1.03, y: -3 }}
            >
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} text-white`}
                >
                  {card.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500">{card.label}</span>
                  <span className="text-lg font-bold text-gray-800">{card.value}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Messages Modal */}
      {openMessages && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="p-5 bg-white shadow-xl w-96 rounded-2xl">
            <h3 className="mb-3 text-lg font-semibold text-gray-700">Messages</h3>
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
    </div>
  );
};

export default ProfileHeader;