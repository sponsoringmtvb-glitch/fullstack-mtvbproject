import React, { useState, useContext } from 'react';
import PlayerSidebar from '../components/player_dashboard/PlayerSidebar';
import DashboardOverview from '../components/player_dashboard/DashboardOverview';
import UploadDocuments from '../components/player_dashboard/UploadDocuments';
import MyTeamView from '../components/player_dashboard/MyTeamView';
import NotificationsView from '../components/player_dashboard/NotificationsView';
import AccountSettingsView from '../components/player_dashboard/AccountSettingsView';
import type { Player } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { DataContext } from '../contexts/DataContext';
import { FaExclamationTriangle } from 'react-icons/fa';

type PlayerDashboardPage = 'overview' | 'documents' | 'team' | 'notifications' | 'settings';

interface PlayerDashboardProps {
    player: Player;
}

const PlayerDashboard: React.FC<PlayerDashboardProps> = ({ player }) => {
    const initialPage: PlayerDashboardPage = player?.status === 'approved' ? 'documents' : 'overview';
    const [activePage, setActivePage] = useState<PlayerDashboardPage>(initialPage);
    const { t } = useTranslation();
    const { verifyPlayerEmail } = useContext(DataContext);

    if (!player) {
        return <div>Loading player data...</div>;
    }

    const handleVerify = () => {
        verifyPlayerEmail(player.id);
    };

    const VerificationBanner = () => (
        <div className="bg-yellow-100 dark:bg-yellow-500/10 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-200 p-4 mb-6 rounded-r-lg" role="alert">
            <div className="flex">
                <div className="py-1"><FaExclamationTriangle className="h-5 w-5 text-yellow-500 mr-3" /></div>
                <div>
                    <p className="font-bold">{t('player_dashboard_verify_title')}</p>
                    <p className="text-sm">{t('player_dashboard_verify_desc')}</p>
                    <button onClick={handleVerify} className="mt-2 text-sm font-semibold underline hover:no-underline">
                        {t('player_dashboard_verify_button')}
                    </button>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        // Force document upload if status is 'approved'
        if (player.status === 'approved') {
            return <UploadDocuments player={player} />;
        }

        switch(activePage) {
            case 'overview':
                return <DashboardOverview player={player} />;
            case 'documents':
                 return <UploadDocuments player={player} />;
            case 'team':
                 return <MyTeamView player={player} />;
            case 'notifications':
                 return <NotificationsView player={player} />;
            case 'settings':
                 return <AccountSettingsView player={player} />;
            default:
                return <DashboardOverview player={player} />;
        }
    }

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-200px)] bg-brand-light dark:bg-brand-dark rounded-lg shadow-lg">
            <PlayerSidebar activePage={activePage} setActivePage={setActivePage} isLocked={player.status === 'approved'} />
            <main className="flex-grow p-6 md:p-8 overflow-auto">
                {!player.isVerified && player.status === 'pending' && <VerificationBanner />}
                {renderContent()}
            </main>
        </div>
    );
};

export default PlayerDashboard;