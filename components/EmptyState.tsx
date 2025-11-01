import React from 'react';
import { motion } from 'framer-motion';
import type { IconType } from 'react-icons';

interface EmptyStateProps {
    icon: IconType;
    title: string;
    message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, message }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16 px-4 bg-gray-50 dark:bg-brand-dark-secondary/50 rounded-lg"
        >
            <Icon className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">{message}</p>
        </motion.div>
    );
};

export default EmptyState;