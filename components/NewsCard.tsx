import React from 'react';
import type { NewsArticle } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import ShareButtons from './ShareButtons';
import { FaArrowRight } from 'react-icons/fa';

interface NewsCardProps {
  article: NewsArticle;
  variant?: 'vertical' | 'horizontal';
  onViewDetail: () => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, variant = 'vertical', onViewDetail }) => {
  const { t } = useTranslation();
  const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const CardContent = () => (
    <>
      <div className="flex-grow">
        <p className="inline-block bg-brand-accent-light/10 text-brand-green-dark dark:bg-brand-gold/10 dark:text-brand-gold rounded-full px-3 py-1 text-xs font-semibold mb-3">{formattedDate}</p>
        <h3 
            className="text-xl font-bold text-brand-dark-text dark:text-brand-light-text hover:text-brand-green-dark dark:hover:text-brand-gold mb-3 transition-colors cursor-pointer font-display"
            onClick={onViewDetail}
        >
            {article.title}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 text-base line-clamp-3">{article.summary}</p>
      </div>
       <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/50 flex justify-between items-center">
          <button 
            onClick={onViewDetail}
            className="text-brand-green-dark dark:text-brand-gold font-semibold hover:underline group flex items-center gap-2"
          >
            {t('news_card_read_more')}
            <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <ShareButtons article={article} />
      </div>
    </>
  );

  if (variant === 'horizontal') {
      return (
        <div className="bg-white dark:bg-brand-dark-secondary rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row transform hover:shadow-xl transition-shadow duration-300 group">
            <div className="w-full sm:w-1/3 h-48 sm:h-auto overflow-hidden">
                <img className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" src={article.imageUrl} alt={article.title} />
            </div>
            <div className="p-6 flex flex-col justify-between flex-grow">
                <CardContent />
            </div>
        </div>
      )
  }

  return (
    <div className="bg-white dark:bg-brand-dark-secondary rounded-lg shadow-md overflow-hidden transform hover:shadow-xl transition-shadow duration-300 flex flex-col group">
      <div className="w-full h-48 overflow-hidden">
        <img className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" src={article.imageUrl} alt={article.title} />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <CardContent />
      </div>
    </div>
  );
};

export default NewsCard;