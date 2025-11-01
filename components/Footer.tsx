import React, { useContext } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { DataContext } from '../contexts/DataContext';
import { Page } from '../constants';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

interface FooterProps {
    onNavigate: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const { sponsors, generalSettings } = useContext(DataContext);
  const { socialLinks } = generalSettings;
  
  const NavLink: React.FC<{page: Page, children: React.ReactNode}> = ({ page, children }) => (
    <li>
      <button onClick={() => onNavigate(page)} className="text-gray-300 hover:text-white dark:hover:text-brand-gold transition-colors">
        {children}
      </button>
    </li>
  );

  return (
    <footer className="bg-brand-green-dark dark:bg-brand-dark-secondary text-white">
      <div className="container mx-auto py-12 px-4">
        {/* Sponsors Section */}
        {sponsors.length > 0 && (
          <div className="text-center mb-12">
              <h3 className="font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-6">{t('footer_sponsors_title')}</h3>
              <div className="flex flex-wrap justify-center items-center gap-8">
                  {sponsors.map(sponsor => (
                      <a href={sponsor.websiteUrl} key={sponsor.name} target="_blank" rel="noopener noreferrer">
                        <img src={sponsor.imageUrl} alt={sponsor.name} className="h-8 object-contain filter grayscale hover:grayscale-0 transition duration-300" />
                      </a>
                  ))}
              </div>
          </div>
        )}

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          {/* About Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <img src={generalSettings.logoUrl} alt="Club Logo" className="h-8 w-8" />
              <span className="text-xl font-bold">{generalSettings.clubName}</span>
            </div>
            <p className="text-gray-300 dark:text-gray-400 text-sm">
              {t('footer_about_us')}
            </p>
             <div className="flex justify-center md:justify-start space-x-4 pt-2">
              {socialLinks?.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-300 hover:text-white dark:hover:text-brand-gold transition-colors">
                  <FaFacebook size={24} />
                </a>
              )}
              {socialLinks?.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-300 hover:text-white dark:hover:text-brand-gold transition-colors">
                  <FaTwitter size={24} />
                </a>
              )}
              {socialLinks?.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-300 hover:text-white dark:hover:text-brand-gold transition-colors">
                  <FaInstagram size={24} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-bold uppercase tracking-wider mb-4">{t('footer_quick_links')}</h4>
            <ul className="space-y-2 text-sm">
              <NavLink page={Page.Home}>{t('header_nav_home')}</NavLink>
              <NavLink page={Page.About}>{t('header_nav_about')}</NavLink>
              <NavLink page={Page.Team}>{t('header_nav_team')}</NavLink>
              <NavLink page={Page.News}>{t('header_nav_news')}</NavLink>
              <NavLink page={Page.Schedule}>{t('header_nav_schedule')}</NavLink>
              <NavLink page={Page.Contact}>{t('header_nav_contact')}</NavLink>
            </ul>
          </div>

          {/* Contact Us Column */}
          <div>
            <h4 className="font-bold uppercase tracking-wider mb-4">{t('footer_contact_us')}</h4>
            <address className="not-italic text-sm space-y-2">
              <p className="text-gray-300">{t('footer_address')}</p>
              <a href={`mailto:${t('footer_email')}`} className="text-gray-300 hover:text-white dark:hover:text-brand-gold transition-colors">{t('footer_email')}</a>
            </address>
          </div>
          
          {/* Legal Column */}
          <div>
            <h4 className="font-bold uppercase tracking-wider mb-4">{t('footer_legal')}</h4>
            <ul className="space-y-2 text-sm">
              <NavLink page={Page.PrivacyPolicy}>{t('footer_privacy_policy')}</NavLink>
              <NavLink page={Page.TermsOfService}>{t('footer_terms_of_service')}</NavLink>
              <NavLink page={Page.Sitemap}>{t('footer_sitemap')}</NavLink>
            </ul>
          </div>
        </div>


        <div className="border-t border-green-800 dark:border-gray-700 pt-8 mt-8 text-center">
            <p className="text-gray-200 dark:text-brand-light-text">&copy; {new Date().getFullYear()} {generalSettings.clubName}. {t('footer_copyright')}</p>
            <p className="text-sm text-gray-400 mt-2">{t('footer_subtitle')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;