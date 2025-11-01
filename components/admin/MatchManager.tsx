import React, { useState, useContext } from 'react';
import { DataContext } from '../../contexts/DataContext';
import type { Match } from '../../types';
import MatchForm from './MatchForm';
import { useTranslation } from '../../hooks/useTranslation';
import { FaEdit, FaTrash, FaPlus, FaBroadcastTower, FaClipboardList } from 'react-icons/fa';
import classNames from 'classnames';
import ScoreManager from './ScoreManager';

const MatchManager = () => {
    const { matches, deleteMatch, liveMatchId, setLiveMatchId } = useContext(DataContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMatch, setEditingMatch] = useState<Match | null>(null);
    const [scoreManagerMatch, setScoreManagerMatch] = useState<Match | null>(null);
    const { t } = useTranslation();

    const handleAdd = () => {
        setEditingMatch(null);
        setIsModalOpen(true);
    };

    const handleEdit = (match: Match) => {
        setEditingMatch(match);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm(t('admin_matches_delete_confirm'))) {
            deleteMatch(id);
        }
    };

    const handleLiveToggle = (matchId: number) => {
        if (liveMatchId === matchId) {
            setLiveMatchId(null);
        } else {
            setLiveMatchId(matchId);
        }
    };

    const handleManageScore = (match: Match) => {
        setScoreManagerMatch(match);
    };
    
    return (
        <section>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('admin_matches_title')}</h2>
                <button 
                    onClick={handleAdd} 
                    className="flex items-center bg-brand-green text-white dark:bg-brand-gold dark:text-brand-dark px-4 py-2 rounded-md hover:bg-brand-green-dark dark:hover:bg-amber-400 transition-colors"
                >
                    <FaPlus className="mr-2" />
                    {t('admin_matches_add_button')}
                </button>
            </div>
            <div className="bg-white dark:bg-brand-dark-secondary p-4 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('admin_matches_table_date')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin_matches_table_category')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin_matches_table_opponent')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin_matches_table_result')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin_matches_table_actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...matches].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(match => {
                            const isUpcoming = new Date(match.date) > new Date();
                            const isLive = liveMatchId === match.id;

                            return (
                                <tr key={match.id} className="bg-white dark:bg-brand-dark-secondary border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4">{new Date(match.date).toLocaleString()}</td>
                                <td className="px-6 py-4">{match.category}</td>
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{match.opponent}</td>
                                <td className="px-6 py-4">
                                    {isLive ? <span className="text-red-500 font-bold animate-pulse">LIVE ({match.liveScore?.ourSets}-{match.liveScore?.opponentSets})</span> : 
                                    (match.result ? 
                                        `${match.result.ourScore} - ${match.result.opponentScore}` : 
                                        <span className="text-gray-400">{t('admin_matches_upcoming')}</span>)
                                    }
                                </td>
                                <td className="px-6 py-4 flex items-center space-x-2 flex-wrap gap-y-2">
                                    {isUpcoming && (
                                        <>
                                        <button 
                                            onClick={() => handleLiveToggle(match.id)}
                                            disabled={!!liveMatchId && !isLive}
                                            className={classNames("flex items-center gap-2 px-2 py-1 text-xs rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed", {
                                                "bg-red-500 hover:bg-red-600 text-white": isLive,
                                                "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-500/10 dark:text-green-300 dark:hover:bg-green-500/20": !isLive
                                            })}
                                            title={isLive ? t('admin_matches_end_live') : t('admin_matches_go_live')}
                                        >
                                           <FaBroadcastTower size={14} />
                                           <span>{isLive ? t('admin_matches_end_live') : t('admin_matches_go_live')}</span>
                                        </button>
                                         {isLive && (
                                            <button
                                                onClick={() => handleManageScore(match)}
                                                className="flex items-center gap-2 px-2 py-1 text-xs rounded-md transition-colors bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/20"
                                                title={t('admin_matches_manage_score')}
                                            >
                                                <FaClipboardList size={14} />
                                                <span>{t('admin_matches_manage_score')}</span>
                                            </button>
                                        )}
                                        </>
                                    )}
                                    <button onClick={() => handleEdit(match)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" aria-label={t('match_form_edit_title')}><FaEdit size={18} /></button>
                                    <button onClick={() => handleDelete(match.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" aria-label={t('admin_matches_delete_button')}><FaTrash size={18} /></button>
                                </td>
                            </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <MatchForm
                    match={editingMatch}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
             {scoreManagerMatch && (
                <ScoreManager
                    match={scoreManagerMatch}
                    onClose={() => setScoreManagerMatch(null)}
                />
            )}
        </section>
    );
}

export default MatchManager;