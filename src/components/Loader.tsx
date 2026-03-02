import { motion } from "motion/react";

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Fast, lightweight loader animation */}
      <div className="relative w-12 h-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            ease: "linear",
            repeat: Infinity,
          }}
          className="absolute inset-0 border-3 border-slate-700/50 border-t-violet-500 rounded-full"
        />
      </div>
      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]"
      >
        Loading...
      </motion.div>
    </div>
  );
}
