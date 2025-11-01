import React, { useContext } from 'react';
import { DataContext } from '../contexts/DataContext';
import StaffCard from '../components/StaffCard';
import { motion } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';
import { FaLandmark, FaBullseye, FaUsers } from 'react-icons/fa';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const About: React.FC = () => {
    const { clubInfo, staffMembers } = useContext(DataContext);
    const { t } = useTranslation();

    return (
        <div className="space-y-16">
            <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                <motion.div className="text-center mb-12" variants={itemVariants}>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-brand-green-dark dark:text-brand-light-text">{t('about_page_title')}</h1>
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-center md:text-left">
                    <motion.div variants={itemVariants} className="bg-white dark:bg-brand-dark-secondary p-8 rounded-lg shadow-lg">
                        <div className="flex items-center justify-center md:justify-start mb-4">
                            <FaLandmark className="h-8 w-8 text-brand-green dark:text-brand-gold mr-3" />
                            <h2 className="text-3xl font-bold text-brand-dark-text dark:text-brand-light-text">{t('about_history_title')}</h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{clubInfo.history}</p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-white dark:bg-brand-dark-secondary p-8 rounded-lg shadow-lg">
                        <div className="flex items-center justify-center md:justify-start mb-4">
                            <FaBullseye className="h-8 w-8 text-brand-green dark:text-brand-gold mr-3" />
                            <h2 className="text-3xl font-bold text-brand-dark-text dark:text-brand-light-text">{t('about_mission_title')}</h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{clubInfo.mission}</p>
                    </motion.div>
                </div>

                {staffMembers.length > 0 && (
                    <motion.div variants={itemVariants} className="mt-16">
                         <div className="flex items-center justify-center mb-8">
                            <FaUsers className="h-10 w-10 text-brand-green dark:text-brand-gold mr-4" />
                            <h2 className="text-4xl font-bold text-center text-brand-dark-text dark:text-brand-light-text">{t('about_staff_title')}</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {staffMembers.map(member => (
                                <StaffCard key={member.id} member={member} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default About;
