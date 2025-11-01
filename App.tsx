import React, { useState, useContext, useEffect } from 'react';
import { Page } from './constants';
import { DataContext } from './contexts/DataContext';
import { AuthContext, CurrentUser } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Team from './pages/Team';
import News from './pages/News';
import Schedule from './pages/Schedule';
import Gallery from './pages/Gallery';
import HypeGenerator from './pages/HypeGenerator';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import PlayerDashboard from './pages/PlayerDashboard';
import Sponsors from './pages/Sponsors';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Sitemap from './pages/Sitemap';
import MaintenancePage from './pages/MaintenancePage';
import Store from './pages/Store';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import ForgotPassword from './pages/ForgotPassword';
import CartSidebar from './components/CartSidebar';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';
import { useTranslation } from './hooks/useTranslation';
import { useTheme } from './hooks/useTheme';
import Toaster from './components/Toaster';
import NewsDetail from './pages/NewsDetail';
import Classement from './pages/Classement';
import { FaExclamationTriangle } from 'react-icons/fa';
import Live from './pages/Live';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const { news, matches, generalSettings, loading: dataLoading, fetchError } = useContext(DataContext);
  const { currentUser, loading: authLoading } = useContext(AuthContext);
  const { direction } = useTranslation();
  const { theme } = useTheme();

  const isPlayer = currentUser?.type === 'player';
  const isAdmin = currentUser?.type === 'admin';

  useEffect(() => {
    const favicon = document.getElementById('favicon') as HTMLLinkElement | null;
    if (favicon && generalSettings?.faviconUrl) {
      favicon.href = generalSettings.faviconUrl;
    }
  }, [generalSettings?.faviconUrl]);

  const handleNavigate = (page: Page) => {
    if (page === Page.Admin && !isAdmin) {
      setCurrentPage(Page.Login);
      return;
    }
     if (page === Page.PlayerDashboard && !isPlayer) {
      setCurrentPage(Page.Login);
      return;
    }
    if (isPlayer && currentUser.status === 'approved' && page !== Page.PlayerDashboard) {
      return;
    }

    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleViewArticle = (articleId: number) => {
    setSelectedArticleId(articleId);
    setCurrentPage(Page.NewsDetail);
  };
  
  const handleCheckoutSuccess = (newOrderId: number) => {
    setOrderId(newOrderId);
    setCurrentPage(Page.OrderConfirmation);
  }

  const handleLoginSuccess = (user: CurrentUser) => {
    if (user?.type === 'admin') {
      setCurrentPage(Page.Admin);
    } else if (user?.type === 'player') {
      setCurrentPage(Page.PlayerDashboard);
    } else {
      setCurrentPage(Page.Home);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return <PageTransition key="home"><Home onNavigate={handleNavigate} onViewArticle={handleViewArticle} /></PageTransition>;
      case Page.Team:
        return <PageTransition key="team"><Team /></PageTransition>;
      case Page.News:
        return <PageTransition key="news"><News articles={news} onViewDetail={handleViewArticle} /></PageTransition>;
      case Page.NewsDetail: {
        const article = news.find(a => a.id === selectedArticleId);
        if (article) {
          return <PageTransition key={`news-detail-${selectedArticleId}`}><NewsDetail article={article} onBack={() => setCurrentPage(Page.News)} /></PageTransition>;
        }
        setCurrentPage(Page.News);
        return <PageTransition key="news-fallback"><News articles={news} onViewDetail={handleViewArticle} /></PageTransition>;
      }
      case Page.Schedule:
        return <PageTransition key="schedule"><Schedule matches={matches} /></PageTransition>;
      case Page.Gallery:
        return <PageTransition key="gallery"><Gallery /></PageTransition>;
      case Page.Sponsors:
        return <PageTransition key="sponsors"><Sponsors /></PageTransition>;
      case Page.About:
        return <PageTransition key="about"><About /></PageTransition>;
      case Page.Contact:
        return <PageTransition key="contact"><Contact /></PageTransition>;
      case Page.HypeGenerator:
        return <PageTransition key="hype"><HypeGenerator matches={matches} /></PageTransition>;
      case Page.Store:
        return <PageTransition key="store"><Store /></PageTransition>;
      case Page.Checkout:
        return <PageTransition key="checkout"><Checkout onCheckoutSuccess={handleCheckoutSuccess} onNavigate={handleNavigate} /></PageTransition>;
      case Page.OrderConfirmation:
        return <PageTransition key="order-confirmation"><OrderConfirmation orderId={orderId} onNavigate={handleNavigate} /></PageTransition>;
      case Page.Admin:
        return isAdmin ? <PageTransition key="admin"><AdminDashboard /></PageTransition> : <PageTransition key="login-redirect-admin"><Login onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate}/></PageTransition>;
      case Page.PlayerDashboard:
        return isPlayer && currentUser ? <PageTransition key="player-dashboard"><PlayerDashboard player={currentUser} /></PageTransition> : <PageTransition key="login-redirect-player"><Login onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate}/></PageTransition>;
      case Page.Login:
         return <PageTransition key="login"><Login onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate}/></PageTransition>;
      case Page.Register:
         return <PageTransition key="register"><Register onRegisterSuccess={handleLoginSuccess} /></PageTransition>;
      case Page.PrivacyPolicy:
         return <PageTransition key="privacy"><PrivacyPolicy /></PageTransition>;
      case Page.TermsOfService:
         return <PageTransition key="terms"><TermsOfService /></PageTransition>;
       case Page.Sitemap:
         return <PageTransition key="sitemap"><Sitemap onNavigate={handleNavigate} /></PageTransition>;
      case Page.ForgotPassword:
         return <PageTransition key="forgot-password"><ForgotPassword onNavigate={handleNavigate} /></PageTransition>;
      case Page.Classement:
         return <PageTransition key="classement"><Classement /></PageTransition>;
      case Page.Live:
          return <PageTransition key="live"><Live /></PageTransition>;
      default:
        return <PageTransition key="default-home"><Home onNavigate={handleNavigate} onViewArticle={handleViewArticle} /></PageTransition>;
    }
  };

  if (dataLoading || authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-brand-light dark:bg-brand-dark text-brand-dark-text dark:text-brand-light-text">Loading...</div>
  }
  
  if (fetchError || !generalSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4">
          <div className="text-center">
              <FaExclamationTriangle className="mx-auto h-12 w-12 text-red-500" />
              <h1 className="mt-4 text-2xl font-bold">Application Error</h1>
              <p className="mt-2 text-red-700 dark:text-red-300">Could not load required application data.</p>
              <pre className="mt-4 text-xs text-left bg-red-100 dark:bg-red-900/30 p-4 rounded-md overflow-x-auto">
                  {fetchError || "General settings are missing. The application cannot start."}
              </pre>
          </div>
      </div>
    );
  }

  if (generalSettings?.isMaintenanceMode && !isAdmin && currentPage !== Page.Login) {
    return <MaintenancePage onNavigate={handleNavigate} />;
  }

  return (
    <div className={`${theme} min-h-screen flex flex-col bg-brand-light dark:bg-brand-dark text-brand-dark-text dark:text-brand-light-text transition-colors duration-300`} dir={direction}>
      <Toaster />
      <CartSidebar onNavigate={handleNavigate} />
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {renderPage()}
        </AnimatePresence>
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;