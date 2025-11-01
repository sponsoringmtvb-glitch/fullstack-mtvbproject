import React from 'react';
// Fix: Import Variants and Transition types from framer-motion to correctly type animation properties.
import { motion, Variants, Transition } from 'framer-motion';

// Fix: Add Variants type to satisfy TypeScript.
const pageVariants: Variants = {
  initial: {
    opacity: 0,
    x: '2rem'
  },
  in: {
    opacity: 1,
    x: 0
  },
  out: {
    opacity: 0,
    x: '-2rem'
  }
};

// Fix: Add Transition type to satisfy TypeScript.
const pageTransition: Transition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.4
};

const PageTransition: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;