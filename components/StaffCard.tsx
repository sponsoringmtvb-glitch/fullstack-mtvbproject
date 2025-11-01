import React from 'react';
import type { StaffMember } from '../types';
import { motion } from 'framer-motion';

interface StaffCardProps {
  member: StaffMember;
}

const StaffCard: React.FC<StaffCardProps> = ({ member }) => {
  return (
    <motion.div
        className="bg-white dark:bg-brand-dark-secondary rounded-lg shadow-lg text-center p-6 flex flex-col items-center"
        whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
        transition={{ type: 'spring', stiffness: 300 }}
    >
        <img 
            src={member.imageUrl} 
            alt={member.name} 
            className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-brand-accent-light dark:border-brand-gold" 
        />
        <h3 className="text-xl font-bold text-brand-dark-text dark:text-white">{member.name}</h3>
        <p className="text-brand-green dark:text-brand-gold font-semibold mb-3">{member.position}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300 flex-grow">{member.bio}</p>
    </motion.div>
  );
};

export default StaffCard;
