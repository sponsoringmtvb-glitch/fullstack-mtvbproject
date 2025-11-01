import React, { useState, useContext, useEffect } from 'react';
import { DataContext } from '../../contexts/DataContext';
import { useTranslation } from '../../hooks/useTranslation';
import ImageUploader from './ImageUploader';
import type { GeneralSettings } from '../../types';
import { useToasts } from '../../hooks/useToasts';

const GeneralSettingsManager: React.FC = () => {
    const { generalSettings, updateGeneralSettings } = useContext(DataContext);
    const [settings, setSettings] = useState<GeneralSettings>(generalSettings);
    const { t } = useTranslation();
    const { addToast } = useToasts();

    useEffect(() => {
        setSettings(generalSettings);
    }, [generalSettings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            socialLinks: {
                ...prev.socialLinks,
                [name]: value
            }
        }));
    };
    
    const handleSmtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            smtpSettings: {
                ...prev.smtpSettings,
                [name]: type === 'checkbox' ? checked : (name === 'port' ? Number(value) : value)
            }
        }));
    };

    const handleLogoChange = (url: string) => {
        setSettings(prev => ({ ...prev, logoUrl: url }));
    };

    const handleFaviconChange = (url: string) => {
        setSettings(prev => ({ ...prev, faviconUrl: url }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateGeneralSettings(settings);
    };

    const handleTestConnection = () => {
        addToast(t('toast_success_smtp_test'), 'success');
    };

    const inputClasses = "mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-brand-dark focus:ring-brand-green dark:focus:ring-brand-gold focus:border-brand-green dark:focus:border-brand-gold";

    return (
        <section>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{t('admin_settings_title')}</h2>
            <form onSubmit={handleSubmit} className="bg-white dark:bg-brand-dark-secondary p-8 rounded-lg shadow-md space-y-8">
                
                {/* Branding Section */}
                <div>
                    <h3 className="text-xl font-semibold text-brand-dark-text dark:text-brand-light-text border-b dark:border-gray-600 pb-2 mb-4">{t('admin_settings_branding')}</h3>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin_settings_club_name')}</label>
                            <input type="text" name="clubName" value={settings.clubName} onChange={handleChange} required className={inputClasses} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin_settings_logo')}</label>
                                <ImageUploader currentImageUrl={settings.logoUrl} onImageChange={handleLogoChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin_settings_favicon')}</label>
                                <ImageUploader currentImageUrl={settings.faviconUrl} onImageChange={handleFaviconChange} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Media Section */}
                <div>
                    <h3 className="text-xl font-semibold text-brand-dark-text dark:text-brand-light-text border-b dark:border-gray-600 pb-2 mb-4">{t('admin_settings_socials')}</h3>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin_settings_facebook_url')}</label>
                            <input type="url" name="facebook" value={settings.socialLinks?.facebook || ''} onChange={handleSocialChange} className={inputClasses} placeholder="https://facebook.com/yourclub" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin_settings_twitter_url')}</label>
                            <input type="url" name="twitter" value={settings.socialLinks?.twitter || ''} onChange={handleSocialChange} className={inputClasses} placeholder="https://twitter.com/yourclub" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin_settings_instagram_url')}</label>
                            <input type="url" name="instagram" value={settings.socialLinks?.instagram || ''} onChange={handleSocialChange} className={inputClasses} placeholder="https://instagram.com/yourclub" />
                        </div>
                    </div>
                </div>
                
                {/* SMTP Config Section */}
                <div>
                    <h3 className="text-xl font-semibold text-brand-dark-text dark:text-brand-light-text border-b dark:border-gray-600 pb-2 mb-4">{t('admin_settings_smtp_title')}</h3>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t('admin_settings_smtp_desc')}
                        </p>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin_settings_smtp_host')}</label>
                            <input type="text" name="host" value={settings.smtpSettings.host} onChange={handleSmtpChange} className={inputClasses} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin_settings_smtp_port')}</label>
                                <input type="number" name="port" value={settings.smtpSettings.port} onChange={handleSmtpChange} className={inputClasses} />
                            </div>
                            <div className="flex items-center pt-6">
                                <input type="checkbox" id="smtpSecure" name="secure" checked={settings.smtpSettings.secure} onChange={handleSmtpChange} className="h-4 w-4 text-brand-green rounded focus:ring-brand-green dark:focus:ring-brand-gold" />
                                <label htmlFor="smtpSecure" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">{t('admin_settings_smtp_secure')}</label>
                            </div>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin_settings_smtp_user')}</label>
                                <input type="text" name="user" value={settings.smtpSettings.user} onChange={handleSmtpChange} className={inputClasses} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin_settings_smtp_pass')}</label>
                                <input type="password" name="pass" value={settings.smtpSettings.pass} onChange={handleSmtpChange} className={inputClasses} />
                            </div>
                        </div>
                        <div>
                            <button type="button" onClick={handleTestConnection} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                                {t('admin_settings_smtp_test')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Maintenance Mode Section */}
                <div>
                    <h3 className="text-xl font-semibold text-brand-dark-text dark:text-brand-light-text border-b dark:border-gray-600 pb-2 mb-4">{t('admin_settings_maintenance')}</h3>
                    <div className="flex items-start bg-yellow-50 dark:bg-yellow-500/10 p-4 rounded-lg">
                        <div className="flex items-center h-5">
                            <input
                                id="isMaintenanceMode"
                                name="isMaintenanceMode"
                                type="checkbox"
                                checked={settings.isMaintenanceMode}
                                onChange={handleChange}
                                className="focus:ring-brand-gold h-4 w-4 text-brand-gold border-gray-300 rounded"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="isMaintenanceMode" className="font-medium text-yellow-800 dark:text-yellow-200">{t('admin_settings_maintenance_label')}</label>
                            <p className="text-yellow-700 dark:text-yellow-300">{t('admin_settings_maintenance_desc')}</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" className="bg-brand-green text-white dark:bg-brand-gold dark:text-brand-dark px-6 py-2 rounded-md hover:bg-brand-green-dark dark:hover:bg-amber-400 transition-colors">
                        {t('admin_settings_save_button')}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default GeneralSettingsManager;