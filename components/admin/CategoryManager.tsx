import React, { useState, useContext, useMemo } from 'react';
import { DataContext } from '../../contexts/DataContext';
import type { CategoryRule } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import CategoryForm from './CategoryForm';

const CategoryManager = () => {
    const { categoryRules, registeredPlayers, addCategoryRule, updateCategoryRules, deleteCategoryRule } = useContext(DataContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<CategoryRule | null>(null);
    const { t } = useTranslation();

    const handleAdd = () => {
        setEditingRule(null);
        setIsModalOpen(true);
    };

    const handleEdit = (rule: CategoryRule) => {
        setEditingRule(rule);
        setIsModalOpen(true);
    };

    const handleDelete = (categoryName: string) => {
        if (window.confirm(t('admin_categories_delete_confirm'))) {
            deleteCategoryRule(categoryName);
        }
    };

    const handleSave = (updatedRule: CategoryRule) => {
        if (editingRule) {
            const newRules = categoryRules.map(rule =>
                rule.name === editingRule.name ? updatedRule : rule
            );
            updateCategoryRules(newRules);
        } else {
            addCategoryRule(updatedRule);
        }
        setIsModalOpen(false);
    };

    const playerCounts = useMemo(() => {
        const counts = categoryRules.reduce((acc, rule) => {
            acc[rule.name] = 0;
            return acc;
        }, {} as Record<string, number>);
        counts['Uncategorized'] = 0;

        registeredPlayers.forEach(player => {
            if (counts.hasOwnProperty(player.category)) {
                counts[player.category]++;
            } else {
                counts['Uncategorized']++;
            }
        });
        return counts;
    }, [registeredPlayers, categoryRules]);

    return (
        <section>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('admin_categories_title')}</h2>
                 <button 
                    onClick={handleAdd} 
                    className="flex items-center bg-brand-green text-white dark:bg-brand-gold dark:text-brand-dark px-4 py-2 rounded-md hover:bg-brand-green-dark dark:hover:bg-amber-400 transition-colors"
                >
                    <FaPlus className="mr-2" />
                    {t('admin_categories_add_button')}
                </button>
            </div>
            <div className="bg-white dark:bg-brand-dark-secondary p-4 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('admin_categories_table_name')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin_categories_table_years')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin_categories_table_players')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin_categories_table_actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categoryRules.map(rule => {
                            const translationKey = `category_${rule.name}`;
                            const translated = t(translationKey);
                            const displayName = translated === translationKey ? rule.name : translated;
                            return (
                                <tr key={rule.name} className="bg-white dark:bg-brand-dark-secondary border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{displayName}</td>
                                    <td className="px-6 py-4">{rule.startYear} - {rule.endYear}</td>
                                    <td className="px-6 py-4">{playerCounts[rule.name] || 0}</td>
                                    <td className="px-6 py-4 flex space-x-4">
                                        <button onClick={() => handleEdit(rule)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" aria-label={t('category_form_edit_title')}>
                                            <FaEdit size={18} />
                                        </button>
                                         <button onClick={() => handleDelete(rule.name)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" aria-label={t('admin_categories_delete_confirm')}>
                                            <FaTrash size={18} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <CategoryForm
                    rule={editingRule}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </section>
    );
};

export default CategoryManager;