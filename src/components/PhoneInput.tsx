import React, { useState, useMemo, useEffect, useRef } from 'react';
import { parsePhoneNumberFromString, AsYouType, CountryCode } from 'libphonenumber-js';
import { COUNTRIES } from '../data/countries';
import { CountryInfo } from '../types';
import { Search, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react';

interface PhoneInputProps {
  value: string;
  onChange: (phone: string, isValid: boolean, country: CountryInfo) => void;
  required?: boolean;
  label?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  required = true,
  label = 'Telefon raqamingiz',
}) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo>(COUNTRIES[0]); // Uzbekistan default
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [localNumber, setLocalNumber] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter countries by name or dial code
  const filteredCountries = useMemo(() => {
    if (!search.trim()) return COUNTRIES;
    const q = search.toLowerCase();
    return COUNTRIES.filter(
      c => c.name.toLowerCase().includes(q) || c.dialCode.includes(q) || c.iso2.toLowerCase().includes(q)
    );
  }, [search]);

  // Handle number changes
  const handleNumberChange = (rawInput: string) => {
    const cleaned = rawInput.replace(/[^\d]/g, '');
    const asYouType = new AsYouType(selectedCountry.iso2 as CountryCode);
    const formatted = asYouType.input(cleaned);
    setLocalNumber(formatted);

    const fullPhone = `${selectedCountry.dialCode} ${formatted}`.trim();
    const parsed = parsePhoneNumberFromString(fullPhone, selectedCountry.iso2 as CountryCode);
    const isValid = parsed ? parsed.isValid() : false;

    onChange(fullPhone, isValid, selectedCountry);
  };

  const handleCountrySelect = (country: CountryInfo) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearch('');

    const fullPhone = `${country.dialCode} ${localNumber}`.trim();
    const parsed = parsePhoneNumberFromString(fullPhone, country.iso2 as CountryCode);
    const isValid = parsed ? parsed.isValid() : false;

    onChange(fullPhone, isValid, country);
  };

  // Compute validation
  const fullPhone = `${selectedCountry.dialCode} ${localNumber}`.trim();
  const parsed = parsePhoneNumberFromString(fullPhone, selectedCountry.iso2 as CountryCode);
  const isValid = parsed ? parsed.isValid() : false;
  const showFeedback = localNumber.length > 3;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
          {label} {required && <span className="text-amber-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center" ref={dropdownRef}>
        {/* Country Selector Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2.5 bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-l-lg hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors shrink-0 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
        >
          <span className="text-xl leading-none">{selectedCountry.flag}</span>
          <span className="font-mono text-xs font-medium text-stone-700 dark:text-stone-300">
            {selectedCountry.dialCode}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
        </button>

        {/* Input Field */}
        <div className="relative flex-1">
          <input
            type="tel"
            value={localNumber}
            onChange={(e) => handleNumberChange(e.target.value)}
            placeholder="90 123 45 67"
            required={required}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-stone-950 border border-l-0 border-stone-300 dark:border-stone-800 rounded-r-lg text-stone-900 dark:text-stone-100 text-sm font-mono placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
          />

          {showFeedback && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {isValid ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-500" />
              )}
            </div>
          )}
        </div>

        {/* Searchable Dropdown Modal/List */}
        {isOpen && (
          <div className="absolute top-full left-0 z-50 mt-1.5 w-72 max-h-72 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg shadow-xl overflow-hidden flex flex-col">
            <div className="p-2 border-b border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Davlat qidirish..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-500"
                  autoFocus
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-stone-100 dark:divide-stone-800/50">
              {filteredCountries.map((country) => (
                <button
                  key={`${country.iso2}-${country.dialCode}`}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors ${
                    selectedCountry.iso2 === country.iso2 ? 'bg-amber-500/10 text-amber-500 font-semibold' : 'text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-lg leading-none">{country.flag}</span>
                    <span className="truncate">{country.name}</span>
                  </div>
                  <span className="font-mono text-[11px] text-stone-400 shrink-0 ml-2">
                    {country.dialCode}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {showFeedback && (
        <p className={`mt-1.5 text-[11px] ${isValid ? 'text-emerald-500' : 'text-amber-500'}`}>
          {isValid ? 'Xalqaro format to‘g‘ri kiritildi' : 'Raqamni to‘liq kiriting'}
        </p>
      )}
    </div>
  );
};
