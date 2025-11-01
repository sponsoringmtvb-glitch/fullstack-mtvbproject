import React, { useState, useContext } from 'react';
import type { Player } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { DataContext } from '../../contexts/DataContext';
import { FaFileUpload } from 'react-icons/fa';

interface UploadDocumentsProps {
    player: Player;
}

const FileInput: React.FC<{label: string, name: string, onChange: (name: string, file: File) => void}> = ({ label, name, onChange }) => {
    const { t } = useTranslation();
    const [fileName, setFileName] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            onChange(name, file);
        }
    };

    return (
        <div>
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <FaFileUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label htmlFor={name} className="relative cursor-pointer bg-white dark:bg-brand-dark-secondary rounded-md font-medium text-brand-green dark:text-brand-gold hover:text-brand-green-dark dark:hover:text-amber-300 focus-within:outline-none">
                            <span>{t('docs_upload_choose_file')}</span>
                            <input id={name} name={name} type="file" className="sr-only" onChange={handleFileChange} />
                        </label>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                        {fileName ? fileName : 'PNG, JPG, PDF up to 10MB'}
                    </p>
                </div>
            </div>
        </div>
    );
};


const UploadDocuments: React.FC<UploadDocumentsProps> = ({ player }) => {
    const { t } = useTranslation();
    const { addPlayerDocuments } = useContext(DataContext);
    const [files, setFiles] = useState<{ [key: string]: File | null }>({
        idCard: null,
        parentalAuth: null,
        medicalCert: null,
    });

    const handleFileChange = (name: string, file: File) => {
        setFiles(prev => ({ ...prev, [name]: file }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // For demo, we just store the file names. In a real app, you'd upload them.
        const documentPayload = {
            idCard: files.idCard?.name || player.documents.idCard,
            parentalAuth: files.parentalAuth?.name || player.documents.parentalAuth,
            medicalCert: files.medicalCert?.name || player.documents.medicalCert,
        };
        addPlayerDocuments(player.id, documentPayload);
    };

    return (
        <div className="max-w-2xl mx-auto">
             <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-brand-dark-text dark:text-brand-light-text">{t('docs_upload_title')}</h2>
                {player.status === 'approved' && (
                    <p className="mt-2 text-md text-gray-600 dark:text-gray-300">{t('docs_upload_desc')}</p>
                )}
             </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-brand-dark-secondary p-8 rounded-xl shadow-lg">
                <FileInput label={t('docs_upload_id')} name="idCard" onChange={handleFileChange} />
                <FileInput label={t('docs_upload_parental')} name="parentalAuth" onChange={handleFileChange} />
                <FileInput label={t('docs_upload_medical')} name="medicalCert" onChange={handleFileChange} />
                
                <div>
                    <button
                        type="submit"
                        disabled={!files.idCard || !files.medicalCert}
                        className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-green hover:bg-brand-green-dark dark:bg-brand-gold dark:text-brand-dark dark:hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green dark:focus:ring-brand-gold disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        {t('docs_upload_submit_button')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UploadDocuments;
