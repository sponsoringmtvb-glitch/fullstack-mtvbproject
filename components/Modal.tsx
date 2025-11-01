import React from 'react';
// Fix: Import Variants type from framer-motion to correctly type animation variants.
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

// Fix: Add Variants type to satisfy TypeScript.
const backdropVariants: Variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 }
};

// Fix: Add Variants type to satisfy TypeScript.
const modalVariants: Variants = {
    hidden: { 
        y: "-50px",
        opacity: 0,
        scale: 0.95
    },
    visible: {
        y: "0",
        opacity: 1,
        scale: 1,
        transition: { delay: 0.1, type: 'spring', stiffness: 200, damping: 25 }
    },
    exit: {
        y: "50px",
        opacity: 0,
        scale: 0.95
    }
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="relative rounded-lg max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 bg-gray-800/50 text-white rounded-full h-8 w-8 flex items-center justify-center text-xl font-bold z-10 shadow-lg hover:bg-black/50 transition-colors"
              aria-label="Close modal"
            >
              &times;
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;