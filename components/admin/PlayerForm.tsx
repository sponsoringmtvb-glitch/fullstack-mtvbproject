import React, { useState, useEffect, useContext } from 'react';
import type { Player, PlayerStatus } from '../../types';
import Modal from '../Modal';
import { useTranslation } from '../../hooks/useTranslation';
import ImageUploader from './ImageUploader';
import { DataContext } from '../../contexts/DataContext';
import { getCategoryByYear } from '../../services/utils';

interface PlayerFormProps {
  player: Player | null;
  onClose: () => void;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ player, onClose }) => {
  const { updatePlayer, addPlayer, categoryRules } = useContext(DataContext);
  const [formData, setFormData] = useState<Player | Omit<Player, 'id' | 'category'>>(null!);
  const { t } = useTranslation();

  useEffect(() => {
    if (player) {
      setFormData(player);
    } else {
       setFormData({
            name: '', email: '', dob: '', phone: '', status: 'pending', team: null, sex: 'Male',
            documents: { idCard: null, parentalAuth: null, medicalCert: null }, notifications: [],
            isVerified: false,
            position: 'Outside Hitter', number: 0, imageUrl: '', height: '', bio: '',
            stats: { matchesPlayed: 0, points: 0, blocks: 0, aces: 0 },
            password: ''
        });
    }
  }, [player]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (url: string) => {
    setFormData(prev => ({...prev, imageUrl: url}));
  }
  
  const handleStatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      stats: { ...prev.stats, [name]: parseInt(value) || 0 }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalFormData = { ...formData, category: getCategoryByYear(formData.dob, categoryRules) };

    if ('id' in finalFormData) {
        updatePlayer(finalFormData as Player);
    } else {
        const { password, ...playerData } = finalFormData;
        addPlayer(playerData as Omit<Player, 'id'>);
    }
    onClose();
  };

  if (!formData) return null;

  const positions: Player['position'][] = ['Setter', 'Outside Hitter', 'Middle Blocker', 'Opposite Hitter', 'Libero'];
  const statuses: PlayerStatus[] = ['pending', 'approved', 'rejected', 'validated', 'verified', 'assigned'];
  const inputClasses = "mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-brand-dark focus:ring-brand-green dark:focus:ring-brand-gold focus:border-brand-green dark:focus:border-brand-gold";

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="bg-white dark:bg-brand-dark-secondary rounded-lg p-8 max-w-4xl w-full text-gray-800 dark:text-gray-200 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-brand-dark-text dark:text-brand-light-text">{player ? t('player_form_edit_title') : t('player_form_add_title')}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
               <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b dark:border-gray-600 pb-2">Personal Info</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('player_form_name')}</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClasses}/>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('player_form_email')}</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClasses}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('player_form_phone')}</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className={inputClasses}/>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('player_form_dob')}</label>
                        <input type="date" name="dob" value={formData.dob.split('T')[0]} onChange={handleChange} required className={inputClasses}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('register_sex_label')}</label>
                        <select name="sex" value={formData.sex} onChange={handleChange} className={inputClasses}>
                            <option value="Male">{t('sex_male')}</option>
                            <option value="Female">{t('sex_female')}</option>
                        </select>
                    </div>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('player_form_team')}</label>
                        <input type="text" name="team" value={formData.team ?? ''} onChange={handleChange} className={inputClasses}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('player_form_status')}</label>
                        <select name="status" value={formData.status} onChange={handleChange} className={inputClasses}>
                            {statuses.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                        </select>
                    </div>
                </div>
            </div>
             <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b dark:border-gray-600 pb-2">Roster Info</h3>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('player_form_image')}</label>
                  <ImageUploader currentImageUrl={formData.imageUrl} onImageChange={handleImageChange} />
                </div>
             </div>
          </div>
           <div className="pt-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b dark:border-gray-600 pb-2 mb-4">Game Details</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('player_form_position')}</label>
                    <select name="position" value={formData.position} onChange={handleChange} className={inputClasses}>
                      {positions.map(pos => <option key={pos} value={pos}>{t(`position_${pos.toLowerCase().replace(/ /g, '_')}`)}</option>)}
                    </select>
                  </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('player_form_number')}</label>
                      <input type="number" name="number" value={formData.number} onChange={handleChange} className={inputClasses}/>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('player_form_height')}</label>
                      <input type="text" name="height" value={formData.height} onChange={handleChange} className={inputClasses}/>
                  </div>
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-4">{t('player_form_bio')}</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} className={inputClasses}></textarea>
              </div>
           </div>
          <div className="pt-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b dark:border-gray-600 pb-2 mb-4">{t('player_form_stats_heading')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('player_stats_matches')}</label>
                    <input type="number" name="matchesPlayed" value={formData.stats.matchesPlayed} onChange={handleStatChange} className={inputClasses}/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('player_stats_points')}</label>
                    <input type="number" name="points" value={formData.stats.points} onChange={handleStatChange} className={inputClasses}/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('player_stats_blocks')}</label>
                    <input type="number" name="blocks" value={formData.stats.blocks} onChange={handleStatChange} className={inputClasses}/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('player_stats_aces')}</label>
                    <input type="number" name="aces" value={formData.stats.aces} onChange={handleStatChange} className={inputClasses}/>
                </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 pt-6">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">{t('player_form_cancel')}</button>
            <button type="submit" className="bg-brand-green text-white dark:bg-brand-gold dark:text-brand-dark px-4 py-2 rounded-md hover:bg-brand-green-dark dark:hover:bg-amber-400">{t('player_form_save')}</button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default PlayerForm;