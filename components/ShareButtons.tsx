import React from 'react';
import type { NewsArticle } from '../types';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { useTranslation } from '../hooks/useTranslation';

interface ShareButtonsProps {
  article: NewsArticle;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ article }) => {
  const { t } = useTranslation();
  
  // In a real app, this would come from an environment variable or config
  const siteUrl = 'https://mouloudia-tiznit-volleyball.example.com';
  const articleUrl = `${siteUrl}/news/${article.id}`;
  const encodedTitle = encodeURIComponent(article.title);
  
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}&quote=${encodedTitle}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodeURIComponent(articleUrl)}`;
  // Instagram does not support direct sharing with pre-filled text
  const instagramShareUrl = `https://www.instagram.com/`;

  return (
    <div className="flex items-center justify-end space-x-4">
        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">{t('news_card_share')}:</span>
        <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer" aria-label={`Share ${article.title} on Facebook`} className="text-gray-400 hover:text-blue-600 dark:hover:text-brand-gold transition-colors">
            <FaFacebook size={20} />
        </a>
        <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer" aria-label={`Share ${article.title} on Twitter`} className="text-gray-400 hover:text-blue-400 dark:hover:text-brand-gold transition-colors">
            <FaTwitter size={20} />
        </a>
        <a href={instagramShareUrl} target="_blank" rel="noopener noreferrer" aria-label="Visit our Instagram page" className="text-gray-400 hover:text-pink-600 dark:hover:text-brand-gold transition-colors">
            <FaInstagram size={20} />
        </a>
    </div>
  );
};

export default ShareButtons;