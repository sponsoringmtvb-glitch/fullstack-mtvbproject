import React, { useState, useEffect } from 'react';
import type { CategoryRule } from '../../types';
import Modal from '../Modal';
import { useTranslation } from '../../hooks/useTranslation';

interface CategoryFormProps {
  rule: CategoryRule | null;
  onClose: () => void;
  onSave: (rule: CategoryRule) => void;
}

const emptyRule: CategoryRule = {
    name: '',
    startYear: new Date().getFullYear() - 20,
    endYear: new Date().getFullYear() - 18,
};

const CategoryForm: React.FC<CategoryFormProps> = ({ rule, onClose, onSave }) => {
  const [formData, setFormData] = useState<CategoryRule>(emptyRule);
  const { t } = useTranslation();
  const isEditMode = rule !== null;

  useEffect(() => {
    setFormData(rule || emptyRule);
  }, [rule]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'name' ? value : Number(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const inputClasses = "mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-brand-dark focus:ring-brand-green dark:focus:ring-brand-gold focus:border-brand-green dark:focus:border-brand-gold disabled:bg-gray-100 dark:disabled:bg-gray-700";

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="bg-white dark:bg-brand-dark-secondary rounded-lg p-8 max-w-lg w-full text-gray-800 dark:text-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-brand-dark-text dark:text-brand-light-text">
            {isEditMode ? `${t('category_form_edit_title')}: ${rule.name}` : t('category_form_add_title')}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
           <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('category_form_name')}</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required
                disabled={isEditMode}
                className={inputClasses}
              />
            </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('category_form_start_year')}</label>
              <input 
                type="number" 
                name="startYear" 
                value={formData.startYear} 
                onChange={handleChange} 
                required 
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('category_form_end_year')}</label>
              <input 
                type="number" 
                name="endYear" 
                value={formData.endYear} 
                onChange={handleChange} 
                required 
                className={inputClasses}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4 pt-6">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">{t('player_form_cancel')}</button>
            <button type="submit" className="bg-brand-green text-white dark:bg-brand-gold dark:text-brand-dark px-4 py-2 rounded-md hover:bg-brand-green-dark dark:hover:bg-amber-400">{t('category_form_save')}</button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CategoryForm;