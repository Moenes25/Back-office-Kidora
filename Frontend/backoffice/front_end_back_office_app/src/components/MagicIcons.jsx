"use client";
import { motion } from "framer-motion";

export function SoftMagicCircle({ icon: Icon, size = 48, iconSize = 24  }) {
  return (
    <div className="relative flex items-center justify-center">
      {/* 🔥 Animated Gradient Border */}
      <motion.div
        className="absolute rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 p-[3px]"
        style={{ width: size + 10, height: size + 10 }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />

      {/* 🎨 Soft Gradient Circle Background */}
      <div
        className="relative flex items-center justify-center rounded-full shadow-lg bg-white/10"
        style={{ width: size, height: size }}
      >
        {/* 💡 Soft glow */}
        <div className="absolute inset-0 bg-white rounded-full animate-pulse opacity-10 blur-md"></div>

        {/* 🎯 Icon with gradient color */}
        <motion.div
          className="z-10"
          initial={{ scale: 0.9, rotate: -5 }}
          animate={{ scale: [0.9, 1.05, 0.95, 1], rotate: [-5, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          style={{
            width: iconSize,
            height: iconSize,
            background: "linear-gradient(90deg, #8b5cf6, #ec4899, #f97316)", // gradient colors
            WebkitBackgroundClip: "text", // make the gradient clip to text/icon
            WebkitTextFillColor: "transparent", // hide original icon color
          }}
        >
          <Icon size={iconSize} />
        </motion.div>
      </div>
    </div>
  );
}
