import React, { useContext } from 'react';
import type { Match } from '../types';
import { DataContext } from '../contexts/DataContext';
import { FaTrophy } from 'react-icons/fa';
import { useTranslation } from '../hooks/useTranslation';
import classNames from 'classnames';

interface MatchCardProps {
  match: Match;
}

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const { registeredPlayers, teams, generalSettings } = useContext(DataContext);
  const { t } = useTranslation();
  const isUpcoming = new Date(match.date) >= new Date();
  const formattedDate = new Date(match.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const formattedTime = new Date(match.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const playerOfTheMatch = registeredPlayers.find(p => p.id === match.playerOfTheMatchId);

  const ourTeam = { name: generalSettings.clubName, logo: generalSettings.logoUrl };
  const opponentTeam = teams.find(t => t.name === match.opponent);
  const placeholderLogo = 'https://via.placeholder.com/150x150/cccccc/808080?text=?';
  
  const isYouthMatch = match.category.startsWith('U18') || match.category.startsWith('U16');

  return (
    <div className={classNames(
        "bg-white dark:bg-brand-dark-secondary rounded-lg shadow-lg overflow-hidden relative",
        {
            'border-b-4 border-brand-green dark:border-brand-gold': !isYouthMatch,
            'border-b-4 border-cyan-500 dark:border-cyan-400 bg-white dark:bg-brand-dark-secondary': isYouthMatch
        }
    )}>
      {isYouthMatch && (
         <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M0%200h40v40H0z%22%20/%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30 dark:opacity-10"></div>
      )}
      <div className="p-6 flex items-center justify-around text-center relative">
          {/* Team 1 (Our Team) */}
          <div className="flex-1 flex flex-col items-center justify-center space-y-2">
            <img src={ourTeam.logo} alt={ourTeam.name} className="h-16 w-16 object-contain" />
            <span className="font-bold text-lg text-brand-dark-text dark:text-white line-clamp-2">{ourTeam.name}</span>
            {match.isHome && <span className="text-xs font-semibold bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">{t('match_card_home')}</span>}
          </div>

          {/* Score / Time Info */}
          <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
            {isUpcoming ? (
              <>
                <span className={classNames("font-display font-black text-4xl text-brand-dark-text dark:text-brand-light-text", { 'text-cyan-600 dark:text-cyan-400': isYouthMatch })}>VS</span>
                <span className={classNames("text-sm font-bold text-brand-green-dark dark:text-brand-gold mt-1", { 'text-cyan-500 dark:text-cyan-300': isYouthMatch })}>{formattedTime}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</span>
              </>
            ) : (
              match.result && (
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <span className={`text-4xl sm:text-5xl font-extrabold font-display ${match.result.ourScore > match.result.opponentScore ? 'text-brand-green-dark dark:text-brand-gold' : 'text-gray-600 dark:text-gray-400'}`}>
                    {match.result.ourScore}
                  </span>
                  <span className="text-xl sm:text-2xl font-light text-gray-400">-</span>
                  <span className={`text-4xl sm:text-5xl font-extrabold font-display ${match.result.ourScore < match.result.opponentScore ? 'text-brand-green-dark dark:text-brand-gold' : 'text-gray-600 dark:text-gray-400'}`}>
                    {match.result.opponentScore}
                  </span>
                </div>
              )
            )}
          </div>

          {/* Team 2 (Opponent) */}
          <div className="flex-1 flex flex-col items-center justify-center space-y-2">
            <img src={opponentTeam?.logo || placeholderLogo} alt={match.opponent} className="h-16 w-16 object-contain" />
            <span className="font-bold text-lg text-brand-dark-text dark:text-white line-clamp-2">{match.opponent}</span>
            {!match.isHome && <span className="text-xs font-semibold bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">{t('match_card_away')}</span>}
          </div>
      </div>
       <div className={classNames("absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full uppercase", {
           'bg-brand-green-dark text-white dark:bg-brand-dark-secondary dark:text-brand-gold': !isYouthMatch,
           'bg-cyan-500 text-white dark:bg-cyan-500/20 dark:text-cyan-300': isYouthMatch
       })}>
        {match.category}
      </div>

      {playerOfTheMatch && (
        <div className="py-2 border-t border-gray-200 dark:border-gray-700/50 flex items-center justify-center space-x-2 bg-gray-50 dark:bg-brand-dark">
            <FaTrophy className="text-yellow-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('match_card_potm')}:</span>
            <span className="text-sm text-brand-green-dark dark:text-white font-bold">{playerOfTheMatch.name}</span>
        </div>
      )}
    </div>
  );
};

export default MatchCard;