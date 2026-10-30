import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { STAIRCASE_DESIGNS } from '../data/staircases';
import { MDF_DOOR_DESIGNS } from '../data/doors';
import { NAMANGAN_COFFIN_DESIGNS } from '../data/coffins';
import { ArrowRight, PhoneCall, Check, Award, Layers, Compass, Sparkles } from 'lucide-react';

import heroWorkshopImg from '../assets/images/hero_woodworking_workshop_1793376537689.jpg';
import customerZina1 from '../assets/images/zina_portfolio_classic_1_1793376538008.jpg';
import customerZina2 from '../assets/images/zina_portfolio_modern_2_1793376538455.jpg';
import mdfDoorsShowcase from '../assets/images/mdf_doors_showcase_1793376538829.jpg';

interface HomeViewProps {
  onNavigate: (view: string) => void;
  onOpenAdminContact: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenAdminContact }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-mono font-medium tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Namangan Yog‘och O‘ymakorligi va Duradgorlik Maktabi</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-luxury font-black text-white tracking-tight leading-[1.15]">
                {t('hero.title')}
              </h1>

              <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-xl">
                {t('hero.desc')}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('zina')}
                  className="px-6 py-3.5 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-semibold text-sm rounded-xl transition-all shadow-lg hover:shadow-amber-600/20 flex items-center gap-2 group"
                >
                  <span>{t('hero.order_cta')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={onOpenAdminContact}
                  className="px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-amber-400 border border-amber-500/30 hover:border-amber-500/60 font-semibold text-sm rounded-xl transition-all flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{t('hero.contact_admin_cta')}</span>
                </button>
              </div>

              {/* Trust markers */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-stone-800/80 text-xs text-stone-400">
                <div>
                  <div className="font-mono text-xl sm:text-2xl font-bold text-white tabular-nums">20+</div>
                  <div className="mt-0.5">Yillik tajriba</div>
                </div>
                <div>
                  <div className="font-mono text-xl sm:text-2xl font-bold text-amber-400 tabular-nums">1,400+</div>
                  <div className="mt-0.5">Muvaffaqiyatli zina & eshik</div>
                </div>
                <div>
                  <div className="font-mono text-xl sm:text-2xl font-bold text-white tabular-nums">100%</div>
                  <div className="mt-0.5">Tabiiy tog‘ yong‘og‘i</div>
                </div>
              </div>
            </div>

            {/* Right Showcase Media */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-stone-800 bg-stone-900 group aspect-[4/3] lg:aspect-[4/5]">
                <img
                  src={heroWorkshopImg}
                  alt="ZINACHI_NAM.UZ Ustaxonasi"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-stone-950/80 backdrop-blur-md border border-stone-800/80">
                  <div className="text-xs uppercase tracking-wider text-amber-400 font-mono font-medium">
                    Namangan Master Atelier
                  </div>
                  <div className="text-sm font-serif-luxury font-bold text-white mt-1">
                    An’anaviy duradgorlik va eng so‘nggi arxitektura texnologiyalari
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Main Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold tracking-widest text-amber-500 uppercase">
            Mahsulotlar Katalogi
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-white mt-2">
            Uch Asosiy Yo‘nalish
          </h2>
          <p className="text-stone-400 text-sm mt-3">
            Har bir bo‘lim alohida professional konfigurator va buyurtma anketasiga ega
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Category 1: ZINA */}
          <div
            onClick={() => onNavigate('zina')}
            className="group relative cursor-pointer rounded-2xl overflow-hidden bg-stone-900/70 border border-stone-800 hover:border-amber-500/50 transition-all duration-300 shadow-xl hover:-translate-y-1 flex flex-col"
          >
            <div className="aspect-[4/3] overflow-hidden bg-stone-950 relative">
              <img
                src={customerZina1}
                alt="Zina Katalogi"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-md rounded-md text-amber-400 font-mono text-xs font-semibold">
                12 TA MODEL
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-serif-luxury font-bold text-white group-hover:text-amber-400 transition-colors">
                  1. {t('cat.zina')}
                </h3>
                <p className="text-xs text-stone-400 mt-2.5 leading-relaxed">
                  {t('cat.zina_desc')}
                </p>
              </div>
              <div className="pt-6 flex items-center text-xs font-semibold text-amber-400 gap-1.5 group-hover:gap-2.5 transition-all">
                <span>{t('cat.view_catalog')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Category 2: MDF ESHIKLAR */}
          <div
            onClick={() => onNavigate('mdf')}
            className="group relative cursor-pointer rounded-2xl overflow-hidden bg-stone-900/70 border border-stone-800 hover:border-amber-500/50 transition-all duration-300 shadow-xl hover:-translate-y-1 flex flex-col"
          >
            <div className="aspect-[4/3] overflow-hidden bg-stone-950 relative">
              <img
                src={mdfDoorsShowcase}
                alt="MDF Eshiklar Katalogi"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-md rounded-md text-amber-400 font-mono text-xs font-semibold">
                12 TA DIZAYN
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-serif-luxury font-bold text-white group-hover:text-amber-400 transition-colors">
                  2. {t('cat.mdf')}
                </h3>
                <p className="text-xs text-stone-400 mt-2.5 leading-relaxed">
                  {t('cat.mdf_desc')}
                </p>
              </div>
              <div className="pt-6 flex items-center text-xs font-semibold text-amber-400 gap-1.5 group-hover:gap-2.5 transition-all">
                <span>{t('cat.view_catalog')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Category 3: TOBUTLAR */}
          <div
            onClick={() => onNavigate('tobutlar')}
            className="group relative cursor-pointer rounded-2xl overflow-hidden bg-stone-900/70 border border-stone-800 hover:border-amber-500/50 transition-all duration-300 shadow-xl hover:-translate-y-1 flex flex-col"
          >
            <div className="aspect-[4/3] overflow-hidden bg-stone-950 relative flex items-center justify-center p-6 text-center border-b border-stone-800">
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-stone-800/80 flex items-center justify-center text-amber-500 font-serif-luxury font-bold text-xl">
                  ☪
                </div>
                <div className="text-xs font-medium text-amber-400 font-mono">
                  NAMANGAN AN’ANAVIY MODELI
                </div>
                <div className="text-[11px] text-stone-400 italic max-w-xs">
                  Namangancha tobut rasmi administrator tomonidan qo‘shiladi.
                </div>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-serif-luxury font-bold text-white group-hover:text-amber-400 transition-colors">
                  3. {t('cat.tobut')}
                </h3>
                <p className="text-xs text-stone-400 mt-2.5 leading-relaxed">
                  {t('cat.tobut_desc')}
                </p>
              </div>
              <div className="pt-6 flex items-center text-xs font-semibold text-amber-400 gap-1.5 group-hover:gap-2.5 transition-all">
                <span>{t('cat.view_catalog')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Portfolio Showcase (Customer-provided staircase photographs) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900/40 border border-stone-800 rounded-3xl p-8 sm:p-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-amber-500 uppercase">
                Haqiqiy Portfolio
              </span>
              <h2 className="text-3xl font-serif-luxury font-bold text-white mt-1">
                {t('portfolio.title')}
              </h2>
              <p className="text-stone-400 text-xs sm:text-sm mt-2 max-w-xl">
                {t('portfolio.desc')}
              </p>
            </div>
            <button
              onClick={() => onNavigate('gallery')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 shrink-0"
            >
              <span>Barcha suratlarni ko‘rish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer Photo 1 */}
            <div className="group rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 shadow-xl">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={customerZina1}
                  alt="Mijoz zinasining haqiqiy surati - Klassik o‘ymakor"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 rounded-md text-amber-400 font-mono text-[11px] font-semibold border border-amber-500/20">
                  Mijoz Portfoliosi #1
                </div>
              </div>
              <div className="p-5">
                <h4 className="text-base font-serif-luxury font-bold text-white">
                  Klassik Qirolona Qora Yong‘oq Zina
                </h4>
                <p className="text-xs text-stone-400 mt-1">
                  Qo‘lda sayqallangan balyasinlar, 100% tabiiy yong‘oq massividan tayyorlangan saroy darajasidagi loyiha.
                </p>
              </div>
            </div>

            {/* Customer Photo 2 */}
            <div className="group rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 shadow-xl">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={customerZina2}
                  alt="Mijoz zinasining haqiqiy surati - Zamonaviy suzuvchi zina"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 rounded-md text-amber-400 font-mono text-[11px] font-semibold border border-amber-500/20">
                  Mijoz Portfoliosi #2
                </div>
              </div>
              <div className="p-5">
                <h4 className="text-base font-serif-luxury font-bold text-white">
                  Zamonaviy Konsol (Suzuvchi) Yong‘oq Zina
                </h4>
                <p className="text-xs text-stone-400 mt-1">
                  Po‘lat mustahkamlovchi arxitektura karkasi, yumshoq tag yoritgichlari va shisha to‘siqli minimalist loyiha.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif-luxury font-bold text-white">
              Saralangan Tog‘ Yong‘og‘i
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Biz faqat kamida 3 yil tabiiy quritilgan, namlik darajasi 8–10% dan oshmaydigan yuqori zichlikdagi yog‘ochlardan foydalanamiz.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif-luxury font-bold text-white">
              Aniq Millimetrik O‘lchov
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Tajribali usta muhandislarimiz uyingizga borib joyida lazerli o‘lchov oladi va individual 3D me’moriy loyihasini taqdim etadi.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif-luxury font-bold text-white">
              Ovoz va Chidamlilik Kafolati
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Maxsus akustik qulflar orqali zinalar yillar o‘tsa ham g‘ijirlamaydi, MDF eshiklar esa shovqinni to‘liq o‘tkazmaydi.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
