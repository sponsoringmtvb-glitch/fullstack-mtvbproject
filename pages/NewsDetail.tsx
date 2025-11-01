import React from 'react';
import type { NewsArticle } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import ShareButtons from '../components/ShareButtons';
import { FaArrowLeft } from 'react-icons/fa';

interface NewsDetailProps {
  article: NewsArticle;
  onBack: () => void;
}

const NewsDetail: React.FC<NewsDetailProps> = ({ article, onBack }) => {
    const { t, language } = useTranslation();
    const formattedDate = new Date(article.date).toLocaleDateString(language, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <article className="max-w-4xl mx-auto bg-white dark:bg-brand-dark-secondary p-6 sm:p-8 rounded-lg shadow-lg">
            {/* Header */}
            <div className="mb-8">
                <button 
                    onClick={onBack} 
                    className="flex items-center gap-2 text-brand-green dark:text-brand-gold font-semibold hover:underline mb-6 transition-colors"
                >
                    <FaArrowLeft />
                    {t('news_detail_back')}
                </button>
                <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark-text dark:text-brand-light-text mb-3 leading-tight">{article.title}</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{t('news_detail_published')} {formattedDate}</p>
            </div>
            
            {/* Hero Image */}
            <img src={article.imageUrl} alt={article.title} className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg mb-8" />
            
            {/* Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none text-brand-dark-text dark:text-brand-light-text leading-relaxed space-y-4">
                <p className="font-semibold text-lg">{article.summary}</p>
                {article.content.split('\n').map((paragraph, index) => (
                    paragraph.trim() !== '' && <p key={index}>{paragraph}</p>
                ))}
            </div>

            {/* Footer with Share buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <ShareButtons article={article} />
            </div>
        </article>
    );
}

export default NewsDetail;