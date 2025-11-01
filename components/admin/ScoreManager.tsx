import React, { useState, useContext, useEffect } from 'react';
import { DataContext } from '../../contexts/DataContext';
import type { Match, LiveScore } from '../../types';
import Modal from '../Modal';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { useTranslation } from '../../hooks/useTranslation';

interface ScoreManagerProps {
    match: Match;
    onClose: () => void;
}

const ScoreManager: React.FC<ScoreManagerProps> = ({ match, onClose }) => {
    const { updateLiveScore, generalSettings } = useContext(DataContext);
    const { t } = useTranslation();
    
    const [score, setScore] = useState<LiveScore>(
        match.liveScore || { ourSets: 0, opponentSets: 0, ourPoints: 0, opponentPoints: 0, currentSet: 1, servingTeam: 'us' }
    );

    useEffect(() => {
        // This is a simple implementation. For a real-time app, you might debounce this
        // or use websockets to push updates.
        updateLiveScore(match.id, score);
    }, [score, match.id, updateLiveScore]);

    const handleScoreChange = (field: keyof LiveScore, delta: number) => {
        setScore(prev => ({
            ...prev,
            [field]: Math.max(0, (prev[field] as number) + delta)
        }));
    };

    const handleServingTeamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setScore(prev => ({
            ...prev,
            servingTeam: e.target.value as 'us' | 'opponent'
        }));
    };

    const ScoreControl: React.FC<{ label: string, value: number, onIncrement: () => void, onDecrement: () => void }> = ({ label, value, onIncrement, onDecrement }) => (
        <div className="flex items-center justify-between">
            <span className="text-lg font-medium">{label}</span>
            <div className="flex items-center gap-4">
                <button type="button" onClick={onDecrement} className="p-2 bg-gray-200 dark:bg-gray-600 rounded-full"><FaMinus /></button>
                <span className="text-4xl font-bold w-12 text-center">{value}</span>
                <button type="button" onClick={onIncrement} className="p-2 bg-gray-200 dark:bg-gray-600 rounded-full"><FaPlus /></button>
            </div>
        </div>
    );

    return (
        <Modal isOpen={true} onClose={onClose}>
            <div className="bg-white dark:bg-brand-dark-secondary rounded-lg p-8 max-w-2xl w-full text-gray-800 dark:text-gray-200">
                <h2 className="text-2xl font-bold mb-2 text-brand-dark-text dark:text-brand-light-text">{t('score_manager_title')}</h2>
                <p className="text-sm text-gray-500 mb-6">{generalSettings.clubName} vs {match.opponent}</p>

                <div className="space-y-6">
                    {/* Sets */}
                    <div>
                        <h3 className="text-xl font-semibold mb-3">{t('score_manager_sets')}</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <ScoreControl label={generalSettings.clubName} value={score.ourSets} onIncrement={() => handleScoreChange('ourSets', 1)} onDecrement={() => handleScoreChange('ourSets', -1)} />
                            <ScoreControl label={match.opponent} value={score.opponentSets} onIncrement={() => handleScoreChange('opponentSets', 1)} onDecrement={() => handleScoreChange('opponentSets', -1)} />
                        </div>
                    </div>

                    {/* Points */}
                    <div>
                        <h3 className="text-xl font-semibold mb-3">{t('score_manager_points')}</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <ScoreControl label={generalSettings.clubName} value={score.ourPoints} onIncrement={() => handleScoreChange('ourPoints', 1)} onDecrement={() => handleScoreChange('ourPoints', -1)} />
                            <ScoreControl label={match.opponent} value={score.opponentPoints} onIncrement={() => handleScoreChange('opponentPoints', 1)} onDecrement={() => handleScoreChange('opponentPoints', -1)} />
                        </div>
                    </div>

                    {/* Current Set & Serving Team */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t dark:border-gray-600">
                         <div>
                            <h3 className="text-xl font-semibold mb-3">{t('score_manager_current_set')}</h3>
                            <ScoreControl label="" value={score.currentSet} onIncrement={() => handleScoreChange('currentSet', 1)} onDecrement={() => handleScoreChange('currentSet', -1)} />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-3">{t('score_manager_serving_team')}</h3>
                            <div className="space-y-2 pt-2">
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="servingTeam" value="us" checked={score.servingTeam === 'us'} onChange={handleServingTeamChange} className="form-radio text-brand-green dark:text-brand-gold" />
                                    <span>{generalSettings.clubName}</span>
                                </label>
                                 <label className="flex items-center gap-2">
                                    <input type="radio" name="servingTeam" value="opponent" checked={score.servingTeam === 'opponent'} onChange={handleServingTeamChange} className="form-radio text-brand-green dark:text-brand-gold" />
                                    <span>{match.opponent}</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-8">
                    <button onClick={onClose} className="bg-brand-green text-white dark:bg-brand-gold dark:text-brand-dark px-6 py-2 rounded-md hover:bg-brand-green-dark dark:hover:bg-amber-400">
                        {t('score_manager_close')}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ScoreManager;