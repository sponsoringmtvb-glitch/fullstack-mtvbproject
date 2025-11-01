import React, { useState, useContext, useEffect, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { DataContext } from '../contexts/DataContext';
import { FaUserPlus } from 'react-icons/fa';
import { motion, Variants } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useToasts } from '../hooks/useToasts';
import type { CurrentUser } from '../contexts/AuthContext';

interface RegisterProps {
  onRegisterSuccess: (user: CurrentUser) => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dob: '',
    phone: '',
    sex: 'Male' as 'Male' | 'Female',
  });
  const [submitted, setSubmitted] = useState(false);
  const { registerPlayer } = useContext(DataContext);
  const { loginWithGoogleCredential } = useAuth();
  const { addToast } = useToasts();
  const { t } = useTranslation();
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!(window as any).google || !googleButtonRef.current) {
        return;
    }

    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    if (!GOOGLE_CLIENT_ID) {
        console.warn("Google Client ID is not configured. Google Sign-Up will not work.");
        if (googleButtonRef.current) {
            googleButtonRef.current.innerHTML = `<p class="text-xs text-red-500">Google Sign-Up is not configured by the developer.</p>`;
        }
        return;
    }

    const handleCallback = async (response: any) => {
        setIsLoading(true);
        try {
            const user = await loginWithGoogleCredential(response.credential);
            onRegisterSuccess(user);
        } catch (err: any) {
            addToast(err.message || "Google sign-up failed.", "error");
        } finally {
            setIsLoading(false);
        }
    };
    
    try {
      (window as any).google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCallback
      });

      (window as any).google.accounts.id.renderButton(
          googleButtonRef.current,
          { theme: "outline", size: "large", text: "signup_with", width: "320" }
      );
    } catch(e) {
      console.error("Error initializing Google Sign In", e);
    }

  }, [loginWithGoogleCredential, onRegisterSuccess, addToast]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = registerPlayer(formData);
    if(success) {
      setSubmitted(true);
    }
  };

  const inputClasses = "appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-brand-dark placeholder-gray-500 text-gray-900 dark:text-brand-light-text focus:outline-none focus:ring-2 focus:ring-brand-green dark:focus:ring-brand-gold focus:border-brand-green dark:focus:border-brand-gold focus:z-10 sm:text-sm rounded-md";

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center py-12 px-4"
      >
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-brand-dark-secondary p-10 rounded-xl shadow-lg text-center">
            <FaUserPlus className="mx-auto h-12 w-auto text-brand-green dark:text-brand-gold" />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-brand-light-text">
                {t('register_button')}
            </h2>
            <p className="mt-2 text-center text-md text-gray-600 dark:text-gray-300">
                {t('register_success_message')} Please check your email to verify your account.
            </p>
            <button
              onClick={() => onRegisterSuccess(null)}
              className="mt-6 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-green hover:bg-brand-green-dark dark:bg-brand-gold dark:hover:bg-amber-400 dark:text-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green dark:focus:ring-brand-gold"
            >
              {t('header_nav_login')}
            </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full space-y-8 bg-white dark:bg-brand-dark-secondary p-10 rounded-xl shadow-lg"
      >
        <motion.div variants={itemVariants}>
          <FaUserPlus className="mx-auto h-12 w-auto text-brand-green dark:text-brand-gold" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-brand-light-text">
            {t('register_page_title')}
          </h2>
        </motion.div>
        
        <motion.div variants={itemVariants} ref={googleButtonRef} className="w-full flex justify-center"></motion.div>

        <motion.div variants={itemVariants} className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-brand-dark-secondary text-gray-500">{t('auth_divider_or')}</span>
            </div>
        </motion.div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
             <motion.div variants={itemVariants}>
              <label htmlFor="name" className="sr-only">{t('register_name_label')}</label>
              <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} className={inputClasses} placeholder={t('register_name_label')} />
            </motion.div>
             <motion.div variants={itemVariants}>
              <label htmlFor="email" className="sr-only">{t('register_email_label')}</label>
              <input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} className={inputClasses} placeholder={t('register_email_label')} />
            </motion.div>
            <motion.div variants={itemVariants}>
              <label htmlFor="password" className="sr-only">{t('register_password_label')}</label>
              <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} className={inputClasses} placeholder={t('register_password_label')} />
            </motion.div>
             <motion.div variants={itemVariants}>
                <label className="text-sm text-gray-500 dark:text-gray-400">{t('register_sex_label')}</label>
                <div className="flex items-center space-x-4 mt-2">
                    <label className="flex items-center">
                    <input type="radio" name="sex" value="Male" required checked={formData.sex === 'Male'} onChange={handleChange} className="form-radio text-brand-green dark:text-brand-gold focus:ring-brand-green dark:focus:ring-brand-gold"/>
                    <span className="ml-2 text-gray-700 dark:text-gray-300">{t('sex_male')}</span>
                    </label>
                    <label className="flex items-center">
                    <input type="radio" name="sex" value="Female" required checked={formData.sex === 'Female'} onChange={handleChange} className="form-radio text-brand-green dark:text-brand-gold focus:ring-brand-green dark:focus:ring-brand-gold"/>
                    <span className="ml-2 text-gray-700 dark:text-gray-300">{t('sex_female')}</span>
                    </label>
                </div>
            </motion.div>
             <div className="grid grid-cols-2 gap-4">
                <motion.div variants={itemVariants}>
                    <label htmlFor="dob" className="text-sm text-gray-500 dark:text-gray-400">{t('register_dob_label')}</label>
                    <input id="dob" name="dob" type="date" required value={formData.dob} onChange={handleChange} className={inputClasses} placeholder={t('register_dob_label')} />
                </motion.div>
                 <motion.div variants={itemVariants}>
                    <label htmlFor="phone" className="text-sm text-gray-500 dark:text-gray-400">{t('register_phone_label')}</label>
                    <input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleChange} className={inputClasses} placeholder={t('register_phone_label')} />
                </motion.div>
             </div>
          </div>

          <motion.div variants={itemVariants}>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-green hover:bg-brand-green-dark dark:bg-brand-gold dark:hover:bg-amber-400 dark:text-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green dark:focus:ring-brand-gold disabled:opacity-50"
            >
              {isLoading ? '...' : t('register_button')}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;