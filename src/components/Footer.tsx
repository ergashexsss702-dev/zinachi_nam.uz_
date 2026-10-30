import React, { useState } from 'react';
import { Phone, Instagram, Send, Shield, Heart, FileText, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenAdminContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdminContact }) => {
  const { t } = useLanguage();
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);

  return (
    <footer className="bg-stone-950 border-t border-stone-800 text-stone-400 text-xs">
      {/* Upper Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Col 1: Brand & Philosophy */}
        <div className="md:col-span-2 space-y-4">
          <button
            onClick={() => onNavigate('home')}
            className="text-2xl font-serif-luxury font-black text-white hover:text-amber-400 transition-colors tracking-tight text-left block"
          >
            ZINACHI_NAM.UZ
          </button>
          <p className="text-stone-400 text-sm leading-relaxed max-w-md">
            Namangan shahridagi 20 yillik tajribaga ega ustaxonamizda saralangan tog‘ yong‘og‘i, qarag‘ay va massiv yog‘ochlardan buyurtma asosida qirolona zinalar, MDF eshiklar hamda an’anaviy tobutlar tayyorlanadi.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a
              href="tel:+998979437577"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-lg transition-colors text-xs shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Qo‘ng‘iroq: +998 97 943 75 77</span>
            </a>
            <button
              onClick={onOpenAdminContact}
              className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-lg text-stone-300 hover:text-white transition-colors text-xs"
            >
              Bog‘lanish oynasi
            </button>
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-wider text-white font-semibold font-mono">
            Bo‘limlar
          </h4>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => onNavigate('zina')}
                className="hover:text-amber-400 transition-colors"
              >
                {t('nav.zina')} (12 xil katalog)
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('mdf')}
                className="hover:text-amber-400 transition-colors"
              >
                {t('nav.mdf')} (12 xil model)
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('tobutlar')}
                className="hover:text-amber-400 transition-colors"
              >
                {t('nav.tobutlar')} (Faqat Namangancha)
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('gallery')}
                className="hover:text-amber-400 transition-colors"
              >
                {t('nav.gallery')} (Real fotosuratlar)
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('about')}
                className="hover:text-amber-400 transition-colors"
              >
                {t('nav.about')}
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('contact')}
                className="hover:text-amber-400 transition-colors"
              >
                {t('nav.contact')}
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Direct Contacts & Social */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-wider text-white font-semibold font-mono">
            Rasmiy Aloqa
          </h4>
          <ul className="space-y-2.5">
            <li>
              <a
                href="tel:+998979437577"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="font-mono text-stone-300">+998 97 943 75 77</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/zinachi_nam.uz/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                <span>@zinachi_nam.uz</span>
              </a>
            </li>
            <li>
              <a
                href="https://t.me/ergashexsss7o2"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>@ergashexsss7o2</span>
              </a>
            </li>
            <li className="pt-2">
              <button
                onClick={() => onNavigate('admin')}
                className="flex items-center gap-2 text-stone-500 hover:text-amber-400 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin boshqaruv paneli</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-800/80 bg-black/40 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <div>
            © {new Date().getFullYear()} ZINACHI_NAM.UZ — Barcha huquqlar himoyalangan.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setModalType('privacy')}
              className="hover:text-stone-300 transition-colors"
            >
              Maxfiylik siyosati (Privacy Policy)
            </button>
            <span>·</span>
            <button
              onClick={() => setModalType('terms')}
              className="hover:text-stone-300 transition-colors"
            >
              Foydalanish shartlari (Terms of Service)
            </button>
          </div>
        </div>
      </div>

      {/* Legal Modals */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-stone-200">
          <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-3">
              {modalType === 'privacy' ? 'Maxfiylik Siyosati' : 'Foydalanish Shartlari'}
            </h3>
            <div className="space-y-3 text-xs text-stone-400 leading-relaxed">
              {modalType === 'privacy' ? (
                <>
                  <p>
                    ZINACHI_NAM.UZ mijozlarining shaxsiy ma’lumotlarini (ism, telefon raqami, yetkazib berish manzili) qat’iy himoya qiladi.
                  </p>
                  <p>
                    Kiritilgan ma’lumotlar faqat yog‘och mahsulotlari buyurtmasini tayyorlash, o‘lchov olish va mijoz bilan to‘g‘ridan-to‘g‘ri bog‘lanish maqsadida ishlatiladi.
                  </p>
                  <p>
                    Uchinchi shaxslarga tijorat yoki reklama maqsadida berilmaydi.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Zinalar, MDF eshiklar va tobutlar mijozning tasdiqlangan o‘lchamlari va tanlangan yog‘och turi asosida professional darajada ishlab chiqariladi.
                  </p>
                  <p>
                    Namangan tobutlari viloyatning qadimiy an’anaviy me’yorlariga 100% rioya etilgan holda, toza tabiiy daraxtdan ehtirom bilan yasaladi.
                  </p>
                  <p>
                    Kafolat: Yog‘ochning tabiiy qurishi va mustahkamligiga ustaxona tomonidan kafolat beriladi.
                  </p>
                </>
              )}
            </div>
            <button
              onClick={() => setModalType(null)}
              className="mt-6 w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-xs font-medium transition-colors"
            >
              Tushunarli, yopish
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};
