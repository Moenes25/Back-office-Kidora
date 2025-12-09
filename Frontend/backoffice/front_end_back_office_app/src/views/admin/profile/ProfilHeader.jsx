import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiStar, FiUsers, FiActivity } from "react-icons/fi";
import { useAuth } from "context/AuthContext";

const ProfileHeader = () => {
  const { user, token, updateUser } = useAuth(); 
  const [openMessages, setOpenMessages] = useState(false);
  const [imageURL, setImageURL] = useState(null);
  const [newNom, setNewNom] = useState(user?.nom || "");
  const [newEmail, setNewEmail] = useState(user?.email || "");
  const [imageUrl, setImageUrl] = useState(null);
  

  const handleUpdate = async () => {
    const form = new FormData();
    form.append("email", user.email);
    form.append("nom", newNom);
    form.append("image", imageUrl);
   
    const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/update-profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });

    const data = await res.json();
    updateUser(data);
  };

  useEffect(() => {
    const fetchImage = async () => {
      if (!user?.id) return;

      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/user/${user.id}/avatar`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          setImageURL(url);
        }
      } catch (err) {
        console.error("Error fetching avatar:", err);
      }
    };

    fetchImage();
  }, [user, token]);

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
            src={imageURL || user?.imageUrl || "../../../assets/img/avatars/avatar11.png"}
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
          <div className="">
            <button
              onClick={() => setOpenMessages(true)}
              className={`underline-offset-3 relative flex items-center gap-1 rounded-xl p-3 text-gray-600 transition-all hover:underline ${
                openMessages ? "text-red-600" : ""
              }`}
            >
              {/* Badge */}
              <span className=" absolute left-5 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {messageCount}
              </span>

              <FiMail className="text-xl text-gray-700" />
              <p className="mt-1 text-[12px] text-gray-600">Messages</p>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mt-6 md:grid-cols-4 ">
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


