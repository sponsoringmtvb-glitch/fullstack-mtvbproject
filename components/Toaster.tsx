import React from 'react';
import { useToasts } from '../hooks/useToasts';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiInfo } from 'react-icons/fi';

const Toaster: React.FC = () => {
  const { toasts, removeToast } = useToasts();

  const icons = {
    success: <FiCheckCircle className="text-green-500" size={24} />,
    error: <FiXCircle className="text-red-500" size={24} />,
    info: <FiInfo className="text-blue-500" size={24} />,
  };

  return (
    <div className="fixed top-5 right-5 z-[9999] w-80">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100, height: 0, padding: 0, margin: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            layout
            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-lg rounded-lg pointer-events-auto flex items-start p-4 mb-4"
          >
            <div className="flex-shrink-0">{icons[toast.type]}</div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                onClick={() => removeToast(toast.id)}
                className="inline-flex text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
              >
                <span className="sr-only">Close</span>
                <FiXCircle className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toaster;