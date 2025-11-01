import React, { useState, useContext } from 'react';
import { DataContext } from '../contexts/DataContext';
import { useTranslation } from '../hooks/useTranslation';
import type { AdminPage } from '../types';
import classNames from 'classnames';
import { FaTachometerAlt, FaUsers, FaCalendarAlt, FaNewspaper, FaStar, FaTags, FaShieldAlt, FaPaintBrush, FaUserTie, FaCog, FaClock, FaShoppingBag, FaBoxOpen, FaTrophy, FaExclamationTriangle } from 'react-icons/fa';
import RegistrationManager from '../components/admin/RegistrationManager';
import MatchManager from '../components/admin/MatchManager';
import NewsManager from '../components/admin/NewsManager';
import SponsorManager from '../components/admin/SponsorManager';
import StatCard from '../components/admin/StatCard';
import CategoryManager from '../components/admin/CategoryManager';
import TeamManager from '../components/admin/TeamManager';
import HomePageManager from '../components/admin/HomePageManager';
import StaffManager from '../components/admin/StaffManager';
import GeneralSettingsManager from '../components/admin/GeneralSettingsManager';
import ProductManager from '../components/admin/ProductManager';
import OrderManager from '../components/admin/OrderManager';
import ClassementManager from '../components/admin/ClassementManager';

const AdminDashboard: React.FC = () => {
  const [activePage, setActivePage] = useState<AdminPage>('dashboard');
  const { registeredPlayers, matches, sponsors, staffMembers, adminActivity } = useContext(DataContext);
  const { t } = useTranslation();

  const sidebarNavItems = [
      { id: 'dashboard', label: t('admin_nav_dashboard'), icon: FaTachometerAlt },
      { id: 'registrations', label: t('admin_nav_registrations'), icon: FaUsers },
      { id: 'staff', label: t('admin_nav_staff'), icon: FaUserTie },
      { id: 'categories', label: t('admin_nav_categories'), icon: FaTags },
      { id: 'teams', label: t('admin_nav_teams'), icon: FaShieldAlt },
      { id: 'matches', label: t('admin_nav_matches'), icon: FaCalendarAlt },
      { id: 'classement', label: t('admin_nav_classement'), icon: FaTrophy },
      { id: 'news', label: t('admin_nav_news'), icon: FaNewspaper },
      { id: 'sponsors', label: t('admin_nav_sponsors'), icon: FaStar },
      { id: 'products', label: t('admin_nav_products'), icon: FaShoppingBag },
      { id: 'orders', label: t('admin_nav_orders'), icon: FaBoxOpen },
      { id: 'appearance', label: t('admin_nav_appearance'), icon: FaPaintBrush },
      { id: 'general', label: t('admin_nav_general'), icon: FaCog },
  ] as const;

  const renderContent = () => {
      switch(activePage) {
          case 'dashboard':
              return (
                  <div className="space-y-8">
                      <div>
                          <h2 className="text-3xl font-bold text-brand-dark-text dark:text-brand-light-text mb-6">{t('admin_dashboard_title')}</h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                              <StatCard title={t('admin_stat_players')} value={registeredPlayers.length} icon={FaUsers} />
                              <StatCard title={t('admin_stat_staff')} value={staffMembers.length} icon={FaUserTie} />
                              <StatCard title={t('admin_stat_matches')} value={matches.length} icon={FaCalendarAlt} />
                              <StatCard title={t('admin_stat_sponsors')} value={sponsors.length} icon={FaStar} />
                          </div>
                      </div>
                      <div>
                          <h3 className="text-2xl font-bold text-brand-dark-text dark:text-brand-light-text mb-4">{t('admin_dashboard_activity_title')}</h3>
                          <div className="bg-white dark:bg-brand-dark-secondary p-4 rounded-lg shadow-md">
                              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                  {adminActivity.slice(0, 5).map(activity => (
                                      <li key={activity.id} className="py-3 flex items-center">
                                          <FaClock className="h-5 w-5 text-gray-400 mr-4" />
                                          <div className="flex-grow">
                                              <p className="text-sm text-gray-800 dark:text-gray-200">{activity.message}</p>
                                              <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                                          </div>
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      </div>
                  </div>
              );
          case 'registrations':
              return <RegistrationManager />;
          case 'staff':
              return <StaffManager />;
          case 'categories':
              return <CategoryManager />;
          case 'teams':
              return <TeamManager />;
          case 'matches':
              return <MatchManager />;
          case 'classement':
              return <ClassementManager />;
          case 'news':
              return <NewsManager />;
          case 'sponsors':
              return <SponsorManager />;
          case 'products':
              return <ProductManager />;
          case 'orders':
              return <OrderManager />;
          case 'appearance':
              return <HomePageManager />;
          case 'general':
              return <GeneralSettingsManager />;
          default:
              return null;
      }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-200px)] bg-brand-light dark:bg-brand-dark rounded-lg shadow-lg">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-brand-green-dark dark:bg-brand-dark-secondary text-white p-4 md:p-6 flex-shrink-0 rounded-t-lg md:rounded-tr-none md:rounded-l-lg">
        <h1 className="text-2xl font-bold mb-8 text-brand-light-text">{t('admin_page_title')}</h1>
        <nav>
            <ul>
                {sidebarNavItems.map(item => (
                    <li key={item.id}>
                        <button 
                            onClick={() => setActivePage(item.id)} 
                            className={classNames(
                                'w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors duration-200', {
                                'bg-brand-green text-white dark:bg-brand-gold dark:text-brand-dark font-bold': activePage === item.id,
                                'text-gray-200 hover:bg-brand-green dark:text-brand-light-text dark:hover:bg-gray-700': activePage !== item.id
                            })}
                        >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-8 overflow-auto">
         <div className="bg-amber-100 dark:bg-amber-900/30 border-l-4 border-amber-500 text-amber-800 dark:text-amber-200 p-4 rounded-r-lg mb-8" role="alert">
            <div className="flex">
                <div className="py-1"><FaExclamationTriangle className="h-5 w-5 text-amber-500 mr-3" /></div>
                <div>
                    <p className="font-bold">Demonstration Mode</p>
                    <p className="text-sm">{t('admin_disclaimer')}</p>
                </div>
            </div>
        </div>
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;