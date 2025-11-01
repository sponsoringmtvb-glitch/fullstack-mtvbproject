import React, { useState, useContext } from 'react';
import { DataContext } from '../../contexts/DataContext';
import type { StaffMember } from '../../types';
import StaffForm from './StaffForm';
import { useTranslation } from '../../hooks/useTranslation';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const StaffManager = () => {
    const { staffMembers, deleteStaffMember } = useContext(DataContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<StaffMember | null>(null);
    const { t } = useTranslation();

    const handleAdd = () => {
        setEditingMember(null);
        setIsModalOpen(true);
    };

    const handleEdit = (member: StaffMember) => {
        setEditingMember(member);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm(t('admin_staff_delete_confirm'))) {
            deleteStaffMember(id);
        }
    };
    
    return (
        <section>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('admin_staff_title')}</h2>
                <button 
                    onClick={handleAdd} 
                    className="flex items-center bg-brand-green text-white dark:bg-brand-gold dark:text-brand-dark px-4 py-2 rounded-md hover:bg-brand-green-dark dark:hover:bg-amber-400 transition-colors"
                >
                    <FaPlus className="mr-2" />
                    {t('admin_staff_add_button')}
                </button>
            </div>
            <div className="bg-white dark:bg-brand-dark-secondary p-4 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('admin_staff_table_name')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin_staff_table_position')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin_staff_table_actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staffMembers.map(member => (
                            <tr key={member.id} className="bg-white dark:bg-brand-dark-secondary border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center space-x-3">
                                    <img src={member.imageUrl} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                                    <span>{member.name}</span>
                                </td>
                                <td className="px-6 py-4">{member.position}</td>
                                <td className="px-6 py-4 flex space-x-4">
                                    <button onClick={() => handleEdit(member)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" aria-label={t('staff_form_edit_title')}><FaEdit size={18} /></button>
                                    <button onClick={() => handleDelete(member.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" aria-label={t('admin_staff_delete_confirm')}><FaTrash size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <StaffForm
                    member={editingMember}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </section>
    );
};

export default StaffManager;
