import React from 'react';
import type { Player } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { FaBell } from 'react-icons/fa';
import EmptyState from '../EmptyState';

interface NotificationsViewProps {
    player: Player;
}

const NotificationsView: React.FC<NotificationsViewProps> = ({ player }) => {
    const { t } = useTranslation();
    const sortedNotifications = [...player.notifications].reverse();

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                 <FaBell className="h-8 w-8 text-brand-green dark:text-brand-gold" />
                <h2 className="text-3xl font-bold text-brand-dark-text dark:text-brand-light-text">{t('player_dashboard_notifications_title')}</h2>
            </div>
            
            <div className="bg-white dark:bg-brand-dark-secondary rounded-lg shadow-md p-6">
                {sortedNotifications.length > 0 ? (
                    <ul className="space-y-4">
                        {sortedNotifications.map((notification, index) => (
                            <li key={index} className="p-4 bg-gray-50 dark:bg-brand-dark rounded-md border-l-4 border-brand-green dark:border-brand-gold">
                                <p className="text-gray-800 dark:text-gray-200">{notification}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <EmptyState 
                        icon={FaBell}
                        title={t('player_dashboard_notifications_none')}
                        message="Updates about your registration status and team assignments will appear here."
                    />
                )}
            </div>
        </div>
    );
};

export default NotificationsView;