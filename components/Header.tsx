import React, { useState, useEffect, useContext, useRef } from 'react';
import { Page } from '../constants';
import { FaShoppingCart, FaUserShield, FaTachometerAlt, FaSignOutAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';
import ThemeToggle from './ThemeToggle';
import classNames from 'classnames';
import { DataContext } from '../contexts/DataContext';
import { useCart } from '../hooks/useCart';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentUser, logout } = useAuth();
  const { t } = useTranslation();
  const { generalSettings, liveMatchId } = useContext(DataContext);
  const { toggleCart, itemCount } = useCart();
  
  const isAuthenticated = !!currentUser;

  const navLinks = [
    { page: Page.Home, label: t('header_nav_home') },
    { page: Page.Team, label: t('header_nav_team') },
    { page: Page.News, label: t('header_nav_news') },
    { page: Page.Schedule, label: t('header_nav_schedule') },
    { page: Page.Classement, label: t('header_nav_classement') },
    { page: Page.Store, label: t('header_nav_store') },
    { page: Page.About, label: t('header_nav_about') },
    { page: Page.Contact, label: t('header_nav_contact') },
    { page: Page.Gallery, label: t('header_nav_gallery') },
    { page: Page.Sponsors, label: t('header_nav_sponsors') },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = currentPage === Page.Home && !isScrolled && !isMenuOpen;
  
  const handleLogout = () => {
    logout();
    onNavigate(Page.Home);
  }

  const LiveIndicator = () => (
    <span className="relative flex h-3 w-3 ms-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
    </span>
  );

  const AuthButtons = () => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [userMenuRef]);

    if (isAuthenticated && currentUser) {
        return (
            <div className="relative" ref={userMenuRef}>
                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-green-dark dark:focus:ring-offset-brand-dark-secondary focus:ring-white">
                    {currentUser.type === 'player' && currentUser.imageUrl ? (
                        <img className="h-10 w-10 rounded-full object-cover" src={currentUser.imageUrl} alt="User avatar" />
                    ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-500 dark:bg-gray-600 flex items-center justify-center ring-2 ring-white/50">
                            <FaUserShield className="h-5 w-5 text-white" />
                        </div>
                    )}
                </button>

                <AnimatePresence>
                    {isUserMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            className="origin-top-right absolute end-0 mt-2 w-64 rounded-md shadow-lg bg-white dark:bg-brand-dark-secondary ring-1 ring-black dark:ring-gray-700 ring-opacity-5 focus:outline-none z-20"
                        >
                            <div className="py-1">
                                <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                    {currentUser.type === 'player' && currentUser.imageUrl ? (
                                        <img className="h-11 w-11 rounded-full object-cover" src={currentUser.imageUrl} alt="User avatar" />
                                    ) : (
                                        <div className="h-11 w-11 rounded-full bg-gray-500 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                                            <FaUserShield className="h-6 w-6 text-white" />
                                        </div>
                                    )}
                                    <div className="ms-3 overflow-hidden">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{currentUser.type === 'player' ? currentUser.name : 'Administrator'}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentUser.type === 'player' ? currentUser.email : 'admin@mouloudiatiznit.com'}</p>
                                    </div>
                                </div>
                                <div className="p-1">
                                    <button onClick={() => { onNavigate(currentUser.type === 'player' ? Page.PlayerDashboard : Page.Admin); setIsUserMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                                        <FaTachometerAlt className="text-gray-400" />
                                        <span>{currentUser.type === 'player' ? t('header_nav_dashboard') : t('header_nav_admin')}</span>
                                    </button>
                                </div>
                                <div className="p-1 border-t border-gray-200 dark:border-gray-700 mt-1">
                                    <button onClick={() => { handleLogout(); setIsUserMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                                        <FaSignOutAlt className="text-gray-400" />
                                        <span>{t('header_nav_logout')}</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }
    
    return (
       <>
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate(Page.Register)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            isTransparent 
                ? 'text-white hover:bg-white/10' 
                : 'text-white dark:text-brand-light-text hover:bg-white/10'
            }`}
        >
            {t('header_nav_register')}
        </motion.button>
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate(Page.Login)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 border ${
            isTransparent 
                ? 'border-white text-white hover:bg-white hover:text-brand-green-dark' 
                : 'border-white text-white hover:bg-white hover:text-brand-green-dark dark:border-brand-gold dark:text-brand-gold dark:hover:bg-brand-gold dark:hover:text-brand-dark-secondary'
            }`}
        >
            {t('header_nav_login')}
        </motion.button>
       </>
    );
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isTransparent ? 'bg-transparent' : 'bg-brand-green-dark/95 dark:bg-brand-dark-secondary/95 backdrop-blur-lg shadow-lg'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => onNavigate(Page.Home)}
          >
            <img src={generalSettings.logoUrl} alt="Club Logo" className={`h-10 w-10 transition-colors duration-300`} />
            <span className="text-white text-xl md:text-2xl font-bold tracking-tight font-display">
              {generalSettings.clubName}
            </span>
          </div>
          <nav className="hidden lg:flex items-center space-x-1">
            {liveMatchId && (
               <motion.button
                key={Page.Live}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate(Page.Live)}
                className={classNames(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative flex items-center", {
                  'text-white bg-red-500/80': currentPage === Page.Live,
                  'text-red-300 hover:text-white hover:bg-red-500/50': currentPage !== Page.Live
                })}
              >
                {t('header_nav_live')}
                <LiveIndicator />
                 {currentPage === Page.Live && (
                    <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                        layoutId="underline"
                    />
                )}
              </motion.button>
            )}
            {navLinks.map(({page, label}) => (
              <motion.button
                key={page}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate(page)}
                className={classNames(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative", {
                  'text-white dark:text-white': currentPage === page,
                  'text-gray-200 hover:text-white dark:text-brand-light-text dark:hover:text-white': currentPage !== page
                })}
              >
                {label}
                 {currentPage === page && (
                    <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-accent-light dark:bg-brand-gold"
                        layoutId="underline"
                    />
                )}
              </motion.button>
            ))}
            <div className="ml-4 flex items-center space-x-2">
              <AuthButtons />
               <button onClick={toggleCart} className="relative text-white hover:bg-white/10 p-2 rounded-full">
                <FaShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {itemCount}
                  </span>
                )}
              </button>
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </nav>
          <div className="lg:hidden flex items-center">
             <button onClick={toggleCart} className="relative text-white p-2 rounded-full mr-2">
                <FaShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {itemCount}
                  </span>
                )}
              </button>
             <LanguageSwitcher />
             <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-brand-accent-light dark:hover:text-brand-gold focus:outline-none ml-2"
              aria-label="Open menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="lg:hidden pb-4 bg-brand-green-dark/95 dark:bg-brand-dark-secondary/95 rounded-b-lg -mx-4 px-4">
            <nav className="flex flex-col space-y-2">
              {liveMatchId && (
                 <button
                  key={Page.Live}
                  onClick={() => {
                    onNavigate(Page.Live);
                    setIsMenuOpen(false);
                  }}
                  className={classNames(
                    "block px-4 py-2 rounded-md text-base font-medium text-left transition-colors duration-200 flex items-center", {
                    'bg-red-500 text-white': currentPage === Page.Live,
                    'text-red-300 hover:bg-red-500/50': currentPage !== Page.Live
                  })}
                >
                  {t('header_nav_live')}
                  <LiveIndicator />
                </button>
              )}
              {navLinks.map(({page, label}) => (
                <button
                  key={page}
                  onClick={() => {
                    onNavigate(page);
                    setIsMenuOpen(false);
                  }}
                  className={classNames(
                    "block px-4 py-2 rounded-md text-base font-medium text-left transition-colors duration-200", {
                    'bg-brand-green text-white dark:bg-brand-gold dark:text-brand-dark': currentPage === page,
                    'text-white hover:bg-white/20 dark:text-brand-light-text dark:hover:bg-white/5': currentPage !== page
                  })}
                >
                  {label}
                </button>
              ))}
              <div className="pt-4 mt-4 border-t border-green-700 dark:border-brand-gold/20 flex flex-col space-y-2">
                 {isAuthenticated && currentUser ? (
                    <>
                        <div className="flex items-center px-4 py-3 border-b border-green-700 dark:border-brand-gold/20">
                            {currentUser.type === 'player' && currentUser.imageUrl ? (
                                <img className="h-11 w-11 rounded-full object-cover" src={currentUser.imageUrl} alt="User avatar" />
                            ) : (
                                <div className="h-11 w-11 rounded-full bg-gray-500 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                                    <FaUserShield className="h-6 w-6 text-white" />
                                </div>
                            )}
                            <div className="ms-3 overflow-hidden">
                                <p className="text-sm font-semibold text-white truncate">{currentUser.type === 'player' ? currentUser.name : 'Administrator'}</p>
                                <p className="text-xs text-gray-300 truncate">{currentUser.type === 'player' ? currentUser.email : 'admin@mouloudiatiznit.com'}</p>
                            </div>
                        </div>
                        <button onClick={() => { onNavigate(currentUser.type === 'player' ? Page.PlayerDashboard : Page.Admin); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 rounded-md text-base font-medium text-white hover:bg-white/20 flex items-center gap-3">
                            <FaTachometerAlt /> <span>{currentUser.type === 'player' ? t('header_nav_dashboard') : t('header_nav_admin')}</span>
                        </button>
                        <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 rounded-md text-base font-medium text-white hover:bg-red-500/80 flex items-center gap-3">
                            <FaSignOutAlt /> <span>{t('header_nav_logout')}</span>
                        </button>
                    </>
                ) : (
                   <>
                    <button onClick={() => { onNavigate(Page.Register); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 rounded-md text-base font-medium text-white hover:bg-white/20">
                      {t('header_nav_register')}
                    </button>
                    <button onClick={() => { onNavigate(Page.Login); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 rounded-md text-base font-medium bg-brand-accent-light text-brand-green-dark dark:bg-brand-gold dark:text-brand-dark-secondary">
                     {t('header_nav_login')}
                   </button>
                   </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;