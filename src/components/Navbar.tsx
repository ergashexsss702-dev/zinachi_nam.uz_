import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Globe, Menu, X, Shield, PhoneCall } from 'lucide-react';
import { Language } from '../data/translations';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAdminContact: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenAdminContact,
}) => {
  const { language, setLanguage, t, languages } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', labelKey: 'nav.home' },
    { id: 'zina', labelKey: 'nav.zina' },
    { id: 'mdf', labelKey: 'nav.mdf' },
    { id: 'tobutlar', labelKey: 'nav.tobutlar' },
    { id: 'gallery', labelKey: 'nav.gallery' },
    { id: 'about', labelKey: 'nav.about' },
    { id: 'contact', labelKey: 'nav.contact' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-stone-950/90 dark:bg-stone-950/95 backdrop-blur-md border-b border-stone-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element wordmark in display face) */}
        <button
          onClick={() => handleLinkClick('home')}
          className="text-xl sm:text-2xl font-serif-luxury font-black tracking-tight text-white hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 text-left"
        >
          ZINACHI_NAM.UZ
        </button>

        {/* Zone 2: Navigation Links (Clean single-line text links with subtle hover underlines) */}
        <nav className="hidden lg:flex items-center gap-7 text-[13px] font-medium tracking-wide">
          {navLinks.map((link) => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 relative ${
                  isActive
                    ? 'text-amber-400 font-semibold'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                {t(link.labelKey)}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Language switcher, Theme toggle, Contact Admin, Primary CTA) */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-800 hover:border-stone-700 bg-stone-900/80 text-stone-300 hover:text-white text-xs font-mono transition-colors"
              title="Tilni tanlash / Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-amber-500" />
              <span className="uppercase text-[11px] font-semibold">{language}</span>
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-stone-900 border border-stone-800 rounded-xl shadow-2xl py-1.5 z-50 divide-y divide-stone-800/60 max-h-80 overflow-y-auto">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code as Language);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                      language === l.code
                        ? 'bg-amber-500/10 text-amber-400 font-semibold'
                        : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base leading-none">{l.flag}</span>
                      <span>{l.label}</span>
                    </div>
                    <span className="font-mono text-[10px] text-stone-500 uppercase">{l.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-stone-800 hover:border-stone-700 bg-stone-900/80 text-stone-300 hover:text-white transition-colors"
            title={theme === 'dark' ? 'Yorug‘ rejimga o‘tish' : 'Tungi rejimga o‘tish'}
            aria-label="Rejimni o‘zgartirish"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-stone-300" />
            )}
          </button>

          {/* Admin Contact Quick Trigger */}
          <button
            onClick={onOpenAdminContact}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-400 hover:text-amber-300 border border-amber-500/30 hover:border-amber-500/60 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{t('admin.call_label')}</span>
          </button>

          {/* Zone 3 Primary Action */}
          <button
            onClick={() => handleLinkClick('zina')}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-amber-600 hover:bg-amber-500 active:bg-amber-700 rounded-lg transition-colors shadow-sm whitespace-nowrap shrink-0"
          >
            {t('nav.order_now')}
          </button>

          {/* Mobile menu hamburger toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg border border-stone-800 text-stone-300 hover:text-white hover:bg-stone-900 transition-colors"
            aria-label="Menyu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-800 bg-stone-950 px-4 pt-4 pb-6 space-y-2 animate-fade-in">
          {navLinks.map((link) => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-amber-600/10 text-amber-400 font-semibold border-l-2 border-amber-400'
                    : 'text-stone-300 hover:bg-stone-900 hover:text-white'
                }`}
              >
                {t(link.labelKey)}
              </button>
            );
          })}

          <div className="pt-4 border-t border-stone-800 space-y-2">
            <button
              onClick={() => {
                onOpenAdminContact();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-stone-900 border border-amber-500/30 rounded-lg text-xs font-medium text-amber-400"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{t('admin.call_label')} (+998 97 943 75 77)</span>
            </button>

            <button
              onClick={() => handleLinkClick('admin')}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 text-xs text-stone-400 hover:text-stone-200"
            >
              <Shield className="w-3.5 h-3.5 text-stone-500" />
              <span>{t('nav.admin_panel')}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
