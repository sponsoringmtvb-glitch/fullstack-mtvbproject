import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const TermsOfService: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-brand-dark-secondary p-6 sm:p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl md:text-4xl font-extrabold text-brand-dark-text dark:text-brand-light-text mb-6">{t('terms_page_title')}</h1>
            <div className="prose prose-lg dark:prose-invert max-w-none text-brand-dark-text dark:text-brand-light-text leading-relaxed space-y-4">
                <p>{t('terms_content_p1')}</p>
                <p>{t('terms_content_p2')}</p>
                <p>{t('terms_content_p3')}</p>
            </div>
        </div>
    );
};

export default TermsOfService;
