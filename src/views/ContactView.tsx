import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Phone, Instagram, Send, MapPin, Clock, CheckCircle2, MessageSquare, Copy, Check } from 'lucide-react';

export const ContactView: React.FC = () => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('+998979437577');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryPhone.trim()) return;
    setIsSent(true);
    setTimeout(() => {
      setInquiryName('');
      setInquiryPhone('');
      setInquiryMsg('');
    }, 4000);
  };

  return (
    <div className="space-y-16 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-mono font-bold tracking-widest text-amber-500 uppercase">
          Bog‘lanish
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif-luxury font-black text-white mt-2">
          Biz Bilan Bog‘laning
        </h1>
        <p className="text-stone-300 text-xs sm:text-sm mt-3">
          Savollaringiz bormi yoki ustani manzilga chaqirmoqchimisiz? Biz bilan to‘g‘ridan-to‘g‘ri telefon, Instagram yoki Telegram orqali bog‘laning.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          {/* Phone */}
          <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-stone-400 flex items-center gap-2 font-semibold">
                <Phone className="w-4 h-4 text-amber-500" />
                Telefon Qo‘ng‘irog‘i
              </span>
              <button
                onClick={handleCopyPhone}
                className="text-xs text-stone-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Nusxalandi' : 'Nusxa'}</span>
              </button>
            </div>
            <a
              href="tel:+998979437577"
              className="text-2xl font-mono font-bold text-amber-400 hover:text-amber-300 transition-colors block"
            >
              +998 97 943 75 77
            </a>
            <p className="text-xs text-stone-400 leading-relaxed">
              Bosh usta va administrator bilan to‘g‘ridan-to‘g‘ri suhbat. 24/7 qabul qilinadi.
            </p>
            <a
              href="tel:+998979437577"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-xl transition-colors shadow-md"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Hozir qo‘ng‘iroq qilish</span>
            </a>
          </div>

          {/* Instagram */}
          <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-stone-400 flex items-center gap-2 font-semibold">
                <Instagram className="w-4 h-4 text-pink-500" />
                Rasmiy Instagram
              </span>
              <span className="text-xs font-mono text-stone-400">@zinachi_nam.uz</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Yangi zinalar, o‘rnatish jarayonlari va video lavhalarni Instagram sahifamizda kuzating.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <a
                href="https://www.instagram.com/zinachi_nam.uz/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-4 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded-xl transition-colors"
              >
                <span>Sahifaga o‘tish</span>
              </a>
              <a
                href="https://ig.me/m/zinachi_nam.uz"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-4 bg-pink-900/30 hover:bg-pink-900/50 text-pink-300 border border-pink-700/30 text-xs font-medium rounded-xl transition-colors"
              >
                <span>Direct xabar</span>
              </a>
            </div>
          </div>

          {/* Telegram */}
          <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-stone-400 flex items-center gap-2 font-semibold">
                <Send className="w-4 h-4 text-sky-400" />
                Telegram Administrator
              </span>
              <span className="text-xs font-mono text-sky-400">@ergashexsss7o2</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Loyihalar, chizmalar va o‘lchamlarni to‘g‘ridan-to‘g‘ri Telegram orqali yuborishingiz mumkin.
            </p>
            <a
              href="https://t.me/ergashexsss7o2"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-xl transition-colors shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Telegram orqali xabar yozish</span>
            </a>
          </div>

          {/* Address & Workshop Location */}
          <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 shadow-xl space-y-3">
            <span className="text-xs uppercase tracking-wider text-stone-400 flex items-center gap-2 font-semibold">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Ustaxona Manzili
            </span>
            <div className="text-sm font-semibold text-white">
              Namangan shahri, Usta Shirin ko‘chasi, ZINACHI_NAM.UZ Yog‘ochsozlik Majmuasi
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-400 pt-1">
              <Clock className="w-3.5 h-3.5 text-stone-500" />
              <span>Ish vaqti: Dushanba - Yakshanba (08:00 - 20:00)</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Direct Inquiry Form & Map */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-8 rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl">
            <h3 className="text-xl font-serif-luxury font-bold text-white mb-2">
              Usta Maslahatini Olish
            </h3>
            <p className="text-xs text-stone-400 mb-6">
              Ismingiz va raqamingizni qoldiring, 15 daqiqa ichida bosh usta siz bilan bog‘lanadi.
            </p>

            {isSent ? (
              <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Xabaringiz Qabul Qilindi!</h4>
                <p className="text-xs text-emerald-300">
                  Usta administratorimiz tez orada siz bilan bog‘lanadi.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1.5">Ismingiz *</label>
                  <input
                    type="text"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    required
                    placeholder="Ismingizni kiriting"
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1.5">Telefon raqamingiz *</label>
                  <input
                    type="tel"
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    required
                    placeholder="+998 90 123 45 67"
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1.5">Xabar yoki savolingiz</label>
                  <textarea
                    rows={4}
                    value={inquiryMsg}
                    onChange={(e) => setInquiryMsg(e.target.value)}
                    placeholder="Qanday zina yoki eshik kerakligi haqida qisqacha yozing..."
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-lg"
                >
                  Xabarni yuborish
                </button>
              </form>
            )}
          </div>

          {/* Interactive Workshop Location Representation */}
          <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-amber-400">
                NAMANGAN XARITASI
              </span>
              <span className="text-[11px] text-stone-500">Koordinatalar: 40.9983° N, 71.6726° E</span>
            </div>

            <div className="h-48 rounded-2xl bg-stone-950 border border-stone-800 relative overflow-hidden flex items-center justify-center p-6 text-center">
              <div className="absolute inset-0 bg-wood-grain opacity-40" />
              <div className="relative z-10 space-y-2">
                <MapPin className="w-8 h-8 text-amber-500 mx-auto animate-bounce" />
                <div className="text-sm font-serif-luxury font-bold text-white">
                  ZINACHI_NAM.UZ Bosh Ustaxonasi
                </div>
                <p className="text-xs text-stone-400">
                  O‘zbekiston, Namangan shahri markazida joylashgan
                </p>
                <a
                  href="https://maps.google.com/?q=Namangan"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-2 text-[11px] text-amber-400 hover:underline font-mono"
                >
                  Google Xaritalarda ko‘rish →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
