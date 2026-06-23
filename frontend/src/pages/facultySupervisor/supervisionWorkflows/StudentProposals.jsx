import React from 'react';
import { motion } from 'framer-motion';
const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function StudentProposals() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="p-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Student Proposals</h1>
        <p className="text-slate-500">This is a placeholder for the Student Proposals page.</p>
      </motion.div>
    </motion.div>
  );
}
