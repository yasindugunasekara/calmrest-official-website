import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, Mail, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { trackEvent } from '../utils/analytics';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  const navigation = [
    { name: t('home'), href: '/' },
    { name: t('rooms'), href: '/rooms' },
    { name: t('about'), href: '/about' },
    // { name: t('services'), href: '/services' },
    { name: t('location'), href: '/location' },
    { name: t('Reviews'), href: '/Testimonials' },
    { name: t('contact'), href: '/contact' },
  ];

  return (
    <>
      {/* Top bar */}
      <div className="bg-white text-navy py-1 px-4 text-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            
          </div>
          
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="flex items-center space-x-2 hover:text-gold transition-colors"
            >
              <span>{currentLanguage?.flag}</span>
              <span>{currentLanguage?.name}</span>
              <ChevronDown size={14} />
            </button>
            
            {isLanguageOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white text-navy shadow-lg rounded-md py-2 min-w-[120px] z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLanguageOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-cream flex items-center space-x-2 ${
                      language === lang.code ? 'bg-cream text-gold' : ''
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-13 h-13  rounded-full flex items-center justify-center">
                  <img
                    src="https://res.cloudinary.com/dcgfwnzzr/image/upload/v1760970811/calmrest_logo_vbuoxu.png"
                    alt="Calm Rest logo"
                    className="w-10 h-10 object-cover rounded-full"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-navy font-serif">Calm Rest</h1>
                  {/* <p className="text-sm text-gray-600">Luxury Hotel</p> */}
                </div>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() =>
                    trackEvent("nav_click", {
                      link_name: item.name,
                      target_url: item.href,
                    })
                  }
                  className={`text-sm font-medium transition-colors hover:text-gold ${
                    location.pathname === item.href
                      ? "text-gold border-b-2 border-gold"
                      : "text-navy"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <button
                className="bg-gold text-white px-6 py-2 rounded hover:bg-opacity-90 transition-all duration-300 font-medium"
                onClick={() => {
                  trackEvent("cta_click", {
                    button_name: "Navbar Book Now",
                    target_url: "/Login",
                  });
                  navigate("/Login");
                }}
              >
                {t("bookNow")}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-navy hover:text-gold transition-colors"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium transition-colors ${
                    location.pathname === item.href
                      ? 'text-gold bg-cream'
                      : 'text-navy hover:text-gold hover:bg-cream'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
                <div className="px-3 pt-2">
                <button
                  className="w-full bg-gold text-white px-6 py-2 rounded hover:bg-opacity-90 transition-all duration-300 font-medium"
                   onClick={() => {
              navigate('/login');
              }}
                >
                  {t('bookNow')}
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;