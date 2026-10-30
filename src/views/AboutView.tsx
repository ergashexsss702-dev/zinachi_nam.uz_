import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Award, Compass, ShieldCheck, HeartHandshake, Phone, ArrowRight } from 'lucide-react';
import heroWorkshop from '../assets/images/hero_woodworking_workshop_1793376537689.jpg';

export const AboutView: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-16 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Hero Intro */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-mono font-bold tracking-widest text-amber-500 uppercase">
          Ustalar Sulolasi
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif-luxury font-black text-white mt-2">
          Biz Haqimizda — ZINACHI_NAM.UZ
        </h1>
        <p className="text-stone-300 text-sm sm:text-base mt-4 leading-relaxed">
          Namangan — azaldan hunarmandchilik, duradgorlik va yog‘och o‘ymakorligi beshigi sanaladi. Biz 20 yildan ortiq vaqt davomida an’anaviy sharqona duradgorlik sirlarini zamonaviy arxitektura me’yorlari bilan uyg‘unlashtirib kelmoqdamiz.
        </p>
      </div>

      {/* Split story */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-stone-900/50 border border-stone-800 rounded-3xl p-8 sm:p-12">
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white">
            Har Bir Qadam — Tabiat va Mahorat Uyg‘unligi
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Biz yog‘ochni oddiy qurilish materiali deb bilmaymiz. Har bir daraxtning o‘z nafasi, o‘z tolalari va o‘z ovozi bor. Bizning ustalarimiz tog‘ yonbag‘irlarida o‘sgan yillik halqalari zich yong‘oq va qarag‘aylarni alohida mehr bilan saralab oladi.
          </p>
          <div className="space-y-3 pt-2 text-xs text-stone-300">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>Namangan an’analariga qat’iy rioya qilingan toza qo‘l mehnati</span>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>Germaniya va Italiya texnologiyalarida quritilgan ekologik toza yog‘ochlar</span>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>Ovoz o‘tkazmaydigan, g‘ijirlamaydigan kafolatli zinalar va eshiklar</span>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <button
              onClick={() => onNavigate('zina')}
              className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-lg"
            >
              <span>Zinalarni ko‘rish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <a
              href="tel:+998979437577"
              className="px-5 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-medium transition-colors"
            >
              Usta bilan bog‘lanish
            </a>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-stone-800 bg-stone-950 aspect-[4/3] shadow-2xl">
          <img
            src={heroWorkshop}
            alt="Namangan Ustaxonasi"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
          <Award className="w-8 h-8 text-amber-500" />
          <h3 className="text-lg font-serif-luxury font-bold text-white">Mukammal Sifat</h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            Har bir detal millimetrik aniqlikda tekshiriladi va tayyor mahsulot uyingizga o‘rnatilgunga qadar usta nazoratidan o‘tadi.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
          <HeartHandshake className="w-8 h-8 text-amber-500" />
          <h3 className="text-lg font-serif-luxury font-bold text-white">Mijoz Ishonchi</h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            Biz uchun eng katta yutuq — xonadoningizda avloddan-avlodga xizmat qiladigan zinalar va eshiklar yaratishdir.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
          <Compass className="w-8 h-8 text-amber-500" />
          <h3 className="text-lg font-serif-luxury font-bold text-white">An’analarga Sodiqlik</h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            Namangan tobutlari va o‘ymakor zinalarida ajdodlarimizdan qolgan pok va sof urf-odatlar to‘liq saqlanadi.
          </p>
        </div>
      </div>
    </div>
  );
};
