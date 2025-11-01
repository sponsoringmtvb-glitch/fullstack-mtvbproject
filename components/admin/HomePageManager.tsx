import React, { useState, useContext, useEffect } from 'react';
import { DataContext } from '../../contexts/DataContext';
import { useTranslation } from '../../hooks/useTranslation';
import ImageUploader from './ImageUploader';
import type { HomePageContent, ClubInfo } from '../../types';

const HomePageManager: React.FC = () => {
    const { homePageContent, updateHomePageContent, clubInfo, updateClubInfo } = useContext(DataContext);
    const [homeData, setHomeData] = useState<HomePageContent>(homePageContent);
    const [aboutData, setAboutData] = useState<ClubInfo>(clubInfo);
    const { t } = useTranslation();

    useEffect(() => {
        setHomeData(homePageContent);
    }, [homePageContent]);
    
    useEffect(() => {
        setAboutData(clubInfo);
    }, [clubInfo]);


    const handleHomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setHomeData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleAboutChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setAboutData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (url: string) => {
        setHomeData(prev => ({ ...prev, heroImageUrl: url }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateHomePageContent(homeData);
        updateClubInfo(aboutData);
    };

    const inputClasses = "mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-brand-dark focus:ring-brand-green dark:focus:ring-brand-gold focus:border-brand-green dark:focus:border-brand-gold";
    const textareaClasses = `${inputClasses} min-h-[120px]`;

    return (
        <section>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{t('admin_nav_appearance')}</h2>
            <form onSubmit={handleSubmit} className="bg-white dark:bg-brand-dark-secondary p-8 rounded-lg shadow-md space-y-8">
                {/* Home Page Section */}
                <div>
                    <h3 className="text-xl font-semibold text-brand-dark-text dark:text-brand-light-text border-b dark:border-gray-600 pb-2 mb-4">{t('admin_appearance_title')}</h3>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin_appearance_hero_title')}</label>
                            <input type="text" name="title" value={homeData.title} onChange={handleHomeChange} required className={inputClasses} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin_appearance_hero_subtitle')}</label>
                            <input type="text" name="subtitle" value={homeData.subtitle} onChange={handleHomeChange} required className={inputClasses} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin_appearance_hero_cta1')}</label>
                                <input type="text" name="ctaTeam" value={homeData.ctaTeam} onChange={handleHomeChange} required className={inputClasses} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin_appearance_hero_cta2')}</label>
                                <input type="text" name="ctaSchedule" value={homeData.ctaSchedule} onChange={handleHomeChange} required className={inputClasses} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin_appearance_hero_bg')}</label>
                            <ImageUploader currentImageUrl={homeData.heroImageUrl} onImageChange={handleImageChange} />
                        </div>
                    </div>
                </div>

                {/* About Page Section */}
                <div>
                    <h3 className="text-xl font-semibold text-brand-dark-text dark:text-brand-light-text border-b dark:border-gray-600 pb-2 mb-4">{t('admin_appearance_about_title')}</h3>
                     <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin_appearance_about_history')}</label>
                            <textarea name="history" value={aboutData.history} onChange={handleAboutChange} required className={textareaClasses} />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin_appearance_about_mission')}</label>
                            <textarea name="mission" value={aboutData.mission} onChange={handleAboutChange} required className={textareaClasses} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" className="bg-brand-green text-white dark:bg-brand-gold dark:text-brand-dark px-6 py-2 rounded-md hover:bg-brand-green-dark dark:hover:bg-amber-400 transition-colors">
                        {t('admin_appearance_save_button')}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default HomePageManager;