import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, MapPin, Camera, Bell, Shield, User } from 'lucide-react';

const Layout = () => {
  const { t } = useTranslation();

  const navItems = [
    { to: '/', icon: Home, label: t('nav.home') },
    { to: '/risk-check', icon: MapPin, label: t('nav.riskCheck') },
    { to: '/report', icon: Camera, label: t('nav.report') },
    { to: '/alerts', icon: Bell, label: t('nav.alerts') },
    { to: '/profile', icon: User, label: t('nav.profile') }
  ];

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <Outlet />
      
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-2 px-3 transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`
              }
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
