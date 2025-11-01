import React, { useState } from 'react';
import type { Player } from '../types';
import Modal from './Modal';
import { motion } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';
import classNames from 'classnames';

interface PlayerCardProps {
  player: Player;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  const [isBioVisible, setIsBioVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'bio' | 'stats'>('bio');
  const { t } = useTranslation();

  const StatItem = ({ label, value }: { label: string, value: number | string }) => (
    <div className="flex justify-between items-center py-3 px-4 bg-gray-50 dark:bg-brand-dark rounded-lg">
      <span className="text-gray-600 dark:text-gray-300 font-medium">{label}</span>
      <span className="text-brand-green-dark dark:text-brand-gold font-bold text-lg">{value}</span>
    </div>
  );

  return (
    <>
      <motion.div 
        className="bg-white dark:bg-brand-dark-secondary rounded-lg shadow-lg overflow-hidden flex flex-col h-full cursor-pointer group"
        whileHover={{ y: -8 }}
        transition={{ type: 'spring', stiffness: 300 }}
        onClick={() => setIsBioVisible(true)}
      >
        <div className="relative">
          <img className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-110" src={player.imageUrl} alt={player.name} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="absolute -top-8 right-4 bg-black/50 text-white dark:bg-brand-dark/80 dark:text-brand-gold text-4xl font-black font-display px-3 py-1 rounded-lg shadow-lg">
              #{player.number}
            </div>
            <h3 className="text-3xl font-bold font-display uppercase tracking-wide">{player.name}</h3>
            <p className="text-brand-accent-light dark:text-brand-gold font-semibold text-lg">{t(`position_${player.position.toLowerCase().replace(/ /g, '_')}`)}</p>
          </div>
        </div>
      </motion.div>

      {isBioVisible && (
        <Modal isOpen={isBioVisible} onClose={() => setIsBioVisible(false)}>
          <div className="bg-white dark:bg-brand-dark-secondary rounded-lg p-6 sm:p-8 max-w-2xl w-full text-brand-dark-text dark:text-brand-light-text max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-8">
              <img src={player.imageUrl} alt={player.name} className="w-32 h-32 rounded-full mb-4 sm:mb-0 object-cover border-4 border-brand-accent-light dark:border-brand-gold flex-shrink-0" />
              <div className="text-center sm:text-left">
                <h2 className="text-3xl font-bold text-brand-green-dark dark:text-white mb-1 font-display uppercase">{player.name}</h2>
                <p className="text-brand-green dark:text-brand-gold font-semibold text-lg mb-1">#{player.number} | {t(`position_${player.position.toLowerCase().replace(/ /g, '_')}`)}</p>
                <p className="text-gray-500 dark:text-gray-400 text-md mb-4">{t('player_card_height')}: {player.height}</p>
              </div>
            </div>
            
            <div className="my-6">
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button 
                  onClick={() => setActiveTab('bio')}
                  className={classNames("py-2 px-4 font-semibold text-sm focus:outline-none transition-colors duration-200", {
                    'border-b-2 border-brand-green text-brand-green dark:text-brand-gold dark:border-brand-gold': activeTab === 'bio',
                    'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white': activeTab !== 'bio'
                  })}
                >
                  {t('player_modal_tab_bio')}
                </button>
                <button 
                  onClick={() => setActiveTab('stats')}
                  className={classNames("py-2 px-4 font-semibold text-sm focus:outline-none transition-colors duration-200", {
                    'border-b-2 border-brand-green text-brand-green dark:text-brand-gold dark:border-brand-gold': activeTab === 'stats',
                    'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white': activeTab !== 'stats'
                  })}
                >
                  {t('player_modal_tab_stats')}
                </button>
              </div>

              <div className="pt-6">
                {activeTab === 'bio' ? (
                   <p className="text-gray-600 dark:text-gray-300 text-base text-left leading-relaxed">{player.bio}</p>
                ) : (
                  <div className="space-y-3">
                    <StatItem label={t('player_stats_matches')} value={player.stats.matchesPlayed} />
                    <StatItem label={t('player_stats_points')} value={player.stats.points} />
                    <StatItem label={t('player_stats_blocks')} value={player.stats.blocks} />
                    <StatItem label={t('player_stats_aces')} value={player.stats.aces} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default PlayerCard;