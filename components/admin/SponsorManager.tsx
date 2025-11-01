import React, { useState, useContext } from 'react';
import { DataContext } from '../../contexts/DataContext';
import type { Sponsor } from '../../types';
import SponsorForm from './SponsorForm';
import { useTranslation } from '../../hooks/useTranslation';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const SponsorManager = () => {
    const { sponsors, deleteSponsor } = useContext(DataContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
    const { t } = useTranslation();

    const handleAdd = () => {
        setEditingSponsor(null);
        setIsModalOpen(true);
    };

    const handleEdit = (sponsor: Sponsor) => {
        setEditingSponsor(sponsor);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm(t('admin_sponsors_delete_confirm'))) {
            deleteSponsor(id);
        }
    };
    
    return (
        <section>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('admin_sponsors_title')}</h2>
                <button 
                    onClick={handleAdd} 
                    className="flex items-center bg-brand-green text-white dark:bg-brand-gold dark:text-brand-dark px-4 py-2 rounded-md hover:bg-brand-green-dark dark:hover:bg-amber-400 transition-colors"
                >
                    <FaPlus className="mr-2" />
                    {t('admin_sponsors_add_button')}
                </button>
            </div>
            <div className="bg-white dark:bg-brand-dark-secondary p-4 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('admin_sponsors_table_name')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin_sponsors_table_tier')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin_sponsors_table_actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sponsors.map(sponsor => (
                            <tr key={sponsor.id} className="bg-white dark:bg-brand-dark-secondary border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center space-x-3">
                                    <img src={sponsor.imageUrl} alt={sponsor.name} className="w-24 h-8 object-contain bg-gray-200 dark:bg-gray-600 p-1 rounded" />
                                    <span>{sponsor.name}</span>
                                </td>
                                <td className="px-6 py-4">{sponsor.tier}</td>
                                <td className="px-6 py-4 flex space-x-4">
                                    <button onClick={() => handleEdit(sponsor)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" aria-label={t('sponsor_form_edit_title')}><FaEdit size={18} /></button>
                                    <button onClick={() => handleDelete(sponsor.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" aria-label={t('admin_sponsors_delete_button')}><FaTrash size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <SponsorForm
                    sponsor={editingSponsor}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </section>
    );
};

export default SponsorManager;