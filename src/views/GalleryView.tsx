import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { STAIRCASE_DESIGNS } from '../data/staircases';
import { MDF_DOOR_DESIGNS } from '../data/doors';
import { NAMANGAN_COFFIN_DESIGNS } from '../data/coffins';
import { Maximize2, X, ZoomIn, ZoomOut, Check, ArrowRight, Camera } from 'lucide-react';

import customerZina1 from '../assets/images/zina_portfolio_classic_1_1793376538008.jpg';
import customerZina2 from '../assets/images/zina_portfolio_modern_2_1793376538455.jpg';
import heroWorkshop from '../assets/images/hero_woodworking_workshop_1793376537689.jpg';
import mdfDoorsShowcase from '../assets/images/mdf_doors_showcase_1793376538829.jpg';

interface GalleryItem {
  id: string;
  category: 'zina' | 'mdf' | 'tobut';
  title: string;
  subtitle: string;
  imageUrl?: string;
  isNamanganVerified?: boolean;
  isCustomerPortfolio?: boolean;
}

export const GalleryView: React.FC<{ onNavigateOrder: (cat: string) => void }> = ({ onNavigateOrder }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'all' | 'zina' | 'mdf' | 'tobut'>('all');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const galleryItems: GalleryItem[] = [
    // Zina items (Customer photos featured first)
    {
      id: 'gal-zina-cust-1',
      category: 'zina',
      title: 'Mijoz Buyurtmasi: Saroy Klassik Yong‘oq Zina',
      subtitle: 'Qo‘lda o‘yilgan qora yong‘oq balyasinlari, 100% massiv yog‘och',
      imageUrl: customerZina1,
      isCustomerPortfolio: true,
    },
    {
      id: 'gal-zina-cust-2',
      category: 'zina',
      title: 'Mijoz Buyurtmasi: Suzuvchi Konsol Yong‘oq Zina',
      subtitle: 'Devor ichi mustahkam po‘lat karkas va pastki LED chiroqlari',
      imageUrl: customerZina2,
      isCustomerPortfolio: true,
    },
    {
      id: 'gal-zina-atelier',
      category: 'zina',
      title: 'Namangan Ustaxonasi: Spiral Zina Ishlab Chiqarish',
      subtitle: 'Egilgan 5 qatlamli qattiq yog‘och arxitekturasi',
      imageUrl: heroWorkshop,
    },
    // MDF doors
    {
      id: 'gal-mdf-1',
      category: 'mdf',
      title: 'Italiya Emalli Oq va Yong‘oq Shponli MDF Eshiklar',
      subtitle: 'Shovqin o‘tkazmaydigan germetik zichlik va chuqur 3D frezerlash',
      imageUrl: mdfDoorsShowcase,
    },
    {
      id: 'gal-mdf-2',
      category: 'mdf',
      title: 'Klassik Frezerlangan Portalli Eshik',
      subtitle: 'Karniz va kapitel ustunlar bilan to‘ldirilgan hashamat',
      imageUrl: mdfDoorsShowcase,
    },
    // Tobut items (Strictly Namangan traditional respectful models)
    {
      id: 'gal-tob-1',
      category: 'tobut',
      title: 'Namangancha Standart Yog‘och Tobut',
      subtitle: 'Namangan viloyati an’analari bo‘yicha ehtirom bilan tayyorlangan',
      isNamanganVerified: true,
    },
    {
      id: 'gal-tob-2',
      category: 'tobut',
      title: 'Namangancha Qalin Mustahkam Yog‘och Tobut',
      subtitle: 'Quritilgan terak va qarag‘aydan, mustahkam tutqichli an’anaviy model',
      isNamanganVerified: true,
    },
  ];

  const filteredItems = galleryItems.filter(item => {
    if (activeTab === 'all') return true;
    return item.category === activeTab;
  });

  const openLightbox = (item: GalleryItem) => {
    setLightboxItem(item);
    setZoomLevel(1);
  };

  const closeLightbox = () => {
    setLightboxItem(null);
    setZoomLevel(1);
  };

  return (
    <div className="space-y-12 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-mono font-bold tracking-widest text-amber-500 uppercase">
          Vizual Arxiv
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif-luxury font-black text-white mt-2">
          Mahsulotlar Galereyasi
        </h1>
        <p className="text-stone-300 text-xs sm:text-sm mt-3">
          Mijozlarimiz buyurtmalari, ustaxonamiz faoliyati va haqiqiy yog‘och san’ati fotosuratlari.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 p-1 bg-stone-900 border border-stone-800 rounded-xl max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'all'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          Barchasi
        </button>
        <button
          onClick={() => setActiveTab('zina')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'zina'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          Zinalar
        </button>
        <button
          onClick={() => setActiveTab('mdf')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'mdf'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          MDF Eshiklar
        </button>
        <button
          onClick={() => setActiveTab('tobut')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'tobut'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          Tobutlar
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => openLightbox(item)}
            className="group cursor-pointer rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 hover:border-amber-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between"
          >
            <div className="aspect-[4/3] bg-stone-950 relative overflow-hidden flex items-center justify-center">
              {item.imageUrl ? (
                <>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="p-3 bg-stone-950/80 rounded-full text-white backdrop-blur-sm">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-stone-900 flex items-center justify-center text-amber-500 text-xl mb-2">
                    ☪
                  </div>
                  <div className="text-xs font-mono font-bold text-stone-200">
                    NAMANGAN AN’ANAVIY MODELI
                  </div>
                  <div className="text-[11px] text-amber-400/90 italic mt-2">
                    "Namangancha tobut rasmi administrator tomonidan qo‘shiladi."
                  </div>
                </div>
              )}

              {item.isCustomerPortfolio && (
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 rounded-md text-[10px] font-mono text-amber-400 border border-amber-500/20">
                  Mijoz Portfoliosi
                </div>
              )}
            </div>

            <div className="p-5">
              <h3 className="text-sm font-serif-luxury font-bold text-white group-hover:text-amber-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal with Zoom */}
      {lightboxItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950">
              <div className="truncate mr-4">
                <h3 className="text-sm font-serif-luxury font-bold text-white truncate">
                  {lightboxItem.title}
                </h3>
                <p className="text-xs text-stone-400 truncate">{lightboxItem.subtitle}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {lightboxItem.imageUrl && (
                  <>
                    <button
                      onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
                      className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-white"
                      title="Kattalashtirish (Zoom in)"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 1))}
                      className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-white"
                      title="Kichraytirish (Zoom out)"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                  </>
                )}
                <button
                  onClick={closeLightbox}
                  className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-white"
                  title="Yopish"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Media Viewer */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-stone-950">
              {lightboxItem.imageUrl ? (
                <div
                  className="transition-transform duration-200 origin-center"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  <img
                    src={lightboxItem.imageUrl}
                    alt={lightboxItem.title}
                    className="max-h-[65vh] max-w-full object-contain rounded-lg shadow-2xl"
                  />
                </div>
              ) : (
                <div className="max-w-md p-8 text-center bg-stone-900 border border-stone-800 rounded-2xl">
                  <div className="w-14 h-14 mx-auto rounded-full bg-stone-950 border border-stone-800 flex items-center justify-center text-amber-500 text-2xl mb-4">
                    ☪
                  </div>
                  <h4 className="text-base font-serif-luxury font-bold text-white mb-2">
                    {lightboxItem.title}
                  </h4>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Ushbu bo‘limda xorijiy yoki begona tobut rasmlari ko‘rsatilmaydi. Haqiqiy Namangancha tobut rasmi administrator tomonidan kiritiladi.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Action */}
            <div className="p-4 border-t border-stone-800 bg-stone-950 flex justify-between items-center">
              <span className="text-xs text-stone-500">
                ZINACHI_NAM.UZ rasmiy duradgorlik ustaxonasi
              </span>
              <button
                onClick={() => {
                  closeLightbox();
                  onNavigateOrder(lightboxItem.category);
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <span>Ushbu toifa bo‘yicha buyurtma berish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
