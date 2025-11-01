import React from 'react';
import type { NewsArticle } from '../types';
import NewsCard from '../components/NewsCard';
import { HiNewspaper } from 'react-icons/hi2';
import { motion } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';
import EmptyState from '../components/EmptyState';
import { FaPlusCircle } from 'react-icons/fa';

interface NewsProps {
  articles: NewsArticle[];
  onViewDetail: (id: number) => void;
}

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};


const News: React.FC<NewsProps> = ({ articles, onViewDetail }) => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="flex items-center space-x-3 mb-8">
            <HiNewspaper className="h-10 w-10 text-brand-green dark:text-brand-gold" />
            <h1 className="text-4xl font-bold text-brand-green-dark dark:text-brand-light-text">{t('news_page_title')}</h1>
      </div>
      {articles.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {articles.map(article => (
            <motion.div key={article.id} variants={itemVariants}>
              <NewsCard article={article} variant="vertical" onViewDetail={() => onViewDetail(article.id)} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyState
            icon={FaPlusCircle}
            title={t('empty_state_news_title')}
            message={t('empty_state_news_message')}
        />
      )}
    </div>
  );
};

export default News;