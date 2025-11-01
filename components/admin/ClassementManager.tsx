import React, { useState, useContext, useMemo } from 'react';
import { DataContext } from '../../contexts/DataContext';
import { useTranslation } from '../../hooks/useTranslation';
import { FaPlus, FaTrash } from 'react-icons/fa';

const ClassementManager: React.FC = () => {
    const { trackedStandingCategories, addTrackedCategory, removeTrackedCategory, teams, categoryRules } = useContext(DataContext);
    const { t } = useTranslation();
    const [newCategory, setNewCategory] = useState('');

    const allPossibleCategories = useMemo(() => {
        const fromTeams = teams.map(t => t.category);
        const fromRules = categoryRules.map(r => r.name);
        return [...new Set([...fromTeams, ...fromRules])].sort();
    }, [teams, categoryRules]);

    const handleAdd = () => {
        if (newCategory && !trackedStandingCategories.includes(newCategory)) {
            addTrackedCategory(newCategory);
            setNewCategory('');
        }
    };

    const handleDelete = (category: string) => {
        if (window.confirm(t('admin_classement_delete_confirm'))) {
            removeTrackedCategory(category);
        }
    };

    return (
        <section>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{t('admin_classement_title')}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{t('admin_classement_desc')}</p>
            
            <div className="bg-white dark:bg-brand-dark-secondary p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">{t('admin_classement_add_tracked')}</h3>
                <div className="flex gap-2">
                    <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-brand-dark"
                    >
                        <option value="">{t('admin_classement_select_category')}</option>
                        {allPossibleCategories.filter(c => !trackedStandingCategories.includes(c)).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <button onClick={handleAdd} disabled={!newCategory} className="flex items-center bg-brand-green text-white px-4 py-2 rounded-md hover:bg-brand-green-dark disabled:bg-gray-400 dark:disabled:bg-gray-600">
                        <FaPlus className="mr-2" />
                        {t('admin_classement_add_button')}
                    </button>
                </div>

                <h3 className="text-lg font-semibold mt-8 mb-4">{t('admin_classement_tracked_title')}</h3>
                {trackedStandingCategories.length > 0 ? (
                    <ul className="space-y-2">
                        {trackedStandingCategories.map(category => (
                            <li key={category} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-brand-dark rounded-md">
                                <span className="font-medium text-gray-800 dark:text-gray-200">{category}</span>
                                <button onClick={() => handleDelete(category)} className="text-red-500 hover:text-red-700">
                                    <FaTrash />
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center py-4">{t('admin_classement_no_tracked')}</p>
                )}
            </div>
        </section>
    );
};

export default ClassementManager;