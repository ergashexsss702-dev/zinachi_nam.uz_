/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AdminContactModal } from './components/AdminContactModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { HomeView } from './views/HomeView';
import { ZinaView } from './views/ZinaView';
import { MdfView } from './views/MdfView';
import { TobutView } from './views/TobutView';
import { GalleryView } from './views/GalleryView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { AdminView } from './views/AdminView';
import { CustomerOrder } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [isAdminContactOpen, setIsAdminContactOpen] = useState(false);
  const [successOrder, setSuccessOrder] = useState<CustomerOrder | null>(null);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const handleOrderSubmitted = (order: CustomerOrder) => {
    setSuccessOrder(order);
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans transition-colors selection:bg-amber-600 selection:text-white">
          {/* Top Bar Navigation */}
          <Navbar
            currentView={currentView}
            onNavigate={handleNavigate}
            onOpenAdminContact={() => setIsAdminContactOpen(true)}
          />

          {/* Main Content Area */}
          <main className="flex-1">
            {currentView === 'home' && (
              <HomeView
                onNavigate={handleNavigate}
                onOpenAdminContact={() => setIsAdminContactOpen(true)}
              />
            )}

            {currentView === 'zina' && (
              <ZinaView onOrderSuccess={handleOrderSubmitted} />
            )}

            {currentView === 'mdf' && (
              <MdfView onOrderSuccess={handleOrderSubmitted} />
            )}

            {currentView === 'tobutlar' && (
              <TobutView onOrderSuccess={handleOrderSubmitted} />
            )}

            {currentView === 'gallery' && (
              <GalleryView onNavigateOrder={handleNavigate} />
            )}

            {currentView === 'about' && (
              <AboutView onNavigate={handleNavigate} />
            )}

            {currentView === 'contact' && (
              <ContactView />
            )}

            {currentView === 'admin' && (
              <AdminView />
            )}
          </main>

          {/* Architectural Footer */}
          <Footer
            onNavigate={handleNavigate}
            onOpenAdminContact={() => setIsAdminContactOpen(true)}
          />

          {/* Modals */}
          <AdminContactModal
            isOpen={isAdminContactOpen}
            onClose={() => setIsAdminContactOpen(false)}
          />

          <OrderSuccessModal
            order={successOrder}
            onClose={() => setSuccessOrder(null)}
            onNavigateHome={() => setCurrentView('home')}
          />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
