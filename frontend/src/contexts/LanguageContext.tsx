import React, { useState } from 'react';
import { LanguageContext } from './languageStore';

const translations = {
  en: {
    // Navigation
    home: 'Home',
    rooms: 'Rooms & Suites',
    about: 'About Us',
    services: 'Services',
    location: 'Location',
    testimonials: 'Testimonials',
    contact: 'Contact',
    profile: 'Profile',

    // Common
    bookNow: 'Book Now',
    learnMore: 'Learn More',
    viewAll: 'View All',
    subscribe: 'Subscribe',

    // Home page
    heroTitle: 'Welcome to Calm Rest',
    heroSubtitle: 'Experience luxury and tranquility in the heart of the city',
    aboutTitle: 'About Calm Rest',
    aboutText: 'Discover unparalleled luxury at Calm Rest, where modern elegance meets timeless comfort. Our meticulously designed spaces offer the perfect sanctuary for discerning travelers.',
    featuredRooms: 'Featured Rooms',
    ourServices: 'Our Services',

    // Footer
    newsletter: 'Newsletter',
    newsletterText: 'Stay updated with our latest offers and events',
    followUs: 'Follow Us',
    contactInfo: 'Contact Information',
  },
  de: {
    // Navigation
    home: 'Startseite',
    rooms: 'Zimmer & Suiten',
    about: 'Über Uns',
    services: 'Dienstleistungen',
    location: 'Standort',
    testimonials: 'Bewertungen',
    contact: 'Kontakt',
    profile: 'Profil',

    // Common
    bookNow: 'Jetzt Buchen',
    learnMore: 'Mehr Erfahren',
    viewAll: 'Alle Anzeigen',
    subscribe: 'Abonnieren',

    // Home page
    heroTitle: 'Willkommen im Calm Rest',
    heroSubtitle: 'Erleben Sie Luxus und Ruhe im Herzen der Stadt',
    aboutTitle: 'Über Calm Rest',
    aboutText: 'Entdecken Sie unvergleichlichen Luxus im Calm Rest, wo moderne Eleganz auf zeitlosen Komfort trifft. Unsere sorgfältig gestalteten Räume bieten das perfekte Refugium für anspruchsvolle Reisende.',
    featuredRooms: 'Empfohlene Zimmer',
    ourServices: 'Unsere Dienstleistungen',

    // Footer
    newsletter: 'Newsletter',
    newsletterText: 'Bleiben Sie über unsere neuesten Angebote und Events informiert',
    followUs: 'Folgen Sie Uns',
    contactInfo: 'Kontaktinformationen',
  },
  zh: {
    // Navigation
    home: '首页',
    rooms: '客房套房',
    about: '关于我们',
    services: '服务',
    location: '位置',
    testimonials: '客户评价',
    contact: '联系我们',
    profile: '个人资料',

    // Common
    bookNow: '立即预订',
    learnMore: '了解更多',
    viewAll: '查看全部',
    subscribe: '订阅',

    // Home page
    heroTitle: '欢迎来到宁静休憩酒店',
    heroSubtitle: '在城市中心体验奢华与宁静',
    aboutTitle: '关于宁静休憩',
    aboutText: '在宁静休憩酒店发现无与伦比的奢华，这里现代优雅与永恒舒适完美融合。我们精心设计的空间为挑剔的旅客提供完美的避风港。',
    featuredRooms: '精选客房',
    ourServices: '我们的服务',

    // Footer
    newsletter: '新闻通讯',
    newsletterText: '及时了解我们的最新优惠和活动',
    followUs: '关注我们',
    contactInfo: '联系信息',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key: string): string => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
