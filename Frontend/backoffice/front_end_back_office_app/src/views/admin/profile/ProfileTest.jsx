"use client";
import React, { useEffect, useState } from "react";
import { FiUsers, FiActivity, FiStar } from "react-icons/fi";
import { motion } from "framer-motion";
import { useAuth } from "context/AuthContext";

const StatsCards = () => {
  const { token } = useAuth();

  const [adminsCount, setAdminsCount] = useState(null);
  const [etabsCount, setEtabsCount] = useState(null);
  const [activityScore, setActivityScore] = useState(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setAdminsCount(data.length);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchEtablissements = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/etablissement/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setEtabsCount(data.length);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchActivityScore = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/user/activityScore`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setActivityScore(data.value || data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAdmins();
    fetchEtablissements();
    fetchActivityScore();
  }, [token]);

  const cards = [
    {
      label: "Admins",
      value: adminsCount,
      icon: <FiUsers />,
      gradientColors: ["#7F00FF", "#E100FF", "#FF7C00"], 
      motionDelay: 0,
    },
    {
      label: "Etablissements",
      value: etabsCount,
      icon: <FiActivity />,
      gradientColors: ["#1A2980", "#26D0CE"], 
      motionDelay: 0.2,
    },
    {
      label: "Activity Score",
      value: activityScore,
      icon: <FiStar />,
      gradientColors: ["#FFD700", "#FF8C00"],
      motionDelay: 0.4,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 p-6 mt-4 bg-white rounded-xl sm:grid-cols-2 md:grid-cols-3">
      {cards.map((card) => (
        <motion.div
          key={card.label}
          className="overflow-hidden cursor-pointer rounded-2xl"
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 25px rgba(0,0,0,0.25)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: card.motionDelay, duration: 0.6 }}
        >
          <motion.div
            className="flex items-center gap-3 p-4 text-white rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${card.gradientColors.join(", ")})`,
              backgroundSize: "400% 400%",
            }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          >
            <div className="flex items-center justify-center w-12 h-12 text-2xl rounded-full bg-white/30">
              {card.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{card.label}</span>
              <span className="text-lg font-bold">{card.value ?? "..."}</span>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;
