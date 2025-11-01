import React, { useState, useContext } from 'react';
import { DataContext } from '../../contexts/DataContext';
import type { Player, PlayerStatus } from '../../types';
import PlayerForm from './PlayerForm';
import { useTranslation } from '../../hooks/useTranslation';
import { FaEdit, FaTrash, FaUserPlus, FaFileExport, FaCheck, FaTimes, FaUserCheck, FaEye, FaSearch, FaKey } from 'react-icons/fa';
import classNames from 'classnames';
import { getCategoryByYear } from '../../services/utils';
import Modal from '../Modal';
import { useToasts } from '../../hooks/useToasts';

const RegistrationManager = () => {
    const { registeredPlayers, deletePlayer, updatePlayerStatus, assignPlayerTeam, verifyPlayerDocuments, categoryRules } = useContext(DataContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
    const [activeTab, setActiveTab] = useState<PlayerStatus | 'all'>('all');
    const [sexFilter, setSexFilter] = useState<'all' | 'Male' | 'Female'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewingPlayerDocs, setViewingPlayerDocs] = useState<Player | null>(null);
    const { t } = useTranslation();
    const { addToast } = useToasts();

    const handleAdd = () => {
        setEditingPlayer(null);
        setIsModalOpen(true);
    };

    const handleEdit = (player: Player) => {
        setEditingPlayer(player);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm(t('admin_reg_delete_confirm'))) {
            deletePlayer(id);
        }
    };
    
    const handleApprove = (id: number) => updatePlayerStatus(id, 'approved');
    
    const handleReject = (id: number) => {
        if (window.confirm(t('admin_reg_reject_confirm'))) {
            updatePlayerStatus(id, 'rejected');
        }
    };

    const handleVerifyDocuments = (id: number, isApproved: boolean) => {
        if (!isApproved) {
            if (window.confirm(t('admin_reg_reject_docs_confirm'))) {
                 verifyPlayerDocuments(id, isApproved);
            }
        } else {
             verifyPlayerDocuments(id, isApproved);
        }
    };

    const handleViewDocuments = (player: Player) => {
        setViewingPlayerDocs(player);
    };

    const handleAssignTeam = (id: number) => {
        const team = prompt("Enter team name (e.g., U18 A):");
        if (team !== null) {
            assignPlayerTeam(id, team || null);
        }
    };
    
    const handleResetPassword = (email: string) => {
        addToast(`Password reset link sent to ${email}`, 'info');
    };

    const filteredPlayers = registeredPlayers
        .filter(p => activeTab === 'all' || p.status === activeTab)
        .filter(p => sexFilter === 'all' || p.sex === sexFilter)
        .filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const tabs: (PlayerStatus | 'all')[] = ['all', 'pending', 'approved', 'validated', 'verified', 'assigned', 'rejected'];

    const exportToCsv = () => {
        const headers = ['id', 'name', 'email', 'sex', 'dob', 'phone', 'category', 'status', 'team'];
        const csvRows = [
            headers.join(','),
            ...filteredPlayers.map(p => 
                headers.map(header => `"${p[header as keyof Player] ?? ''}"`).join(',')
            )
        ];
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'players.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <section>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('admin_reg_title')}</h2>
                <div className="flex gap-2">
                    <button onClick={exportToCsv} className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                        <FaFileExport className="mr-2" />
                        {t('admin_reg_export_csv')}
                    </button>
                    <button onClick={handleAdd} className="flex items-center bg-brand-green text-white dark:bg-brand-gold dark:text-brand-dark px-4 py-2 rounded-md hover:bg-brand-green-dark dark:hover:bg-amber-400 transition-colors">
                        <FaUserPlus className="mr-2" />
                        {t('admin_reg_add_button')}
                    </button>
                </div>
            </div>

            <div className="mb-4 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text"
                        placeholder={t('admin_reg_search_placeholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 p-2 border rounded-md bg-white dark:bg-brand-dark-secondary"
                    />
                </div>
                <div className="relative">
                    <select
                        id="sex-filter"
                        value={sexFilter}
                        onChange={(e) => setSexFilter(e.target.value as any)}
                        className="appearance-none block w-full sm:w-auto bg-white dark:bg-brand-dark-secondary border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white dark:focus:bg-brand-dark focus:border-brand-green dark:focus:border-brand-gold"
                    >
                        <option value="all">{t('admin_reg_filter_sex_all')}</option>
                        <option value="Male">{t('sex_male')}</option>
                        <option value="Female">{t('sex_female')}</option>
                    </select>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
            </div>
            
            <div className="mb-4 flex flex-wrap border-b border-gray-200 dark:border-gray-700">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={classNames(
                            "py-2 px-4 font-semibold text-sm focus:outline-none transition-colors duration-200 capitalize", {
                            'border-b-2 border-brand-green text-brand-green dark:text-brand-gold dark:border-brand-gold': activeTab === tab,
                            'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white': activeTab !== tab
                        })}
                    >
                        {t(`admin_reg_filter_${tab}` as any)}
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-brand-dark-secondary p-4 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('admin_reg_table_name')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin_reg_table_sex')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin_reg_table_dob')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin_reg_table_category')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin_reg_table_status')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin_reg_table_team')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin_reg_table_actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPlayers.length > 0 ? filteredPlayers.map(player => (
                            <tr key={player.id} className="bg-white dark:bg-brand-dark-secondary border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{player.name}</td>
                                <td className="px-6 py-4">{t(`sex_${player.sex.toLowerCase()}`)}</td>
                                <td className="px-6 py-4">{new Date(player.dob).getFullYear()}</td>
                                <td className="px-6 py-4">{t(`category_${getCategoryByYear(player.dob, categoryRules)}` as any)}</td>
                                <td className="px-6 py-4 capitalize">{player.status}</td>
                                <td className="px-6 py-4">{player.team || 'N/A'}</td>
                                <td className="px-6 py-4 flex flex-wrap items-center gap-3">
                                    {player.status === 'pending' && (
                                        <>
                                            <button onClick={() => handleApprove(player.id)} className="text-green-600 hover:text-green-800" title={t('admin_reg_approve')}><FaCheck size={16} /></button>
                                            <button onClick={() => handleReject(player.id)} className="text-red-600 hover:text-red-800" title={t('admin_reg_reject')}><FaTimes size={16} /></button>
                                        </>
                                    )}
                                     {player.status === 'validated' && (
                                        <>
                                            <button onClick={() => handleViewDocuments(player)} className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white" title={t('admin_reg_view_docs')}><FaEye size={16} /></button>
                                            <button onClick={() => handleVerifyDocuments(player.id, true)} className="text-green-600 hover:text-green-800" title={t('admin_reg_verify_docs')}><FaCheck size={16} /></button>
                                            <button onClick={() => handleVerifyDocuments(player.id, false)} className="text-red-600 hover:text-red-800" title={t('admin_reg_reject_docs')}><FaTimes size={16} /></button>
                                        </>
                                    )}
                                    {(player.status === 'verified' || player.status === 'assigned') && (
                                        <button onClick={() => handleAssignTeam(player.id)} className="text-blue-600 hover:text-blue-800" title={t('admin_reg_assign_team')}><FaUserCheck size={16} /></button>
                                    )}
                                    <button onClick={() => handleEdit(player)} className="text-blue-600 hover:text-blue-800" title={t('player_form_edit_title')}><FaEdit size={16} /></button>
                                    {player.authProvider === 'email' && player.status !== 'pending' && player.status !== 'rejected' && (
                                        <button onClick={() => handleResetPassword(player.email)} className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300" title="Reset Password"><FaKey size={16} /></button>
                                    )}
                                    <button onClick={() => handleDelete(player.id)} className="text-red-600 hover:text-red-800" title={t('admin_reg_delete_player_button')}><FaTrash size={16} /></button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={7} className="text-center py-4">{t('admin_reg_no_players')}</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <PlayerForm
                    player={editingPlayer}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
            
            {viewingPlayerDocs && (
                <Modal isOpen={!!viewingPlayerDocs} onClose={() => setViewingPlayerDocs(null)}>
                    <div className="bg-white dark:bg-brand-dark-secondary rounded-lg p-8 max-w-lg w-full text-gray-800 dark:text-gray-200">
                        <h2 className="text-2xl font-bold mb-6 text-brand-dark-text dark:text-brand-light-text">
                            {t('admin_reg_docs_modal_title')} for {viewingPlayerDocs.name}
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold">{t('docs_upload_id')}</h3>
                                {viewingPlayerDocs.documents.idCard ? (
                                    <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-500 hover:underline">{viewingPlayerDocs.documents.idCard}</a>
                                ) : (
                                    <p className="text-gray-500">{t('docs_not_uploaded')}</p>
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold">{t('docs_upload_parental')}</h3>
                                {viewingPlayerDocs.documents.parentalAuth ? (
                                    <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-500 hover:underline">{viewingPlayerDocs.documents.parentalAuth}</a>
                                ) : (
                                    <p className="text-gray-500">{t('docs_not_uploaded')}</p>
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold">{t('docs_upload_medical')}</h3>
                                {viewingPlayerDocs.documents.medicalCert ? (
                                    <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-500 hover:underline">{viewingPlayerDocs.documents.medicalCert}</a>
                                ) : (
                                    <p className="text-gray-500">{t('docs_not_uploaded')}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setViewingPlayerDocs(null)}
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                            >
                                {t('close_button')}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </section>
    );
};

export default RegistrationManager;