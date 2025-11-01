import React, { useContext } from 'react';
import { DataContext } from '../contexts/DataContext';
import { SponsorTier } from '../types';
import SponsorCard from '../components/SponsorCard';
import { useTranslation } from '../hooks/useTranslation';
import { FaStar } from 'react-icons/fa';

const Sponsors: React.FC = () => {
  const { sponsors } = useContext(DataContext);
  const { t } = useTranslation();

  const platinumSponsors = sponsors.filter(s => s.tier === SponsorTier.Platinum);
  const goldSponsors = sponsors.filter(s => s.tier === SponsorTier.Gold);
  const silverSponsors = sponsors.filter(s => s.tier === SponsorTier.Silver);

  const SponsorSection = ({ title, sponsors, tier }: { title: string, sponsors: typeof platinumSponsors, tier: SponsorTier }) => (
    <section>
        <h2 className="text-3xl font-bold text-brand-green-dark dark:text-brand-light-text mb-6 border-b-4 border-brand-accent-light dark:border-brand-gold pb-2">{title}</h2>
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${tier === SponsorTier.Platinum ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-8`}>
            {sponsors.map(sponsor => (
                <SponsorCard key={sponsor.id} sponsor={sponsor} />
            ))}
        </div>
    </section>
  );

  return (
    <div className="space-y-12">
      <div className="flex items-center space-x-3 mb-8">
            <FaStar className="h-10 w-10 text-brand-green dark:text-brand-gold" />
            <h1 className="text-4xl font-bold text-brand-green-dark dark:text-brand-light-text">{t('sponsors_page_title')}</h1>
      </div>

      {platinumSponsors.length > 0 && <SponsorSection title={t('sponsors_platinum')} sponsors={platinumSponsors} tier={SponsorTier.Platinum} />}
      {goldSponsors.length > 0 && <SponsorSection title={t('sponsors_gold')} sponsors={goldSponsors} tier={SponsorTier.Gold} />}
      {silverSponsors.length > 0 && <SponsorSection title={t('sponsors_silver')} sponsors={silverSponsors} tier={SponsorTier.Silver} />}
      
    </div>
  );
};

export default Sponsors;