import React, { useState, useEffect, useContext } from 'react';
import type { NewsArticle } from '../../types';
import Modal from '../Modal';
import { useTranslation } from '../../hooks/useTranslation';
import { DataContext } from '../../contexts/DataContext';
import ImageUploader from './ImageUploader';

interface NewsFormProps {
  article: NewsArticle | null;
  onClose: () => void;
}

const emptyArticle: Omit<NewsArticle, 'id'> = {
  title: '',
  date: new Date().toISOString().split('T')[0],
  imageUrl: '',
  summary: '',
  content: '',
};

const NewsForm: React.FC<NewsFormProps> = ({ article, onClose }) => {
  const [formData, setFormData] = useState<Omit<NewsArticle, 'id'>>(emptyArticle);
  const { addNewsArticle, updateNewsArticle } = useContext(DataContext);
  const { t } = useTranslation();

  useEffect(() => {
    if (article) {
      const { id, ...articleData } = article;
      setFormData({ ...articleData, date: new Date(articleData.date).toISOString().split('T')[0] });
    } else {
      setFormData(emptyArticle);
    }
  }, [article]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (url: string) => {
    setFormData(prev => ({ ...prev, imageUrl: url }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const articlePayload = { ...formData, date: new Date(formData.date).toISOString() };
    if (article) {
      updateNewsArticle({ ...articlePayload, id: article.id });
    } else {
      addNewsArticle(articlePayload);
    }
    onClose();
  };

  const inputClasses = "mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-brand-dark focus:ring-brand-green dark:focus:ring-brand-gold focus:border-brand-green dark:focus:border-brand-gold";

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="bg-white dark:bg-brand-dark-secondary rounded-lg p-8 max-w-2xl w-full text-gray-800 dark:text-gray-200 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-brand-dark-text dark:text-brand-light-text">{article ? t('news_form_edit_title') : t('news_form_add_title')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('news_form_title')}</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className={inputClasses}/>
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('news_form_date')}</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required className={inputClasses}/>
            </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('news_form_image')}</label>
            <ImageUploader currentImageUrl={formData.imageUrl} onImageChange={handleImageChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('news_form_summary')}</label>
            <textarea name="summary" value={formData.summary} onChange={handleChange} rows={3} required className={inputClasses}></textarea>
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('news_form_content')}</label>
            <textarea name="content" value={formData.content} onChange={handleChange} rows={12} required className={inputClasses}></textarea>
             <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Separate paragraphs with a blank line. Basic formatting is supported.</p>
          </div>
          <div className="flex justify-end space-x-4 pt-6">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">{t('player_form_cancel')}</button>
            <button type="submit" className="bg-brand-green text-white dark:bg-brand-gold dark:text-brand-dark px-4 py-2 rounded-md hover:bg-brand-green-dark dark:hover:bg-amber-400">{t('news_form_save')}</button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default NewsForm;