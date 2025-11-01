import React from 'react';
import type { Player } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { FaUsers, FaTags } from 'react-icons/fa';

interface MyTeamViewProps {
    player: Player;
}

const InfoCard: React.FC<{title: string, icon: React.ElementType, children: React.ReactNode}> = ({ title, icon: Icon, children }) => (
    <div className="bg-white dark:bg-brand-dark-secondary rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
            <Icon className="h-6 w-6 text-brand-green dark:text-brand-gold mr-3" />
            <h3 className="text-xl font-bold text-brand-dark-text dark:text-brand-light-text">{title}</h3>
        </div>
        <div>{children}</div>
    </div>
);


const MyTeamView: React.FC<MyTeamViewProps> = ({ player }) => {
    const { t } = useTranslation();
    
    return (
        <div>
            <h2 className="text-3xl font-bold text-brand-dark-text dark:text-brand-light-text mb-6">{t('player_dashboard_nav_team')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard title={t('player_dashboard_category_title')} icon={FaTags}>
                    <p className="text-2xl font-bold text-brand-green-dark dark:text-white">
                        {
                            (() => {
                                const key = `category_${player.category}`;
                                const translated = t(key);
                                return translated === key ? player.category : translated;
                            })()
                        }
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">This category is automatically assigned based on your year of birth.</p>
                </InfoCard>
                <InfoCard title={t('player_dashboard_team_title')} icon={FaUsers}>
                     {player.team ? (
                        <p className="text-2xl font-bold text-brand-green-dark dark:text-white">{player.team}</p>
                     ) : (
                        <p className="text-lg text-gray-500 dark:text-gray-400">{t('player_dashboard_team_unassigned')}</p>
                     )}
                </InfoCard>
            </div>
        </div>
    );
};

export default MyTeamView;