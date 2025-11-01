import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { FaGlobe, FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import classNames from 'classnames';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' },
  ] as const;

  const handleLanguageChange = (lang: 'en' | 'fr' | 'ar') => {
    setLanguage(lang);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left mx-2" ref={dropdownRef}>
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex justify-center items-center w-full rounded-full shadow-sm px-4 py-2 bg-white/10 text-sm font-medium text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-green-dark dark:focus:ring-offset-brand-dark-secondary focus:ring-white transition-colors"
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <FaGlobe className="h-5 w-5" aria-hidden="true" />
          <span className="mx-2 font-semibold">{language.toUpperCase()}</span>
          <FaChevronDown
            className={classNames('h-4 w-4 transition-transform duration-200', {
              'transform rotate-180': isOpen,
            })}
          />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="origin-top-right absolute end-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-brand-dark-secondary ring-1 ring-black dark:ring-gray-700 ring-opacity-5 focus:outline-none z-20"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
          >
            <div className="py-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={classNames(
                    'w-full text-left px-4 py-2 text-sm flex items-center justify-between',
                    {
                      'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white': language === lang.code,
                      'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700': language !== lang.code,
                    }
                  )}
                  role="menuitem"
                >
                  <span>{lang.name}</span>
                  {language === lang.code && (
                    <span className="text-brand-green dark:text-brand-gold">✓</span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
