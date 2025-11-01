import React, { useContext } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { FaTools } from 'react-icons/fa';
import { DataContext } from '../contexts/DataContext';
import { useTheme } from '../hooks/useTheme';
import { Page } from '../constants';

interface MaintenancePageProps {
    onNavigate: (page: Page) => void;
}

const MaintenancePage: React.FC<MaintenancePageProps> = ({ onNavigate }) => {
    const { t } = useTranslation();
    const { generalSettings } = useContext(DataContext);
    const { theme } = useTheme();

    return (
        <div className={`${theme} min-h-screen flex flex-col items-center justify-center bg-brand-light dark:bg-brand-dark text-center p-4`}>
            <div className="max-w-md">
                <FaTools className="mx-auto h-16 w-16 text-brand-green dark:text-brand-gold mb-6 animate-bounce" />
                <h1 className="text-4xl font-extrabold text-brand-dark-text dark:text-brand-light-text mb-4 font-display">
                    {t('maintenance_title')}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                    {t('maintenance_message')}
                </p>
                <button
                    onClick={() => onNavigate(Page.Login)}
                    className="bg-brand-green text-white dark:bg-brand-gold dark:text-brand-dark font-bold py-3 px-8 rounded-lg hover:bg-brand-green-dark dark:hover:bg-amber-400 transition duration-300 transform hover:scale-105"
                >
                    {t('admin_login_button_maintenance')}
                </button>
                <div className="mt-8">
                    <img src={generalSettings.logoUrl} alt={generalSettings.clubName} className="mx-auto h-12" />
                </div>
            </div>
        </div>
    );
};

export default MaintenancePage;