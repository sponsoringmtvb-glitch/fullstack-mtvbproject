import React, { useState, useContext } from 'react';
import { DataContext } from '../../contexts/DataContext';
import type { NewsArticle } from '../../types';
import NewsForm from './NewsForm';
import { useTranslation } from '../../hooks/useTranslation';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const NewsManager = () => {
    const { news, deleteNewsArticle } = useContext(DataContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
    const { t } = useTranslation();

    const handleAdd = () => {
        setEditingArticle(null);
        setIsModalOpen(true);
    };

    const handleEdit = (article: NewsArticle) => {
        setEditingArticle(article);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm(t('admin_news_delete_confirm'))) {
            deleteNewsArticle(id);
        }
    };
    
    return (
        <section>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('admin_news_title')}</h2>
                <button 
                    onClick={handleAdd} 
                    className="flex items-center bg-brand-green text-white dark:bg-brand-gold dark:text-brand-dark px-4 py-2 rounded-md hover:bg-brand-green-dark dark:hover:bg-amber-400 transition-colors"
                >
                    <FaPlus className="mr-2" />
                    {t('admin_news_add_button')}
                </button>
            </div>
            <div className="bg-white dark:bg-brand-dark-secondary p-4 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('admin_news_table_title')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin_news_table_date')}</th>
                            <th scope="col" className="px-6 py-3">{t('admin_news_table_actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...news].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(article => (
                            <tr key={article.id} className="bg-white dark:bg-brand-dark-secondary border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{article.title}</td>
                                <td className="px-6 py-4">{new Date(article.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 flex space-x-4">
                                    <button onClick={() => handleEdit(article)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" aria-label={t('news_form_edit_title')}><FaEdit size={18} /></button>
                                    <button onClick={() => handleDelete(article.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" aria-label={t('admin_news_delete_button')}><FaTrash size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <NewsForm
                    article={editingArticle}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </section>
    );
};

export default NewsManager;