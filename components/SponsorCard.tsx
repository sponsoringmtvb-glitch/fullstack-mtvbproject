import React from 'react';
import type { Sponsor } from '../types';
import { SponsorTier } from '../types';
import classNames from 'classnames';
import { useTranslation } from '../hooks/useTranslation';

interface SponsorCardProps {
    sponsor: Sponsor;
}

const SponsorCard: React.FC<SponsorCardProps> = ({ sponsor }) => {
    const { t } = useTranslation();
    const tierClasses = {
        [SponsorTier.Platinum]: 'bg-gray-100 dark:bg-brand-dark-secondary border-gray-300 dark:border-brand-gold',
        [SponsorTier.Gold]: 'bg-yellow-50 dark:bg-amber-500/10 border-yellow-300 dark:border-amber-500',
        [SponsorTier.Silver]: 'bg-gray-50 dark:bg-brand-dark-secondary/80 border-gray-200 dark:border-gray-600',
    };

    const isPlatinum = sponsor.tier === SponsorTier.Platinum;

    return (
        <div className={classNames(
            "rounded-lg shadow-md p-6 border-t-8 flex flex-col items-center text-center transition-transform hover:scale-105",
            tierClasses[sponsor.tier]
        )}>
            <div className={classNames("bg-white dark:bg-gray-700/50 p-4 rounded-lg", { 'w-full': isPlatinum })}>
                <img 
                    src={sponsor.imageUrl} 
                    alt={`${sponsor.name} logo`} 
                    className={classNames("object-contain mx-auto", {
                        "h-24": isPlatinum,
                        "h-20": !isPlatinum
                    })}
                />
            </div>
            <h3 className="text-xl font-bold text-brand-green-dark dark:text-white mt-4">{sponsor.name}</h3>
            <a 
                href={sponsor.websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-4 bg-brand-green text-white dark:bg-brand-gold dark:text-brand-dark font-semibold py-2 px-5 rounded-md hover:bg-brand-green-dark dark:hover:bg-amber-400 transition-colors"
            >
                {t('sponsors_website_button')}
            </a>
        </div>
    );
};

export default SponsorCard;