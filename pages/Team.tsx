import React, { useContext, useState, useMemo } from 'react';
import { DataContext } from '../contexts/DataContext';
import PlayerCard from '../components/PlayerCard';
import { HiUsers } from 'react-icons/hi2';
import { motion } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';
import EmptyState from '../components/EmptyState';
import { FaUserPlus, FaArrowLeft } from 'react-icons/fa';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Team: React.FC = () => {
  const { registeredPlayers, teams: allTeamsData } = useContext(DataContext);
  const { t } = useTranslation();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const rosterPlayers = useMemo(() => registeredPlayers.filter(p => p.status === 'assigned'), [registeredPlayers]);
  
  const teamsOnRoster = useMemo(() => {
    const teamNamesWithPlayers = [...new Set(rosterPlayers.map(p => p.team).filter(Boolean))] as string[];
    return allTeamsData
      .filter(team => teamNamesWithPlayers.includes(team.name))
      .sort((a,b) => a.name.localeCompare(b.name));
  }, [rosterPlayers, allTeamsData]);


  const playersInSelectedTeam = useMemo(() => {
    if (!selectedTeam) return [];
    return rosterPlayers.filter(p => p.team === selectedTeam);
  }, [rosterPlayers, selectedTeam]);

  if (selectedTeam) {
    return (
      <div>
        <button onClick={() => setSelectedTeam(null)} className="flex items-center gap-2 text-brand-green dark:text-brand-gold font-semibold hover:underline mb-6">
          <FaArrowLeft />
          {t('team_page_back_to_squads')}
        </button>
        <div className="flex items-center space-x-3 mb-8">
          <HiUsers className="h-10 w-10 text-brand-green dark:text-brand-gold" />
          <h1 className="text-4xl font-bold text-brand-green-dark dark:text-brand-light-text">{selectedTeam}</h1>
        </div>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {playersInSelectedTeam.map(player => (
            <motion.div key={player.id} variants={itemVariants}>
              <PlayerCard player={player} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  }

  return (
    <div>
        <div className="text-center mb-8">
            <HiUsers className="mx-auto h-12 w-12 text-brand-green dark:text-brand-gold" />
            <h1 className="text-4xl font-bold text-brand-green-dark dark:text-brand-light-text mt-4">{t('team_page_title')}</h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">{t('team_page_select_team')}</p>
        </div>
        {teamsOnRoster.length > 0 ? (
            <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {teamsOnRoster.map(team => (
                    <motion.div key={team.id} variants={itemVariants}>
                        <button 
                            onClick={() => setSelectedTeam(team.name)}
                            className="w-full text-left bg-white dark:bg-brand-dark-secondary rounded-lg shadow-lg hover:shadow-xl overflow-hidden hover:-translate-y-2 transition-all duration-300 group"
                        >
                          <div className="h-48 overflow-hidden">
                              <img src={team.photoUrl} alt={team.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                          </div>
                          <div className="p-4">
                              <h2 className="text-xl font-bold text-brand-green-dark dark:text-white">{team.name}</h2>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{team.category}</p>
                          </div>
                        </button>
                    </motion.div>
                ))}
            </motion.div>
        ) : (
            <EmptyState
                icon={FaUserPlus}
                title={t('empty_state_team_title')}
                message={t('empty_state_team_message')}
            />
        )}
    </div>
  );
};

export default Team;