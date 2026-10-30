import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { NAMANGAN_COFFIN_DESIGNS, COFFIN_WOOD_OPTIONS, COFFIN_FINISH_OPTIONS } from '../data/coffins';
import { CoffinDesign, CustomerOrder, CountryInfo } from '../types';
import { PhoneInput } from '../components/PhoneInput';
import { submitOrderToServer } from '../lib/telegram';
import { saveLocalOrder } from '../lib/supabase';
import { Check, CheckCircle2, AlertCircle, Send, Loader2, Info } from 'lucide-react';

interface TobutViewProps {
  onOrderSuccess: (order: CustomerOrder) => void;
}

export const TobutView: React.FC<TobutViewProps> = ({ onOrderSuccess }) => {
  const { t } = useLanguage();

  // Selection states (Strictly verified Namangan traditional models only)
  const [selectedModel, setSelectedModel] = useState<CoffinDesign>(NAMANGAN_COFFIN_DESIGNS[0]);
  const [selectedWood, setSelectedWood] = useState(COFFIN_WOOD_OPTIONS[0]);
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>([
    COFFIN_FINISH_OPTIONS[0].nameUz,
    COFFIN_FINISH_OPTIONS[1].nameUz,
  ]);

  // Notes & Address
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [country, setCountry] = useState('O‘zbekiston');
  const [region, setRegion] = useState('Namangan viloyati');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [fullAddress, setFullAddress] = useState('');

  // Customer contact
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [countryInfo, setCountryInfo] = useState<CountryInfo>({
    name: 'O‘zbekiston',
    iso2: 'UZ',
    dialCode: '+998',
    flag: '🇺🇿',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle finish toggling (strictly exact 2)
  const handleFinishToggle = (nameUz: string) => {
    const isSelected = selectedFinishes.includes(nameUz);
    if (isSelected) {
      if (selectedFinishes.length > 1) {
        setSelectedFinishes(selectedFinishes.filter(f => f !== nameUz));
      }
    } else {
      if (selectedFinishes.length >= 2) {
        setSelectedFinishes([selectedFinishes[1], nameUz]);
      } else {
        setSelectedFinishes([...selectedFinishes, nameUz]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedModel) {
      setErrorMessage('Iltimos, Namangan tobuti modelini tanlang.');
      return;
    }
    if (!selectedWood) {
      setErrorMessage('Iltimos, yog‘och turini tanlang.');
      return;
    }
    if (selectedFinishes.length !== 2) {
      setErrorMessage('Iltimos, aynan 2 ta ishlov berish turini tanlang.');
      return;
    }
    if (!fullAddress.trim()) {
      setErrorMessage('Iltimos, yetkazish manzilini to‘liq kiriting.');
      return;
    }
    if (!customerName.trim()) {
      setErrorMessage('Iltimos, ismingizni kiriting.');
      return;
    }
    if (!phoneNumber || !isPhoneValid) {
      setErrorMessage('Iltimos, to‘g‘ri telefon raqam kiriting.');
      return;
    }

    setIsSubmitting(true);

    const orderId = `TOB-${Date.now().toString().slice(-7)}`;
    const newOrder: CustomerOrder = {
      id: orderId,
      category: 'tobut',
      productTitle: selectedModel.nameUz,
      productDesignId: selectedModel.id,
      woodMaterial: selectedWood.nameUz,
      selectedColors: selectedFinishes,
      customerName: customerName.trim(),
      phoneNumber: phoneNumber.trim(),
      country: country,
      countryCode: countryInfo.iso2,
      region: region,
      city: city,
      district: district,
      fullAddress: fullAddress.trim(),
      additionalNotes: additionalNotes.trim() || 'Namangan an’anaviy me’yori bo‘yicha',
      quantity: 1,
      status: 'yangi',
      createdAt: new Date().toISOString(),
      telegramDelivered: false,
    };

    try {
      const result = await submitOrderToServer(newOrder);
      const finalOrder = { ...newOrder, telegramDelivered: result.telegramDelivered };
      saveLocalOrder(finalOrder);
      onOrderSuccess(finalOrder);
    } catch (err: any) {
      console.error('Tobut order failed:', err);
      saveLocalOrder(newOrder);
      onOrderSuccess(newOrder);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 pb-24">
      {/* Solemn & Respectful Page Header */}
      <section className="text-center max-w-3xl mx-auto px-4 pt-6">
        <span className="text-xs font-mono font-bold tracking-widest text-amber-500 uppercase">
          Ehtirom va An’analar
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-white mt-2">
          An’anaviy Namangancha Tobutlar
        </h1>
        <p className="text-stone-300 text-xs sm:text-sm mt-3 leading-relaxed max-w-xl mx-auto">
          Ushbu bo‘limda faqat va faqat Namangan viloyatida azaldan qo‘llanib kelinayotgan an’anaviy, toza silliqlangan va mustahkam yog‘och tobut modellari taqdim etiladi. Hech qanday begona yoki soxta dizaynlar kiritilmagan.
        </p>

        {/* Notice of authenticity */}
        <div className="mt-5 inline-flex items-center gap-2 p-3 bg-stone-900 border border-stone-800 rounded-xl text-stone-400 text-xs text-left max-w-md mx-auto">
          <Info className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            Haqiqiy Namangan modeli rasmlari administrator tomonidan tasdiqlangan holda saqlanadi.
          </span>
        </div>
      </section>

      {/* Verified Models Display */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {NAMANGAN_COFFIN_DESIGNS.map((model) => {
            const isCur = selectedModel?.id === model.id;
            return (
              <div
                key={model.id}
                className={`rounded-2xl border transition-all p-6 bg-stone-900/60 flex flex-col justify-between ${
                  isCur
                    ? 'border-amber-500 ring-1 ring-amber-500 shadow-xl'
                    : 'border-stone-800 hover:border-stone-700'
                }`}
              >
                <div>
                  {/* Strict placeholder container */}
                  <div className="h-44 rounded-xl bg-stone-950 border border-stone-800/80 flex flex-col items-center justify-center p-6 text-center mb-5 relative overflow-hidden">
                    <div className="w-10 h-10 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-500 text-lg mb-2">
                      ☪
                    </div>
                    <div className="text-xs font-semibold text-stone-300 font-mono">
                      NAMANGAN AN’ANAVIY MODELI
                    </div>
                    {/* Clear placeholder label required by prompt */}
                    <div className="text-[11px] text-amber-400/90 italic mt-1 font-sans max-w-xs">
                      "{model.imagePlaceholderNote}"
                    </div>
                    {isCur && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 bg-amber-600 rounded text-white font-mono text-[10px] font-bold">
                        Tanlangan
                      </div>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-white">
                    {model.nameUz}
                  </h3>
                  <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                    {model.descriptionUz}
                  </p>

                  <div className="mt-4 pt-3 border-t border-stone-800/70 text-[11px] text-stone-400">
                    <span className="text-stone-500 block mb-1">Mavjud materiallar:</span>
                    <div className="flex flex-wrap gap-1">
                      {model.materialOptionsUz.map((m, idx) => (
                        <span key={idx} className="text-stone-300">
                          {m}{idx < model.materialOptionsUz.length - 1 ? ' · ' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedModel(model);
                      const el = document.getElementById('tobut-form-root');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                      isCur
                        ? 'bg-amber-600 text-white'
                        : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
                    }`}
                  >
                    {isCur ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Tanlandi (Buyurtma shakliga o‘tish)</span>
                      </>
                    ) : (
                      <span>Ushbu modelni tanlash</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7-Step Questionnaire */}
      <section id="tobut-form-root" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="text-center max-w-xl mx-auto mb-10 pb-6 border-b border-stone-800">
            <span className="text-xs font-mono font-bold tracking-widest text-amber-500 uppercase">
              {t('q.tobut.subtitle')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white mt-1">
              {t('q.tobut.title')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-2">
              Barcha me’yorlarga to‘liq rioya etgan holda buyurtma tafsilotlarini belgilang
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* QUESTION 1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {t('q.tobut.step1')}
                  </h3>
                  <p className="text-xs text-stone-400">Tasdiqlangan Namangan modellaridan birini tanlang:</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {NAMANGAN_COFFIN_DESIGNS.map((m) => {
                  const isCur = selectedModel?.id === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedModel(m)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        isCur
                          ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500'
                          : 'border-stone-800 bg-stone-950 hover:border-stone-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-white">{m.nameUz}</div>
                      <div className="text-[11px] text-stone-400 mt-1">{m.descriptionUz}</div>
                      <div className="mt-3 text-[10px] font-mono text-amber-400">
                        {isCur ? '✓ Tanlangan' : 'Tanlash'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* QUESTION 2 */}
            <div className="space-y-4 pt-4 border-t border-stone-800">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {t('q.tobut.step2')}
                  </h3>
                  <p className="text-xs text-stone-400">Yog‘och turini tanlang (1 ta):</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {COFFIN_WOOD_OPTIONS.map((w) => {
                  const isCur = selectedWood?.id === w.id;
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setSelectedWood(w)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        isCur
                          ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500'
                          : 'border-stone-800 bg-stone-950 hover:border-stone-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-white">{w.nameUz}</div>
                      <div className="mt-3 text-[10px] font-mono text-amber-400">
                        {isCur ? '✓ Tanlangan' : 'Tanlash'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* QUESTION 3 */}
            <div className="space-y-4 pt-4 border-t border-stone-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {t('q.tobut.step3')}
                    </h3>
                    <p className="text-xs text-stone-400">Ishlov berish turini tanlang (Aynan 2 ta):</p>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-full bg-stone-950 border border-stone-800 text-xs font-mono">
                  <span className={selectedFinishes.length === 2 ? 'text-emerald-400' : 'text-amber-400'}>
                    {selectedFinishes.length} / 2 tanlandi
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {COFFIN_FINISH_OPTIONS.map((f) => {
                  const isSelected = selectedFinishes.includes(f.nameUz);
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => handleFinishToggle(f.nameUz)}
                      className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500'
                          : 'border-stone-800 bg-stone-950 hover:border-stone-700'
                      }`}
                    >
                      <span className="text-xs font-medium text-white">{f.nameUz}</span>
                      <span className="font-mono text-xs text-amber-400">
                        {isSelected ? '✓' : '+'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* QUESTION 4 */}
            <div className="space-y-4 pt-4 border-t border-stone-800">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  4
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {t('q.tobut.step4')}
                  </h3>
                  <p className="text-xs text-stone-400">Masjid, mahalla nomi yoki tezkor yetkazish talablari:</p>
                </div>
              </div>

              <div className="pt-2">
                <textarea
                  rows={3}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Masalan: Tezkor yetkazish, masjid uchun xayriya buyurtmasi, maxsus tutqichlar..."
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* QUESTION 5 */}
            <div className="space-y-4 pt-4 border-t border-stone-800">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  5
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {t('q.tobut.step5')}
                  </h3>
                  <p className="text-xs text-stone-400">Yetkazish manzilini kiriting:</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1.5">{t('form.country')} *</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1.5">{t('form.region')} *</label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-stone-400 mb-1.5">{t('form.address')} *</label>
                  <input
                    type="text"
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    required
                    placeholder="Shahar, tuman, mahalla yoki masjid manzili"
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* QUESTION 6 */}
            <div className="space-y-4 pt-4 border-t border-stone-800">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  6
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {t('q.tobut.step6')}
                  </h3>
                </div>
              </div>

              <div className="max-w-md pt-2">
                <PhoneInput
                  value={phoneNumber}
                  onChange={(phone, isValid, info) => {
                    setPhoneNumber(phone);
                    setIsPhoneValid(isValid);
                    setCountryInfo(info);
                  }}
                  required
                />
              </div>
            </div>

            {/* QUESTION 7 */}
            <div className="space-y-4 pt-4 border-t border-stone-800">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  7
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {t('q.tobut.step7')}
                  </h3>
                </div>
              </div>

              <div className="max-w-md pt-2">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  placeholder="To‘liq ismingiz"
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="p-6 rounded-2xl bg-stone-950 border border-amber-600/30 space-y-3">
              <h4 className="text-sm font-serif-luxury font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
                {t('form.summary')}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-stone-500 block">Tanlangan Namangan modeli:</span>
                  <span className="font-semibold text-white">{selectedModel?.nameUz}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Yog‘och:</span>
                  <span className="font-semibold text-white">{selectedWood?.nameUz}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Ishlov berish:</span>
                  <span className="font-semibold text-amber-400">{selectedFinishes.join(', ')}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Qo‘shimcha izoh:</span>
                  <span className="text-stone-300 italic">{additionalNotes || 'Standart an’anaviy'}</span>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-950/50 border border-red-800 rounded-xl flex items-center gap-2 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 disabled:opacity-50 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-xl hover:shadow-amber-600/20 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('form.sending')}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t('q.submit')}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
