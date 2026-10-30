import React from 'react';
import { CustomerOrder } from '../types';
import { generateDirectTelegramLink } from '../lib/telegram';
import { CheckCircle2, Send, ExternalLink, X, Clock, MapPin, User, Phone, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface OrderSuccessModalProps {
  order: CustomerOrder | null;
  onClose: () => void;
  onNavigateHome?: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose, onNavigateHome }) => {
  const { t } = useLanguage();
  const [copiedId, setCopiedId] = React.useState(false);

  if (!order) return null;

  const directTelegramUrl = generateDirectTelegramLink(order);

  const handleCopyId = () => {
    navigator.clipboard.writeText(order.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-stone-900 border border-amber-600/30 rounded-2xl shadow-2xl p-6 sm:p-8 text-stone-100 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
          aria-label="Yopish"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-serif-luxury font-bold text-white">
            {t('form.success_title')}
          </h2>
          <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
            {t('form.success_desc')}
          </p>
        </div>

        {/* Order ID Badge */}
        <div className="flex items-center justify-between p-3 bg-stone-950 border border-stone-800 rounded-xl mb-5">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-stone-500 block">Buyurtma ID raqami:</span>
            <span className="font-mono text-sm font-bold text-amber-400">{order.id}</span>
          </div>
          <button
            onClick={handleCopyId}
            className="px-2.5 py-1 text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 rounded flex items-center gap-1 transition-colors"
          >
            {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : null}
            <span>{copiedId ? 'Nusxalandi' : 'Nusxa olish'}</span>
          </button>
        </div>

        {/* Telegram Delivery Status */}
        <div className="mb-6">
          {order.telegramDelivered ? (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-xl flex items-center gap-2.5 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Telegram boti orqali administratorga xabar avtomatik yuborildi.</span>
            </div>
          ) : (
            <div className="p-3.5 bg-amber-950/40 border border-amber-800/40 rounded-xl text-xs space-y-2.5">
              <div className="flex items-start gap-2 text-amber-300">
                <Clock className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <span>
                  Buyurtmangiz server bazasida mustahkam saqlandi. Tezkor aloqa uchun uni to‘g‘ridan-to‘g‘ri administratorimiz Telegramiga bir bosishda yuborishingiz mumkin:
                </span>
              </div>
              <a
                href={directTelegramUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg transition-colors text-xs shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram orqali @ergashexsss7o2 ga yuborish</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Order Summary Details */}
        <div className="space-y-3 p-4 bg-stone-950/80 rounded-xl border border-stone-800/80 text-xs text-stone-300 mb-6">
          <div className="flex justify-between py-1 border-b border-stone-800/50">
            <span className="text-stone-500">Mahsulot:</span>
            <span className="font-semibold text-stone-100 text-right">{order.productTitle}</span>
          </div>

          {order.woodMaterial && (
            <div className="flex justify-between py-1 border-b border-stone-800/50">
              <span className="text-stone-500">Daraxt turi:</span>
              <span className="text-stone-100 font-medium">{order.woodMaterial}</span>
            </div>
          )}

          {order.selectedColors?.length > 0 && (
            <div className="flex justify-between py-1 border-b border-stone-800/50">
              <span className="text-stone-500">Tanlangan rang/dizayn:</span>
              <span className="text-amber-400 font-medium text-right">{order.selectedColors.join(', ')}</span>
            </div>
          )}

          {order.measurements && (
            <div className="flex justify-between py-1 border-b border-stone-800/50">
              <span className="text-stone-500">O‘lchamlari:</span>
              <span className="font-mono text-stone-200">{order.measurements}</span>
            </div>
          )}

          <div className="flex justify-between py-1 border-b border-stone-800/50">
            <span className="text-stone-500 flex items-center gap-1">
              <User className="w-3 h-3" /> Buyurtmachi:
            </span>
            <span className="text-stone-100 font-medium">{order.customerName}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-stone-800/50">
            <span className="text-stone-500 flex items-center gap-1">
              <Phone className="w-3 h-3" /> Telefon:
            </span>
            <span className="font-mono text-amber-400">{order.phoneNumber}</span>
          </div>

          <div className="flex justify-between py-1">
            <span className="text-stone-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Manzil:
            </span>
            <span className="text-stone-200 text-right max-w-[200px] truncate">
              {[order.region, order.city, order.district, order.fullAddress].filter(Boolean).join(', ')}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={() => {
              onClose();
              if (onNavigateHome) onNavigateHome();
            }}
            className="flex-1 py-3 px-4 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-xl transition-colors text-center"
          >
            Bosh sahifaga qaytish
          </button>
          <a
            href="tel:+998979437577"
            className="py-3 px-4 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded-xl transition-colors text-center flex items-center justify-center gap-1.5"
          >
            <span>Usta bilan bog‘lanish (+998 97 943 75 77)</span>
          </a>
        </div>
      </div>
    </div>
  );
};
