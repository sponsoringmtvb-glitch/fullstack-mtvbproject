import React, { useState, useEffect, useContext, useMemo } from 'react';
import type { Match } from '../../types';
import Modal from '../Modal';
import { useTranslation } from '../../hooks/useTranslation';
import { DataContext } from '../../contexts/DataContext';

interface MatchFormProps {
  match: Match | null;
  onClose: () => void;
}

const emptyMatch: Omit<Match, 'id'> = {
  opponent: '',
  date: new Date().toISOString().slice(0, 16),
  location: '',
  isHome: false,
  category: '',
  result: undefined,
  playerOfTheMatchId: undefined,
  liveStreamUrl: '',
};

const MatchForm: React.FC<MatchFormProps> = ({ match, onClose }) => {
  const [formData, setFormData] = useState<Omit<Match, 'id'>>(emptyMatch);
  const [scores, setScores] = useState({ ourScore: '', opponentScore: '' });
  const { registeredPlayers: players, teams, addMatch, updateMatch } = useContext(DataContext);
  const { t } = useTranslation();

  const teamCategories = useMemo(() => [...new Set(teams.map(t => t.category))], [teams]);
  const opponentsForCategory = useMemo(() => {
      if (!formData.category) return [];
      return teams.filter(t => t.category === formData.category);
  }, [teams, formData.category]);

  const isFutureMatch = useMemo(() => new Date(formData.date) > new Date(), [formData.date]);


  useEffect(() => {
    if (match) {
        const { id, ...matchData } = match;
        setFormData({ ...matchData, date: new Date(matchData.date).toISOString().slice(0, 16) });
        setScores({
            ourScore: match.result?.ourScore?.toString() ?? '',
            opponentScore: match.result?.opponentScore?.toString() ?? '',
        });
    } else {
        setFormData(emptyMatch);
        setScores({ ourScore: '', opponentScore: '' });
    }
  }, [match]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name === 'category') {
        setFormData(prev => ({ ...prev, opponent: '', [name]: value }));
    } else {
        const newValue = type === 'checkbox' && e.target instanceof HTMLInputElement ? e.target.checked : value;
        setFormData(prev => ({ ...prev, [name]: newValue }));
    }
  };
  
  const handleResultChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'playerOfTheMatchId') {
        const pId = value ? parseInt(value) : undefined;
        setFormData(prev => ({...prev, playerOfTheMatchId: pId}));
    } else {
         setScores(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const ourScore = scores.ourScore;
    const oppScore = scores.opponentScore;

    const finalResult = (ourScore !== '' && oppScore !== '')
        ? { ourScore: Number(ourScore), opponentScore: Number(oppScore) }
        : undefined;

    const matchPayload: Omit<Match, 'id'> = {
        ...formData,
        date: new Date(formData.date).toISOString(),
        result: finalResult,
        playerOfTheMatchId: finalResult ? formData.playerOfTheMatchId : undefined
    };

    if (match) {
      updateMatch({ ...matchPayload, id: match.id });
    } else {
      addMatch(matchPayload);
    }
    onClose();
  };
  
  const inputClasses = "mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-brand-dark focus:ring-brand-green dark:focus:ring-brand-gold focus:border-brand-green dark:focus:border-brand-gold disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed";

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="bg-white dark:bg-brand-dark-secondary rounded-lg p-8 max-w-2xl w-full text-gray-800 dark:text-gray-200 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-brand-dark-text dark:text-brand-light-text">{match ? t('match_form_edit_title') : t('match_form_add_title')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('match_form_category')}</label>
              <select name="category" value={formData.category} onChange={handleChange} required className={inputClasses}>
                <option value="">Select Category...</option>
                {teamCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('match_form_opponent')}</label>
              <select name="opponent" value={formData.opponent} onChange={handleChange} required className={inputClasses} disabled={!formData.category}>
                <option value="">Select Opponent...</option>
                {opponentsForCategory.map(opp => <option key={opp.id} value={opp.name}>{opp.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('match_form_date')}</label>
              <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} required className={inputClasses}/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('match_form_location')}</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} required className={inputClasses}/>
            </div>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="isHome" name="isHome" checked={formData.isHome} onChange={handleChange} className="h-4 w-4 text-brand-green dark:text-brand-gold border-gray-300 dark:border-gray-600 rounded focus:ring-brand-green dark:focus:ring-brand-gold"/>
            <label htmlFor="isHome" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">{t('match_form_is_home')}</label>
          </div>

          <div>
            <label htmlFor="liveStreamUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('match_form_livestream_url')}</label>
            <input
              type="url"
              id="liveStreamUrl"
              name="liveStreamUrl"
              value={formData.liveStreamUrl || ''}
              onChange={handleChange}
              placeholder="https://www.youtube.com/watch?v=..."
              className={inputClasses}
            />
          </div>

          <fieldset className="pt-4 disabled:opacity-50" disabled={isFutureMatch}>
            <legend className="text-lg font-semibold text-gray-800 dark:text-white border-b dark:border-gray-600 pb-2 mb-4 w-full">{t('match_form_result_heading')}</legend>
            {isFutureMatch && <p className="text-xs text-yellow-600 dark:text-yellow-400 -mt-3 mb-3">Result can only be added after the match has started.</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid grid-cols-2 gap-2 items-center">
                    <input type="number" name="ourScore" placeholder={t('match_form_our_score')} value={scores.ourScore} onChange={handleResultChange} className={inputClasses}/>
                    <input type="number" name="opponentScore" placeholder={t('match_form_opponent_score')} value={scores.opponentScore} onChange={handleResultChange} className={inputClasses}/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('match_form_potm')}</label>
                    <select name="playerOfTheMatchId" value={formData.playerOfTheMatchId || ''} onChange={handleResultChange} className={inputClasses}>
                        <option value="">{t('match_form_select_player')}</option>
                        {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
            </div>
          </fieldset>
          
          <div className="flex justify-end space-x-4 pt-6">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">{t('player_form_cancel')}</button>
            <button type="submit" className="bg-brand-green text-white dark:bg-brand-gold dark:text-brand-dark px-4 py-2 rounded-md hover:bg-brand-green-dark dark:hover:bg-amber-400">{t('match_form_save')}</button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default MatchForm;