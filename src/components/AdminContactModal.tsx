import React from 'react';
import { Phone, Instagram, Send, X, ExternalLink, Check, Copy } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AdminContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminContactModal: React.FC<AdminContactModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('+998979437577');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-stone-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
          aria-label="Yopish"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <span className="text-xs uppercase tracking-widest text-amber-500 font-semibold">
            To‘g‘ridan-to‘g‘ri aloqa
          </span>
          <h3 className="text-xl font-serif-luxury font-bold text-white mt-1">
            {t('nav.contact_admin')}
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            Ustaxona ma’muriyati va bosh ustasi bilan istalgan qulay usulda bog‘laning
          </p>
        </div>

        {/* Contact Methods */}
        <div className="space-y-3.5">
          {/* Phone Call */}
          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800/80 hover:border-amber-500/50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-500" />
                CALL ADMIN:
              </span>
              <button
                onClick={handleCopyPhone}
                className="text-[11px] text-stone-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
                title="Raqamdan nusxa olish"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Nusxalandi' : 'Nusxa olish'}
              </button>
            </div>
            <a
              href="tel:+998979437577"
              className="inline-flex items-center justify-between w-full px-4 py-3 bg-amber-600 hover:bg-amber-500 text-white font-mono font-semibold text-base rounded-lg transition-colors shadow-sm"
            >
              <span>+998 97 943 75 77</span>
              <span className="text-xs uppercase tracking-wider font-sans font-medium px-2 py-0.5 bg-black/20 rounded">
                Qo‘ng‘iroq qilish
              </span>
            </a>
          </div>

          {/* Instagram */}
          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800/80 hover:border-pink-500/50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-pink-500" />
                INSTAGRAM:
              </span>
              <span className="text-[11px] font-mono text-stone-400">@zinachi_nam.uz</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <a
                href="https://www.instagram.com/zinachi_nam.uz/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded-lg transition-colors"
              >
                <span>Sahifani ochish</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://ig.me/m/zinachi_nam.uz"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-pink-900/40 hover:bg-pink-900/60 text-pink-200 text-xs font-medium rounded-lg transition-colors border border-pink-700/30"
              >
                <span>Direct xabar</span>
                <Send className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Telegram Admin */}
          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800/80 hover:border-sky-500/50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-sky-400" />
                TELEGRAM ADMIN:
              </span>
              <span className="text-[11px] font-mono text-sky-400">@ergashexsss7o2</span>
            </div>
            <a
              href="https://t.me/ergashexsss7o2"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium rounded-lg transition-colors"
            >
              <span>Telegram orqali yozish</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-5 pt-4 border-t border-stone-800 text-center">
          <p className="text-[11px] text-stone-500">
            Ish vaqti: 24/7 buyurtmalar qabul qilinadi · Namangan shahri
          </p>
        </div>
      </div>
    </div>
  );
};
