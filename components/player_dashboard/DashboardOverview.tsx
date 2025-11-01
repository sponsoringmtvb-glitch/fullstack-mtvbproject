import React from 'react';
import type { Player } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { FaUser, FaCheckCircle, FaExclamationCircle, FaClipboardList, FaUsers, FaBell, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';
import classNames from 'classnames';

interface DashboardOverviewProps {
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

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ player }) => {
    const { t } = useTranslation();

    const getStatusInfo = () => {
        switch(player.status) {
            case 'pending': return { text: t('player_dashboard_status_pending'), icon: FaHourglassHalf, color: 'text-yellow-500' };
            case 'approved': return { text: t('player_dashboard_status_approved'), icon: FaExclamationCircle, color: 'text-blue-500' };
            case 'rejected': return { text: t('player_dashboard_status_rejected'), icon: FaTimesCircle, color: 'text-red-500' };
            case 'validated': return { text: t('player_dashboard_status_validated'), icon: FaHourglassHalf, color: 'text-indigo-500' };
            case 'verified': return { text: t('player_dashboard_status_verified'), icon: FaCheckCircle, color: 'text-purple-500' };
            case 'assigned': return { text: t('player_dashboard_status_assigned'), icon: FaCheckCircle, color: 'text-green-500' };
            default: return { text: player.status, icon: FaExclamationCircle, color: 'text-gray-500' };
        }
    };

    const statusInfo = getStatusInfo();

    return (
        <div>
            <h2 className="text-3xl font-bold text-brand-dark-text dark:text-brand-light-text mb-6">{t('player_dashboard_welcome')}, {player.name}!</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile & Status */}
                <div className="space-y-6">
                    <InfoCard title={t('player_dashboard_profile_title')} icon={FaUser}>
                        <p><strong>{t('register_email_label')}:</strong> {player.email}</p>
                        <p><strong>{t('register_phone_label')}:</strong> {player.phone}</p>
                        <p><strong>{t('register_dob_label')}:</strong> {new Date(player.dob).toLocaleDateString()}</p>
                    </InfoCard>

                    <InfoCard title={t('player_dashboard_status_title')} icon={statusInfo.icon}>
                        <p className={classNames("text-lg font-semibold", statusInfo.color)}>{statusInfo.text}</p>
                    </InfoCard>

                     <InfoCard title={t('player_dashboard_documents_title')} icon={FaClipboardList}>
                        <ul className="list-disc list-inside space-y-1">
                            <li className={player.documents.idCard ? 'text-green-500' : 'text-red-500'}>{t('docs_upload_id')}</li>
                            <li className={player.documents.parentalAuth ? 'text-green-500' : 'text-gray-400'}>{t('docs_upload_parental')}</li>
                            <li className={player.documents.medicalCert ? 'text-green-500' : 'text-red-500'}>{t('docs_upload_medical')}</li>
                        </ul>
                    </InfoCard>
                </div>

                {/* Team & Notifications */}
                <div className="space-y-6">
                    <InfoCard title={t('player_dashboard_team_title')} icon={FaUsers}>
                         <p><strong>{t('player_dashboard_category_title')}:</strong> <span className="font-bold text-brand-green dark:text-brand-gold">{
                            (() => {
                                const key = `category_${player.category}`;
                                const translated = t(key);
                                return translated === key ? player.category : translated;
                            })()
                         }</span></p>
                         <p><strong>{t('player_dashboard_team_title')}:</strong> {player.team ? <span className="font-bold text-brand-green dark:text-brand-gold">{player.team}</span> : t('player_dashboard_team_unassigned')}</p>
                    </InfoCard>

                    <InfoCard title={t('player_dashboard_notifications_title')} icon={FaBell}>
                        {player.notifications && player.notifications.length > 0 ? (
                            <ul className="space-y-2">
                                {[...player.notifications].reverse().slice(0, 5).map((notif, i) => (
                                    <li key={i} className="text-sm bg-gray-100 dark:bg-brand-dark p-2 rounded-md">{notif}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>{t('player_dashboard_notifications_none')}</p>
                        )}
                    </InfoCard>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;