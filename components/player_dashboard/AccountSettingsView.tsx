import React, { useState, useContext } from 'react';
import type { Player } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { DataContext } from '../../contexts/DataContext';
import { FaCog } from 'react-icons/fa';

interface AccountSettingsViewProps {
    player: Player;
}

const AccountSettingsView: React.FC<AccountSettingsViewProps> = ({ player }) => {
    const { t } = useTranslation();
    const { updatePlayerContactInfo } = useContext(DataContext);
    const [formData, setFormData] = useState({
        name: player.name,
        email: player.email,
        phone: player.phone,
    });
    const [isDirty, setIsDirty] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setIsDirty(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updatePlayerContactInfo(player.id, formData);
        setIsDirty(false);
    };

    const inputClasses = "mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-brand-dark focus:ring-brand-green dark:focus:ring-brand-gold focus:border-brand-green dark:focus:border-brand-gold";

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <FaCog className="h-8 w-8 text-brand-green dark:text-brand-gold" />
                <h2 className="text-3xl font-bold text-brand-dark-text dark:text-brand-light-text">{t('account_settings_title')}</h2>
            </div>
            
            <div className="bg-white dark:bg-brand-dark-secondary rounded-lg shadow-md p-8 max-w-2xl mx-auto">
                <p className="text-gray-600 dark:text-gray-400 mb-6">{t('account_settings_desc')}</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('register_name_label')}</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className={inputClasses} />
                    </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('register_email_label')}</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className={inputClasses} />
                    </div>
                     <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('register_phone_label')}</label>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required className={inputClasses} />
                    </div>
                    <div className="flex justify-end">
                        <button 
                            type="submit"
                            disabled={!isDirty}
                            className="bg-brand-green text-white dark:bg-brand-gold dark:text-brand-dark px-6 py-2 rounded-md hover:bg-brand-green-dark dark:hover:bg-amber-400 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            {t('account_settings_save_button')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccountSettingsView;