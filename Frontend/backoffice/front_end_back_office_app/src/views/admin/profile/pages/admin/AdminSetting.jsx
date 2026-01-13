"use client";

import AdminList from "./components/AdminList";
import { motion } from "framer-motion";
import { FaBrain } from "react-icons/fa";

const SuperAdminSettings = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="space-y-8"
    >
      {/* ADMINS LIST */}
      <AdminList />

      {/* AI SETTINGS */}
      <div
        className="rounded-3xl bg-white border border-slate-200
                   shadow-[0_25px_60px_-25px_rgba(139,92,246,0.35)] dark:bg-navy-700 dark:text-white
                   p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10
                          rounded-xl bg-purple-100">
            <FaBrain className="text-purple-600" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-white">
              AI Administration
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              Intelligent automation & insights
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 dark:text-white">
          <Toggle
            title="AI Recommendations"
            desc="Suggest actions based on admin behavior"
            defaultChecked
          />
          <Toggle
            title="Activity Analysis"
            desc="Automatically analyze admin activities"
            defaultChecked
          />
        </div>
      </div>
    </motion.section>
  );
};

export default SuperAdminSettings;

/* ================= TOGGLE ================= */
const Toggle = ({ title, desc, defaultChecked }) => (
  <label className="flex items-center justify-between
                    rounded-2xl border border-slate-200
                    p-4 cursor-pointer hover:bg-slate-50 transition dark:hover:bg-navy-600 ">
    <div>
      <p className="font-semibold text-slate-700 dark:text-white">{title}</p>
      <p className="text-sm text-slate-500 dark:text-slate-300">{desc}</p>
    </div>
    <input
      type="checkbox"
      defaultChecked={defaultChecked}
      className="h-5 w-10 accent-purple-600"
    />
  </label>
);
