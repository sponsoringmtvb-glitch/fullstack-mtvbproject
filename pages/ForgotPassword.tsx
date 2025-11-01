import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import { Page } from '../constants';

interface ForgotPasswordProps {
    onNavigate: (page: Page) => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNavigate }) => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would trigger a backend API call.
        // For this demo, we just show the success message.
        setSubmitted(true);
    };

    return (
        <div className="flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-brand-dark-secondary p-10 rounded-xl shadow-lg">
                {submitted ? (
                    <div className="text-center">
                        <FaCheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                        <h2 className="text-2xl font-bold mb-2">{t('forgot_password_button')}</h2>
                        <p className="text-gray-600 dark:text-gray-300">{t('forgot_password_success')}</p>
                        <button
                            onClick={() => onNavigate(Page.Login)}
                            className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-green hover:bg-brand-green-dark"
                        >
                            {t('forgot_password_back_to_login')}
                        </button>
                    </div>
                ) : (
                    <div>
                        <FaEnvelope className="mx-auto h-12 w-12 text-brand-green dark:text-brand-gold" />
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-brand-light-text">
                            {t('forgot_password_title')}
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                            {t('forgot_password_desc')}
                        </p>
                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="sr-only">{t('login_email_label')}</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-brand-dark placeholder-gray-500 text-gray-900 dark:text-brand-light-text rounded-md focus:outline-none focus:ring-brand-green"
                                    placeholder={t('login_email_label')}
                                />
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-green hover:bg-brand-green-dark"
                                >
                                    {t('forgot_password_button')}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;