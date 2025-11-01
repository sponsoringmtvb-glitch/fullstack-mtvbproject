import React, { useContext } from 'react';
import { Page } from '../constants';
import NewsCard from '../components/NewsCard';
import MatchCard from '../components/MatchCard';
import PlayerCard from '../components/PlayerCard';
// Fix: Import Variants type from framer-motion to correctly type animation variants.
import { motion, Variants } from 'framer-motion';
import { DataContext } from '../contexts/DataContext';
import { useTranslation } from '../hooks/useTranslation';
import { initialGallery } from '../data/mockData';
import { FaArrowRight } from 'react-icons/fa';

interface HomeProps {
    onNavigate: (page: Page) => void;
    onViewArticle: (id: number) => void;
}

// Fix: Add Variants type to satisfy TypeScript.
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// Fix: Add Variants type to satisfy TypeScript.
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};


const Home: React.FC<HomeProps> = ({ onNavigate, onViewArticle }) => {
  const { news, matches, homePageContent, generalSettings, registeredPlayers, sponsors } = useContext(DataContext);
  const { t } = useTranslation();

  const upcomingMatches = matches
    .filter(m => new Date(m.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
    
  const latestNews = news.slice(0, 3);
  const featuredPlayers = registeredPlayers.filter(p => p.status === 'assigned').slice(0, 4);
  const galleryPreview = initialGallery.slice(0, 8);

  return (
    <div className="space-y-24">
      {/* Full-width Hero Section */}
      <motion.section 
        className="relative py-28 md:py-40 -mt-8 -mx-4 flex items-center justify-center text-center text-white bg-black"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
          <img 
            src={homePageContent.heroImageUrl} 
            alt="Hero background" 
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="relative z-10">
            <motion.p variants={itemVariants} className="font-semibold text-brand-gold uppercase tracking-widest">{generalSettings.clubName}</motion.p>
            <motion.h1 
                variants={itemVariants}
                className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight my-4 font-display uppercase"
            >
                {homePageContent.title}
            </motion.h1>
            <motion.p 
                variants={itemVariants}
                className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
            >
                {homePageContent.subtitle}
            </motion.p>
            <motion.div 
                variants={itemVariants}
                className="flex flex-wrap gap-4 mt-8 justify-center"
            >
                <button onClick={() => onNavigate(Page.Team)} className="bg-brand-gold text-brand-dark font-bold py-3 px-8 rounded-lg hover:bg-amber-400 transition duration-300 transform hover:scale-105 shadow-lg">{homePageContent.ctaTeam}</button>
                <button onClick={() => onNavigate(Page.Schedule)} className="bg-transparent border-2 border-brand-gold text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-gold hover:text-brand-dark transition duration-300 transform hover:scale-105">{homePageContent.ctaSchedule}</button>
            </motion.div>
          </div>
      </motion.section>

      {/* Match and News Sections combined */}
       <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
                 <motion.div variants={itemVariants}>
                    <h2 className="text-3xl font-bold mb-6 text-brand-dark-text dark:text-brand-light-text font-display">{t('home_next_match_title')}</h2>
                     {upcomingMatches.length > 0 ? (
                        <div className="space-y-4">
                            {upcomingMatches.map(match => (
                                <MatchCard key={match.id} match={match} />
                            ))}
                        </div>
                    ) : (
                        <div className="aspect-[4/3] bg-slate-100 dark:bg-brand-dark-secondary rounded-xl flex items-center justify-center p-8 shadow-inner">
                             <p className="text-gray-500 text-center">{t('home_next_match_none')}</p>
                        </div>
                    )}
                </motion.div>
            </div>
             <div className="lg:col-span-3">
                 <motion.div variants={itemVariants}>
                     <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-brand-dark-text dark:text-brand-light-text font-display">{t('home_latest_news_title')}</h2>
                        <button onClick={() => onNavigate(Page.News)} className="text-brand-green-dark dark:text-brand-gold font-semibold hover:underline flex items-center gap-2">{t('home_latest_news_all')} <FaArrowRight /></button>
                     </div>
                    <div className="space-y-6">
                        {latestNews.map(article => (
                            <NewsCard key={article.id} article={article} variant="horizontal" onViewDetail={() => onViewArticle(article.id)} />
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
      </motion.section>
      
      {/* NEW Meet the Squad Section */}
      {featuredPlayers.length > 0 && (
          <div className="py-24 bg-slate-100 dark:bg-brand-dark-secondary/50 -mx-4 px-4 rounded-lg">
            <motion.section 
              className="container mx-auto"
              initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={containerVariants}
            >
              <motion.h2 variants={itemVariants} className="text-4xl font-bold text-center mb-12 text-brand-dark-text dark:text-brand-light-text font-display">{t('home_squad_title')}</motion.h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredPlayers.map(player => (
                  <motion.div key={player.id} variants={itemVariants}>
                    <PlayerCard player={player} />
                  </motion.div>
                ))}
              </div>
              <motion.div variants={itemVariants} className="text-center mt-12">
                <button onClick={() => onNavigate(Page.Team)} className="bg-brand-green text-white dark:bg-brand-gold dark:text-brand-dark font-bold py-3 px-8 rounded-lg hover:bg-brand-green-dark dark:hover:bg-amber-400 transition duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto">
                    {t('home_squad_button')} <FaArrowRight />
                </button>
              </motion.div>
            </motion.section>
          </div>
      )}

      {/* NEW Sponsor Spotlight Section */}
      {sponsors.length > 0 && (
          <motion.section
              initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={containerVariants}
          >
              <motion.h2 variants={itemVariants} className="text-4xl font-bold text-center mb-12 text-brand-dark-text dark:text-brand-light-text font-display">{t('home_sponsors_title')}</motion.h2>
              <motion.div variants={itemVariants} className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
                  {sponsors.map(sponsor => (
                      <a href={sponsor.websiteUrl} key={sponsor.id} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110">
                        <img src={sponsor.imageUrl} alt={sponsor.name} className="h-10 object-contain filter grayscale hover:grayscale-0 transition duration-300" />
                      </a>
                  ))}
              </motion.div>
               <motion.div variants={itemVariants} className="text-center mt-12">
                <button onClick={() => onNavigate(Page.Sponsors)} className="text-brand-green-dark dark:text-brand-gold font-semibold hover:underline flex items-center gap-2 mx-auto">
                    {t('home_sponsors_button')} <FaArrowRight />
                </button>
              </motion.div>
          </motion.section>
      )}

      {/* NEW Gallery Preview Section */}
      {galleryPreview.length > 0 && (
           <div className="py-24 bg-slate-100 dark:bg-brand-dark-secondary/50 -mx-4 px-4 rounded-lg">
             <motion.section 
                className="container mx-auto"
                initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={containerVariants}
            >
                <motion.h2 variants={itemVariants} className="text-4xl font-bold text-center mb-12 text-brand-dark-text dark:text-brand-light-text font-display">{t('home_gallery_title')}</motion.h2>
                <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {galleryPreview.map(photo => (
                        <div key={photo.id} className="relative aspect-square overflow-hidden rounded-lg group" onClick={() => onNavigate(Page.Gallery)}>
                            <img src={photo.imageUrl} alt={photo.caption} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                    ))}
                </motion.div>
                 <motion.div variants={itemVariants} className="text-center mt-12">
                    <button onClick={() => onNavigate(Page.Gallery)} className="bg-brand-green text-white dark:bg-brand-gold dark:text-brand-dark font-bold py-3 px-8 rounded-lg hover:bg-brand-green-dark dark:hover:bg-amber-400 transition duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto">
                        {t('home_gallery_button')} <FaArrowRight />
                    </button>
                </motion.div>
            </motion.section>
          </div>
      )}

      {/* NEW Call to Action Section */}
      <section className="-mx-4 -mb-8">
        <div className="bg-brand-green-dark dark:bg-brand-dark-secondary text-white py-20 px-4 text-center">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={containerVariants}
            >
              <motion.h2 variants={itemVariants} className="text-4xl font-bold mb-4 font-display">{t('home_cta_title')}</motion.h2>
              <motion.p variants={itemVariants} className="max-w-xl mx-auto text-gray-200 dark:text-gray-300 mb-8">{t('home_cta_subtitle')}</motion.p>
              <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center">
                 <button onClick={() => onNavigate(Page.Register)} className="bg-brand-gold text-brand-dark font-bold py-3 px-8 rounded-lg hover:bg-amber-400 transition duration-300 transform hover:scale-105 shadow-lg">{t('home_cta_register')}</button>
                <button onClick={() => onNavigate(Page.Store)} className="bg-transparent border-2 border-brand-gold text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-gold hover:text-brand-dark transition duration-300 transform hover:scale-105">{t('home_cta_store')}</button>
              </motion.div>
            </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;