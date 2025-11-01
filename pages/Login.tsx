import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { CurrentUser } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { FaUser, FaLock } from 'react-icons/fa';
import { motion, Variants } from 'framer-motion';
import { Page } from '../constants';

interface LoginProps {
  onLoginSuccess: (user: CurrentUser) => void;
  onNavigate: (page: Page) => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};


const Login: React.FC<LoginProps> = ({ onLoginSuccess, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithGoogleCredential } = useAuth();
  const { t } = useTranslation();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!(window as any).google || !googleButtonRef.current) {
        return;
    }

    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    if (!GOOGLE_CLIENT_ID) {
        console.warn("Google Client ID is not configured. Google Sign-In will not work.");
        if (googleButtonRef.current) {
            googleButtonRef.current.innerHTML = `<p class="text-xs text-red-500">Google Sign-In is not configured by the developer.</p>`;
        }
        return;
    }

    const handleCallback = async (response: any) => {
        setIsLoading(true);
        setError('');
        try {
            const user = await loginWithGoogleCredential(response.credential);
            onLoginSuccess(user);
        } catch (err: any) {
            setError(err.message || "Google sign-in failed.");
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
          { theme: "outline", size: "large", width: "320" }
      );
    } catch(e) {
      console.error("Error initializing Google Sign In", e);
    }
  }, [loginWithGoogleCredential, onLoginSuccess]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const user = await login(email, password);
      if (user) {
        onLoginSuccess(user);
      } else {
        setError(t('login_error_message'));
      }
    } catch (err: any) {
      setError(err.message || t('login_error_message'));
    } finally {
      setIsLoading(false);
    }
  };

  const inputBaseClasses = "block w-full appearance-none rounded-md border bg-gray-50 dark:bg-brand-dark px-3 py-2 pl-10 text-gray-900 dark:text-white placeholder-gray-400 shadow-sm sm:text-sm transition";
  const inputBorderClasses = "border-gray-300 dark:border-gray-600 focus:border-brand-green focus:outline-none focus:ring-brand-green dark:focus:border-brand-gold dark:focus:ring-brand-gold";


  return (
    <div className="flex min-h-full flex-col md:flex-row bg-white dark:bg-brand-dark-secondary rounded-2xl shadow-2xl overflow-hidden">
      {/* Form Section */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto w-full max-w-sm lg:w-96"
        >
          <motion.div variants={itemVariants}>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-display">
              {t('login_page_title')}
            </h2>
             <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {t('login_subtitle')}
            </p>
          </motion.div>

          <div className="mt-8">
             <motion.div variants={itemVariants} ref={googleButtonRef} className="w-full flex justify-center"></motion.div>

            <motion.div variants={itemVariants} className="mt-6 relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-brand-dark-secondary text-gray-500">{t('auth_divider_or')}</span>
              </div>
            </motion.div>

            <form onSubmit={handleLogin} className="mt-6 space-y-6">
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('login_email_label')}
                </label>
                <div className="mt-1 relative group">
                  <FaUser className="pointer-events-none absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400 group-focus-within:text-brand-green dark:group-focus-within:text-brand-gold transition-colors" />
                  <input
                    id="email"
                    name="email"
                    type="text"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${inputBaseClasses} ${inputBorderClasses}`}
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('login_password_label')}
                </label>
                <div className="mt-1 relative group">
                   <FaLock className="pointer-events-none absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400 group-focus-within:text-brand-green dark:group-focus-within:text-brand-gold transition-colors" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputBaseClasses} ${inputBorderClasses}`}
                  />
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="flex items-center justify-between">
                <div className="text-sm">
                  <button type="button" onClick={() => onNavigate(Page.ForgotPassword)} className="font-medium text-brand-green hover:text-brand-green-dark dark:text-brand-gold dark:hover:text-amber-300">
                    {t('login_forgot_password')}
                  </button>
                </div>
              </motion.div>
              
              {error && <p className="text-sm text-red-500 text-center">{error}</p>}

               <motion.p variants={itemVariants} className="text-xs text-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-brand-dark p-2 rounded-md">
                {t('login_demo_info')}
              </motion.p>

              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-md border border-transparent bg-brand-green py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 dark:bg-brand-gold dark:text-brand-dark dark:hover:bg-amber-400 dark:focus:ring-brand-gold dark:focus:ring-offset-brand-dark-secondary disabled:bg-gray-400"
                >
                  {isLoading ? '...' : t('login_button')}
                </button>
              </motion.div>
            </form>
             <motion.p variants={itemVariants} className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
              {t('login_no_account')}{' '}
              <button onClick={() => onNavigate(Page.Register)} className="font-medium text-brand-green hover:text-brand-green-dark dark:text-brand-gold dark:hover:text-amber-300">
                {t('login_signup')}
              </button>
            </motion.p>
          </div>
        </motion.div>
      </div>
       {/* Image Section */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1666901356149-93f2eb3ba5a2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dm9sbGV5JTIwYmFsbHxlbnwwfHwwfHx8MA%3D%3D&fm=jpg&q=60&w=3000"
          alt="Volleyball players in action"
        />
         <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>
    </div>
  );
};

export default Login;