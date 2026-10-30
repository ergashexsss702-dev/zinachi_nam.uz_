import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { STAIRCASE_DESIGNS, WOOD_MATERIALS, COLOR_FINISHES } from '../data/staircases';
import { StaircaseDesign, WoodMaterial, ColorFinish, CustomerOrder, CountryInfo } from '../types';
import { PhoneInput } from '../components/PhoneInput';
import { submitOrderToServer } from '../lib/telegram';
import { saveLocalOrder } from '../lib/supabase';
import { Check, CheckCircle2, AlertCircle, ArrowDown, MapPin, Send, Loader2 } from 'lucide-react';

interface ZinaViewProps {
  onOrderSuccess: (order: CustomerOrder) => void;
}

export const ZinaView: React.FC<ZinaViewProps> = ({ onOrderSuccess }) => {
  const { t } = useLanguage();

  // Selection states
  const [selectedDesign, setSelectedDesign] = useState<StaircaseDesign>(STAIRCASE_DESIGNS[0]);
  const [selectedWood, setSelectedWood] = useState<WoodMaterial>(WOOD_MATERIALS[0]);
  const [selectedColors, setSelectedColors] = useState<ColorFinish[]>([
    COLOR_FINISHES[0], // Natural Walnut
    COLOR_FINISHES[1], // Dark Walnut
  ]);

  // Address fields
  const [country, setCountry] = useState('O‘zbekiston');
  const [region, setRegion] = useState('Namangan viloyati');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [measurements, setMeasurements] = useState('');

  // Contact fields
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [countryInfo, setCountryInfo] = useState<CountryInfo>({
    name: 'O‘zbekiston',
    iso2: 'UZ',
    dialCode: '+998',
    flag: '🇺🇿',
  });

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle color selection (strictly exact 2)
  const handleColorToggle = (color: ColorFinish) => {
    const isSelected = selectedColors.some(c => c.id === color.id);
    if (isSelected) {
      if (selectedColors.length > 1) {
        setSelectedColors(selectedColors.filter(c => c.id !== color.id));
      }
    } else {
      if (selectedColors.length >= 2) {
        // Replace oldest or keep max 2
        setSelectedColors([selectedColors[1], color]);
      } else {
        setSelectedColors([...selectedColors, color]);
      }
    }
  };

  const handleSelectDesignAndScroll = (design: StaircaseDesign) => {
    setSelectedDesign(design);
    const formElement = document.getElementById('zina-questionnaire-root');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedDesign) {
      setErrorMessage('Iltimos, zina modelini tanlang.');
      return;
    }
    if (!selectedWood) {
      setErrorMessage('Iltimos, daraxt turini tanlang.');
      return;
    }
    if (selectedColors.length !== 2) {
      setErrorMessage('Iltimos, aynan 2 ta rang va dizaynni tanlang.');
      return;
    }
    if (!customerName.trim()) {
      setErrorMessage('Iltimos, to‘liq ismingizni kiriting.');
      return;
    }
    if (!phoneNumber || !isPhoneValid) {
      setErrorMessage('Iltimos, to‘g‘ri xalqaro telefon raqamini kiriting.');
      return;
    }
    if (!fullAddress.trim()) {
      setErrorMessage('Iltimos, manzilingizni to‘liq kiriting.');
      return;
    }

    setIsSubmitting(true);

    const orderId = `ZIN-${Date.now().toString().slice(-7)}`;
    const newOrder: CustomerOrder = {
      id: orderId,
      category: 'zina',
      productTitle: selectedDesign.nameUz,
      productDesignId: selectedDesign.id,
      woodMaterial: selectedWood.nameUz,
      selectedColors: selectedColors.map(c => c.nameUz),
      customerName: customerName.trim(),
      phoneNumber: phoneNumber.trim(),
      country: country,
      countryCode: countryInfo.iso2,
      region: region,
      city: city,
      district: district,
      fullAddress: fullAddress.trim(),
      measurements: measurements.trim() || 'O‘lchov ustalari joyida aniqlaydi',
      quantity: 1,
      status: 'yangi',
      createdAt: new Date().toISOString(),
      telegramDelivered: false,
    };

    try {
      // Send to server API with Telegram forwarding
      const result = await submitOrderToServer(newOrder);
      const finalOrder = { ...newOrder, telegramDelivered: result.telegramDelivered };
      // Save locally as backup
      saveLocalOrder(finalOrder);
      onOrderSuccess(finalOrder);
    } catch (err: any) {
      console.error('Order submission failed:', err);
      // Fallback local save
      saveLocalOrder(newOrder);
      onOrderSuccess(newOrder);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 pb-24">
      {/* Page Header */}
      <section className="text-center max-w-3xl mx-auto px-4 pt-6">
        <span className="text-xs font-mono font-bold tracking-widest text-amber-500 uppercase">
          Eksklyuziv Duradgorlik
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif-luxury font-black text-white mt-2">
          Zinalar Katalogi va Buyurtma
        </h1>
        <p className="text-stone-300 text-sm sm:text-base mt-3 leading-relaxed">
          12 xil hashamatli me’moriy zina modellari. O‘zingizga yoqqan dizaynni tanlab, quyidagi 6 ta savol orqali to‘liq buyurtma bering.
        </p>
      </section>

      {/* 12 Staircase Designs Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-stone-800">
          <div>
            <h2 className="text-2xl font-serif-luxury font-bold text-white">
              12 Ta Model Katalogi
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Har bir kartada fotosurat, tavsif va tanlash tugmasi mavjud
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400">12 ta model mavjud</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {STAIRCASE_DESIGNS.map((staircase) => {
            const isSelected = selectedDesign?.id === staircase.id;
            return (
              <div
                key={staircase.id}
                className={`group rounded-2xl overflow-hidden bg-stone-900 border transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-500 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500'
                    : 'border-stone-800 hover:border-stone-700'
                }`}
              >
                <div>
                  <div className="aspect-[4/3] overflow-hidden bg-stone-950 relative">
                    <img
                      src={staircase.image}
                      alt={staircase.nameUz}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {staircase.badge && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-md text-[11px] font-mono font-semibold text-amber-400 border border-amber-500/20">
                        {staircase.badge}
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 bg-amber-600 rounded-md text-white font-mono text-[11px] font-bold flex items-center gap-1 shadow-md">
                        <Check className="w-3.5 h-3.5" />
                        <span>Tanlangan</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-serif-luxury font-bold text-white group-hover:text-amber-400 transition-colors">
                      {staircase.nameUz}
                    </h3>
                    <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                      {staircase.descriptionUz}
                    </p>

                    {/* Features tags */}
                    <div className="mt-4 flex flex-wrap gap-1.5 text-[11px] text-stone-300">
                      {staircase.featuresUz.map((feat, idx) => (
                        <span key={idx} className="text-stone-400">
                          {feat}{idx < staircase.featuresUz.length - 1 ? ' · ' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    type="button"
                    onClick={() => handleSelectDesignAndScroll(staircase)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-amber-600 text-white'
                        : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Tanlandi (Anketaga o‘tish)</span>
                      </>
                    ) : (
                      <span>Ushbu zinani tanlash</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Staircase Order Questionnaire */}
      <section
        id="zina-questionnaire-root"
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8"
      >
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="text-center max-w-xl mx-auto mb-10 pb-6 border-b border-stone-800">
            <span className="text-xs font-mono font-bold tracking-widest text-amber-500 uppercase">
              Bosqichma-bosqich
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white mt-1">
              {t('q.zina.title')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-2">
              Barcha 6 ta savolga javob berib, buyurtmangizni to‘g‘ridan-to‘g‘ri ustaxonaga yuboring
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
                    {t('q.zina.step1')}
                  </h3>
                  <p className="text-xs text-stone-400">{t('q.zina.step1_hint')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
                {STAIRCASE_DESIGNS.map((d) => {
                  const isCur = selectedDesign?.id === d.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setSelectedDesign(d)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isCur
                          ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500 text-white'
                          : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-stone-900 mb-2">
                        <img
                          src={d.image}
                          alt={d.nameUz}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="text-[11px] font-semibold line-clamp-2">{d.nameUz}</span>
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
                    {t('q.zina.step2')}
                  </h3>
                  <p className="text-xs text-stone-400">{t('q.zina.step2_hint')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {WOOD_MATERIALS.map((wood) => {
                  const isCur = selectedWood?.id === wood.id;
                  return (
                    <button
                      key={wood.id}
                      type="button"
                      onClick={() => setSelectedWood(wood)}
                      className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                        isCur
                          ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500'
                          : 'border-stone-800 bg-stone-950 hover:border-stone-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-xs font-bold text-amber-400">
                            {wood.code} VARIANTI
                          </span>
                          <span
                            className="w-4 h-4 rounded-full border border-stone-600 shrink-0"
                            style={{ backgroundColor: wood.colorSample }}
                          />
                        </div>
                        <h4 className="text-sm font-bold text-white">{wood.nameUz}</h4>
                        <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                          {wood.descriptionUz}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px]">
                        <span className={isCur ? 'text-amber-400 font-semibold' : 'text-stone-500'}>
                          {isCur ? '✓ Tanlangan' : 'Tanlash'}
                        </span>
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
                      {t('q.zina.step3')}
                    </h3>
                    <p className="text-xs text-stone-400">{t('q.zina.step3_hint')}</p>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-full bg-stone-950 border border-stone-800 text-xs font-mono">
                  <span className={selectedColors.length === 2 ? 'text-emerald-400' : 'text-amber-400'}>
                    {selectedColors.length} / 2 tanlandi
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                {COLOR_FINISHES.map((color) => {
                  const isSelected = selectedColors.some(c => c.id === color.id);
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => handleColorToggle(color)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500'
                          : 'border-stone-800 bg-stone-950 hover:border-stone-700'
                      }`}
                    >
                      <span
                        className="w-6 h-6 rounded-lg border border-stone-700 shrink-0 shadow-inner"
                        style={{ backgroundColor: color.colorHex }}
                      />
                      <div className="truncate">
                        <div className="text-xs font-semibold text-white truncate">{color.nameUz}</div>
                        <div className="text-[10px] text-stone-400 truncate">{color.woodTexture}</div>
                      </div>
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
                    {t('q.zina.step4')}
                  </h3>
                  <p className="text-xs text-stone-400">O‘lchov va yetkazib berish manzilini to‘liq kiriting:</p>
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
                    placeholder="Masalan: Namangan viloyati"
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1.5">{t('form.city')} *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    placeholder="Shahar nomi"
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1.5">{t('form.district')} *</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    required
                    placeholder="Tuman nomi"
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
                    placeholder="Ko‘cha, mahalla, uy raqami"
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-stone-400 mb-1.5">
                    Taxminiy zina o‘lchamlari yoki qavat balandligi (ixtiyoriy)
                  </label>
                  <input
                    type="text"
                    value={measurements}
                    onChange={(e) => setMeasurements(e.target.value)}
                    placeholder="Masalan: Balandlik 3.2 metr, 17 ta pog‘ona"
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
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
                    {t('q.zina.step5')}
                  </h3>
                  <p className="text-xs text-stone-400">Xalqaro formatdagi telefon raqamingiz:</p>
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

            {/* QUESTION 6 */}
            <div className="space-y-4 pt-4 border-t border-stone-800">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  6
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {t('q.zina.step6')}
                  </h3>
                  <p className="text-xs text-stone-400">To‘liq ism va familiyangizni kiriting:</p>
                </div>
              </div>

              <div className="max-w-md pt-2">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  placeholder="Masalan: Jamshid Ergashev"
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Complete Order Summary Box */}
            <div className="p-6 rounded-2xl bg-stone-950 border border-amber-600/30 space-y-4">
              <h4 className="text-sm font-serif-luxury font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
                {t('form.summary')}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-stone-500 block">Tanlangan zina modeli:</span>
                  <span className="font-semibold text-white">{selectedDesign?.nameUz}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Daraxt turi:</span>
                  <span className="font-semibold text-white">{selectedWood?.nameUz}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Tanlangan rang va dizayn:</span>
                  <span className="font-semibold text-amber-400">
                    {selectedColors.map(c => c.nameUz).join(', ')}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block">Yetkazish manzili:</span>
                  <span className="font-semibold text-white truncate block">
                    {[region, city, district, fullAddress].filter(Boolean).join(', ') || 'Kiritilmoqda...'}
                  </span>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-950/50 border border-red-800 rounded-xl flex items-center gap-2 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
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
