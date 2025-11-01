import React, { useContext, useState, useMemo, useEffect } from 'react';
import { DataContext } from '../contexts/DataContext';
import { useTranslation } from '../hooks/useTranslation';
import { FaTrophy } from 'react-icons/fa';
import classNames from 'classnames';

const Classement: React.FC = () => {
    const { standings, teams, generalSettings } = useContext(DataContext);
    const { t } = useTranslation();

    const placeholderLogo = 'https://via.placeholder.com/150x150/cccccc/808080?text=?';

    const availableCategories = useMemo(() => {
        return Object.keys(standings).sort();
    }, [standings]);

    const [activeTab, setActiveTab] = useState<string>('');
    
    useEffect(() => {
        if (availableCategories.length > 0 && !availableCategories.includes(activeTab)) {
            setActiveTab(availableCategories[0]);
        }
    }, [availableCategories, activeTab]);

    const sortedStandings = useMemo(() => {
        if (!activeTab || !standings[activeTab]) return [];
        // Sort by Points (desc), then Wins (desc)
        return [...standings[activeTab]].sort((a, b) => {
            if (b.points !== a.points) {
                return b.points - a.points;
            }
            return b.wins - a.wins;
        });
    }, [standings, activeTab]);

    return (
        <div>
            <div className="text-center mb-8">
                <FaTrophy className="mx-auto h-12 w-12 text-brand-green dark:text-brand-gold" />
                <h1 className="text-4xl font-bold text-brand-green-dark dark:text-brand-light-text mt-4">{t('classement_page_title')}</h1>
            </div>

            <div className="mb-4 flex flex-wrap justify-center border-b border-gray-200 dark:border-gray-700">
                {availableCategories.map(category => (
                    <button
                        key={category}
                        onClick={() => setActiveTab(category)}
                        className={classNames(
                            "py-2 px-4 font-semibold text-lg focus:outline-none transition-colors duration-200 capitalize", {
                            'border-b-2 border-brand-green text-brand-green dark:text-brand-gold dark:border-brand-gold': activeTab === category,
                            'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white': activeTab !== category
                        })}
                    >
                        {
                            (() => {
                                const key = `category_${category.replace(/ /g, '_')}`;
                                const translated = t(key);
                                return translated === key ? category : translated;
                            })()
                        }
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-brand-dark-secondary rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-4 py-3 w-12 text-center">{t('classement_rank')}</th>
                            <th scope="col" className="px-6 py-3">{t('classement_team')}</th>
                            <th scope="col" className="px-4 py-3 text-center" title={t('classement_pts')}>{t('classement_pts')}</th>
                            <th scope="col" className="px-4 py-3 text-center" title={t('classement_played')}>{t('classement_played')}</th>
                            <th scope="col" className="px-4 py-3 text-center" title={t('classement_wins')}>{t('classement_wins')}</th>
                            <th scope="col" className="px-4 py-3 text-center" title={t('classement_losses')}>{t('classement_losses')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedStandings.map((item, index) => {
                            const team = teams.find(t => t.name === item.teamName);
                            const isOurTeam = generalSettings && item.teamName === generalSettings.clubName;
                            return (
                                <tr key={item.id} className={classNames("border-b dark:border-gray-700", {
                                    'bg-green-50 dark:bg-brand-gold/10': isOurTeam,
                                    'hover:bg-gray-50 dark:hover:bg-gray-600': !isOurTeam
                                })}>
                                    <td className={classNames("px-4 py-4 text-center font-bold", {
                                        'text-brand-green-dark dark:text-brand-gold': isOurTeam,
                                        'text-gray-700 dark:text-gray-300': !isOurTeam
                                    })}>{index + 1}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                                        <img src={team?.logo || placeholderLogo} alt={item.teamName} className="h-8 w-8 object-contain rounded-full bg-gray-100 dark:bg-gray-700 p-1" />
                                        <span className={classNames({'font-bold': isOurTeam})}>{item.teamName}</span>
                                    </td>
                                    <td className="px-4 py-4 text-center font-bold text-lg text-brand-dark-text dark:text-white">{item.points}</td>
                                    <td className="px-4 py-4 text-center text-gray-600 dark:text-gray-400">{item.played}</td>
                                    <td className="px-4 py-4 text-center font-semibold text-green-600 dark:text-green-400">{item.wins}</td>
                                    <td className="px-4 py-4 text-center font-semibold text-red-600 dark:text-red-400">{item.losses}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Classement;