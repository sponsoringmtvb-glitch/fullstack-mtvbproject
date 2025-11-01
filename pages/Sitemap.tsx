import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Page } from '../constants';
import { FaHome, FaUsers, FaNewspaper, FaCalendar, FaImages, FaStar, FaInfoCircle, FaPhone, FaLock, FaFileContract, FaSitemap } from 'react-icons/fa';

interface SitemapProps {
    onNavigate: (page: Page) => void;
}

const Sitemap: React.FC<SitemapProps> = ({ onNavigate }) => {
    const { t } = useTranslation();

    const pages = [
        { page: Page.Home, icon: FaHome },
        { page: Page.Team, icon: FaUsers },
        { page: Page.News, icon: FaNewspaper },
        { page: Page.Schedule, icon: FaCalendar },
        { page: Page.Gallery, icon: FaImages },
        { page: Page.Sponsors, icon: FaStar },
        { page: Page.About, icon: FaInfoCircle },
        { page: Page.Contact, icon: FaPhone },
    ];
    
    const legalPages = [
        { page: Page.PrivacyPolicy, icon: FaLock },
        { page: Page.TermsOfService, icon: FaFileContract },
        { page: Page.Sitemap, icon: FaSitemap },
    ];

    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-brand-dark-secondary p-6 sm:p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl md:text-4xl font-extrabold text-brand-dark-text dark:text-brand-light-text mb-8">{t('sitemap_page_title')}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {pages.map(({ page, icon: Icon }) => (
                    <button 
                        key={page}
                        onClick={() => onNavigate(page)}
                        className="flex items-center p-4 bg-gray-50 dark:bg-brand-dark rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <Icon className="h-6 w-6 text-brand-green dark:text-brand-gold mr-4" />
                        <span className="font-semibold text-lg">{t(`header_nav_${page.toLowerCase().replace(/ /g, '_')}` as any)}</span>
                    </button>
                ))}
            </div>
            <div className="mt-12">
                 <h2 className="text-2xl font-bold text-brand-dark-text dark:text-brand-light-text mb-4">{t('footer_legal')}</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {legalPages.map(({ page, icon: Icon }) => (
                         <button 
                            key={page}
                            onClick={() => onNavigate(page)}
                            className="flex items-center p-4 bg-gray-50 dark:bg-brand-dark rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <Icon className="h-6 w-6 text-brand-green dark:text-brand-gold mr-4" />
                            <span className="font-semibold text-lg">{t(`footer_${page.toLowerCase().replace(/ /g, '_')}` as any)}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sitemap;
