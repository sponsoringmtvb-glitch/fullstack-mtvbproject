import React, { useState, useMemo } from 'react';
import type { Match } from '../types';
import MatchCard from '../components/MatchCard';
import { HiCalendar } from 'react-icons/hi2';
import { motion } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';

interface ScheduleProps {
  matches: Match[];
}

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const Schedule: React.FC<ScheduleProps> = ({ matches }) => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const upcomingMatches = matches.filter(m => new Date(m.date) >= new Date()).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastMatches = matches.filter(m => new Date(m.date) < new Date()).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const upcomingCategories = useMemo(() => {
    const categories = new Set(upcomingMatches.map(m => m.category));
    return ['all', ...Array.from(categories)];
  }, [upcomingMatches]);

  const filteredUpcomingMatches = useMemo(() => {
    if (selectedCategory === 'all') {
      return upcomingMatches;
    }
    return upcomingMatches.filter(m => m.category === selectedCategory);
  }, [upcomingMatches, selectedCategory]);

  return (
    <div>
      <div className="flex items-center space-x-3 mb-8">
            <HiCalendar className="h-10 w-10 text-brand-green dark:text-brand-gold" />
            <h1 className="text-4xl font-bold text-brand-green-dark dark:text-brand-light-text">{t('schedule_page_title')}</h1>
      </div>
      
      <div className="mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-0">{t('schedule_upcoming_title')}</h2>
            
            {upcomingCategories.length > 2 && ( // Only show filter if there's more than one category + 'all'
                <div className="relative">
                    <label htmlFor="category-filter" className="sr-only">{t('schedule_filter_label')}</label>
                    <select
                        id="category-filter"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="appearance-none block w-full sm:w-auto bg-white dark:bg-brand-dark-secondary border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white dark:focus:bg-brand-dark focus:border-brand-green dark:focus:border-brand-gold"
                    >
                        {upcomingCategories.map(category => (
                            <option key={category} value={category}>
                                {category === 'all' ? t('schedule_filter_all') : category}
                            </option>
                        ))}
                    </select>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
            )}
        </div>
        
        <motion.div 
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
          {filteredUpcomingMatches.length > 0 ? (
            filteredUpcomingMatches.map(match => (
                <motion.div key={match.id} variants={itemVariants}>
                    <MatchCard match={match} />
                </motion.div>
            ))
          ) : (
             <p className="text-gray-500 dark:text-gray-400">{t('schedule_upcoming_none')}</p>
          )}
        </motion.div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">{t('schedule_past_title')}</h2>
        <motion.div 
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
          {pastMatches.length > 0 ? (
            pastMatches.map(match => (
                <motion.div key={match.id} variants={itemVariants}>
                    <MatchCard match={match} />
                </motion.div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">{t('schedule_past_none')}</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Schedule;