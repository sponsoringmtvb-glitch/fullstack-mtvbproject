import React from 'react';
import classNames from 'classnames';
import { useTranslation } from '../../hooks/useTranslation';
import { FaHome, FaFileUpload, FaUsers, FaBell, FaCog } from 'react-icons/fa';

type PlayerDashboardPage = 'overview' | 'documents' | 'team' | 'notifications' | 'settings';

interface PlayerSidebarProps {
    activePage: PlayerDashboardPage;
    setActivePage: (page: PlayerDashboardPage) => void;
    isLocked: boolean;
}

const PlayerSidebar: React.FC<PlayerSidebarProps> = ({ activePage, setActivePage, isLocked }) => {
    const { t } = useTranslation();

    const navItems = [
        { id: 'overview', label: t('player_dashboard_nav_overview'), icon: FaHome },
        { id: 'documents', label: t('player_dashboard_nav_documents'), icon: FaFileUpload },
        { id: 'team', label: t('player_dashboard_nav_team'), icon: FaUsers },
        { id: 'notifications', label: t('player_dashboard_nav_notifications'), icon: FaBell },
        { id: 'settings', label: t('player_dashboard_nav_settings'), icon: FaCog },
    ] as const;

    return (
        <aside className="w-full md:w-64 bg-brand-green-dark dark:bg-brand-dark-secondary text-white p-4 md:p-6 flex-shrink-0 rounded-t-lg md:rounded-tr-none md:rounded-l-lg">
            <h1 className="text-2xl font-bold mb-8 text-brand-light-text">{t('player_dashboard_title')}</h1>
            <nav>
                <ul>
                    {navItems.map(item => (
                        <li key={item.id}>
                            <button 
                                onClick={() => setActivePage(item.id)}
                                disabled={isLocked && item.id !== 'documents'}
                                className={classNames(
                                    'w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors duration-200', {
                                    'bg-brand-green text-white dark:bg-brand-gold dark:text-brand-dark font-bold': activePage === item.id,
                                    'text-gray-200 hover:bg-brand-green dark:text-brand-light-text dark:hover:bg-gray-700': activePage !== item.id,
                                    'opacity-50 cursor-not-allowed': isLocked && item.id !== 'documents'
                                })}
                            >
                                <item.icon className="h-5 w-5" />
                                <span>{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default PlayerSidebar;