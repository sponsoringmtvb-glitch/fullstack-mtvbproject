import React, { useState, useEffect, useContext } from 'react';
import type { StaffMember } from '../../types';
import Modal from '../Modal';
import { useTranslation } from '../../hooks/useTranslation';
import { DataContext } from '../../contexts/DataContext';
import ImageUploader from './ImageUploader';

interface StaffFormProps {
  member: StaffMember | null;
  onClose: () => void;
}

const emptyMember: Omit<StaffMember, 'id'> = {
  name: '',
  position: '',
  bio: '',
  imageUrl: '',
};

const StaffForm: React.FC<StaffFormProps> = ({ member, onClose }) => {
  const [formData, setFormData] = useState<Omit<StaffMember, 'id'>>(emptyMember);
  const { addStaffMember, updateStaffMember } = useContext(DataContext);
  const { t } = useTranslation();

  useEffect(() => {
    if (member) {
      const { id, ...memberData } = member;
      setFormData(memberData);
    } else {
      setFormData(emptyMember);
    }
  }, [member]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (url: string) => {
    setFormData(prev => ({ ...prev, imageUrl: url }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (member) {
      updateStaffMember({ ...formData, id: member.id });
    } else {
      addStaffMember(formData);
    }
    onClose();
  };
  
  const inputClasses = "mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-brand-dark focus:ring-brand-green dark:focus:ring-brand-gold focus:border-brand-green dark:focus:border-brand-gold";

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="bg-white dark:bg-brand-dark-secondary rounded-lg p-8 max-w-2xl w-full text-gray-800 dark:text-gray-200 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-brand-dark-text dark:text-brand-light-text">{member ? t('staff_form_edit_title') : t('staff_form_add_title')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('staff_form_name')}</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClasses}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('staff_form_position')}</label>
              <input type="text" name="position" value={formData.position} onChange={handleChange} required className={inputClasses}/>
            </div>
          </div>
           <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('staff_form_image')}</label>
              <ImageUploader currentImageUrl={formData.imageUrl} onImageChange={handleImageChange} />
            </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('staff_form_bio')}</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} required className={inputClasses}></textarea>
          </div>
          
          <div className="flex justify-end space-x-4 pt-6">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">{t('player_form_cancel')}</button>
            <button type="submit" className="bg-brand-green text-white dark:bg-brand-gold dark:text-brand-dark px-4 py-2 rounded-md hover:bg-brand-green-dark dark:hover:bg-amber-400">{t('staff_form_save')}</button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default StaffForm;
