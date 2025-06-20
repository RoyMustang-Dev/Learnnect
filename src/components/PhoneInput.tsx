import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
  maxLength: number;
  format?: string;
}

interface PhoneInputProps {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  placeholder = "Enter phone number",
  className = "",
  disabled = false,
  required = false,
  error
}) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Popular countries with phone validation data
  const phoneData: Record<string, { maxLength: number; format?: string }> = {
    'US': { maxLength: 10, format: '(XXX) XXX-XXXX' },
    'IN': { maxLength: 10, format: 'XXXXX XXXXX' },
    'GB': { maxLength: 10, format: 'XXXX XXX XXXX' },
    'CA': { maxLength: 10, format: '(XXX) XXX-XXXX' },
    'AU': { maxLength: 9, format: 'XXX XXX XXX' },
    'DE': { maxLength: 11, format: 'XXX XXXXXXXX' },
    'FR': { maxLength: 10, format: 'XX XX XX XX XX' },
    'JP': { maxLength: 11, format: 'XXX-XXXX-XXXX' },
    'CN': { maxLength: 11, format: 'XXX XXXX XXXX' },
    'BR': { maxLength: 11, format: '(XX) XXXXX-XXXX' },
    'MX': { maxLength: 10, format: 'XXX XXX XXXX' },
    'IT': { maxLength: 10, format: 'XXX XXX XXXX' },
    'ES': { maxLength: 9, format: 'XXX XXX XXX' },
    'RU': { maxLength: 10, format: 'XXX XXX-XX-XX' },
    'KR': { maxLength: 11, format: 'XXX-XXXX-XXXX' },
    'SG': { maxLength: 8, format: 'XXXX XXXX' },
    'AE': { maxLength: 9, format: 'XX XXX XXXX' },
    'SA': { maxLength: 9, format: 'XX XXX XXXX' },
    'ZA': { maxLength: 9, format: 'XXX XXX XXXX' },
    'NG': { maxLength: 10, format: 'XXX XXX XXXX' },
    'EG': { maxLength: 10, format: 'XXX XXX XXXX' },
    'AR': { maxLength: 10, format: 'XXX XXX XXXX' },
    'CL': { maxLength: 9, format: 'X XXXX XXXX' },
    'CO': { maxLength: 10, format: 'XXX XXX XXXX' },
    'PE': { maxLength: 9, format: 'XXX XXX XXX' },
    'TH': { maxLength: 9, format: 'XX XXX XXXX' },
    'VN': { maxLength: 9, format: 'XXX XXX XXX' },
    'ID': { maxLength: 11, format: 'XXX-XXXX-XXXX' },
    'MY': { maxLength: 10, format: 'XX-XXX XXXX' },
    'PH': { maxLength: 10, format: 'XXX XXX XXXX' },
    'BD': { maxLength: 10, format: 'XXXX-XXXXXX' },
    'PK': { maxLength: 10, format: 'XXX XXXXXXX' },
    'LK': { maxLength: 9, format: 'XX XXX XXXX' },
    'NP': { maxLength: 10, format: 'XXX-XXX-XXXX' },
    'MM': { maxLength: 9, format: 'XX XXX XXXX' },
    'KH': { maxLength: 9, format: 'XXX XXX XXX' },
    'LA': { maxLength: 10, format: 'XXX XX XXXXX' },
    'TR': { maxLength: 10, format: 'XXX XXX XX XX' },
    'IL': { maxLength: 9, format: 'XX-XXX-XXXX' },
    'JO': { maxLength: 9, format: 'X XXXX XXXX' },
    'LB': { maxLength: 8, format: 'XX XXX XXX' },
    'KW': { maxLength: 8, format: 'XXXX XXXX' },
    'QA': { maxLength: 8, format: 'XXXX XXXX' },
    'BH': { maxLength: 8, format: 'XXXX XXXX' },
    'OM': { maxLength: 8, format: 'XXXX XXXX' },
    'IR': { maxLength: 10, format: 'XXX XXX XXXX' },
    'IQ': { maxLength: 10, format: 'XXX XXX XXXX' },
    'AF': { maxLength: 9, format: 'XXX XXX XXX' },
    'UZ': { maxLength: 9, format: 'XX XXX XX XX' },
    'KZ': { maxLength: 10, format: 'XXX XXX XX XX' },
    'KG': { maxLength: 9, format: 'XXX XXX XXX' },
    'TJ': { maxLength: 9, format: 'XXX XX XX XX' },
    'TM': { maxLength: 8, format: 'XX XX XX XX' },
    'AZ': { maxLength: 9, format: 'XX XXX XX XX' },
    'GE': { maxLength: 9, format: 'XXX XXX XXX' },
    'AM': { maxLength: 8, format: 'XX XXX XXX' },
    'BY': { maxLength: 9, format: 'XX XXX-XX-XX' },
    'UA': { maxLength: 9, format: 'XX XXX XX XX' },
    'MD': { maxLength: 8, format: 'XXXX XXXX' },
    'RO': { maxLength: 9, format: 'XXX XXX XXX' },
    'BG': { maxLength: 9, format: 'XXX XXX XXX' },
    'RS': { maxLength: 9, format: 'XXX XXX XXX' },
    'HR': { maxLength: 9, format: 'XXX XXX XXX' },
    'SI': { maxLength: 8, format: 'XX XXX XXX' },
    'SK': { maxLength: 9, format: 'XXX XXX XXX' },
    'CZ': { maxLength: 9, format: 'XXX XXX XXX' },
    'HU': { maxLength: 9, format: 'XX XXX XXXX' },
    'PL': { maxLength: 9, format: 'XXX XXX XXX' },
    'LT': { maxLength: 8, format: 'XXX XXXXX' },
    'LV': { maxLength: 8, format: 'XXXX XXXX' },
    'EE': { maxLength: 8, format: 'XXXX XXXX' },
    'FI': { maxLength: 9, format: 'XXX XXX XXXX' },
    'SE': { maxLength: 9, format: 'XXX XXX XX XX' },
    'NO': { maxLength: 8, format: 'XXXX XXXX' },
    'DK': { maxLength: 8, format: 'XX XX XX XX' },
    'IS': { maxLength: 7, format: 'XXX XXXX' },
    'IE': { maxLength: 9, format: 'XXX XXX XXXX' },
    'NL': { maxLength: 9, format: 'X XXXX XXXX' },
    'BE': { maxLength: 9, format: 'XXX XX XX XX' },
    'LU': { maxLength: 9, format: 'XXX XXX XXX' },
    'CH': { maxLength: 9, format: 'XXX XXX XX XX' },
    'AT': { maxLength: 11, format: 'XXX XXXXXXXX' },
    'PT': { maxLength: 9, format: 'XXX XXX XXX' },
    'GR': { maxLength: 10, format: 'XXX XXX XXXX' },
    'CY': { maxLength: 8, format: 'XXXX XXXX' },
    'MT': { maxLength: 8, format: 'XXXX XXXX' },
    'AL': { maxLength: 9, format: 'XXX XXX XXX' },
    'MK': { maxLength: 8, format: 'XX XXX XXX' },
    'ME': { maxLength: 8, format: 'XX XXX XXX' },
    'BA': { maxLength: 8, format: 'XX-XXX-XXX' },
    'XK': { maxLength: 8, format: 'XXX XXX XXX' },
    'MZ': { maxLength: 9, format: 'XX XXX XXXX' },
    'ZW': { maxLength: 9, format: 'XXX XXX XXX' },
    'ZM': { maxLength: 9, format: 'XXX XXX XXX' },
    'UG': { maxLength: 9, format: 'XXX XXX XXX' },
    'TZ': { maxLength: 9, format: 'XXX XXX XXX' },
    'RW': { maxLength: 9, format: 'XXX XXX XXX' },
    'KE': { maxLength: 9, format: 'XXX XXX XXX' },
    'ET': { maxLength: 9, format: 'XXX XXX XXX' },
    'GH': { maxLength: 9, format: 'XXX XXX XXX' },
    'CI': { maxLength: 8, format: 'XX XX XX XX' },
    'SN': { maxLength: 9, format: 'XX XXX XX XX' },
    'ML': { maxLength: 8, format: 'XXXX XXXX' },
    'BF': { maxLength: 8, format: 'XXXX XXXX' },
    'NE': { maxLength: 8, format: 'XX XX XX XX' },
    'TD': { maxLength: 8, format: 'XX XX XX XX' },
    'CM': { maxLength: 9, format: 'X XXXX XXXX' },
    'CF': { maxLength: 8, format: 'XX XX XX XX' },
    'CG': { maxLength: 9, format: 'XXX XXX XXX' },
    'CD': { maxLength: 9, format: 'XXX XXX XXX' },
    'AO': { maxLength: 9, format: 'XXX XXX XXX' },
    'NA': { maxLength: 9, format: 'XXX XXX XXX' },
    'BW': { maxLength: 8, format: 'XXXX XXXX' },
    'LS': { maxLength: 8, format: 'XXXX XXXX' },
    'SZ': { maxLength: 8, format: 'XXXX XXXX' },
    'MG': { maxLength: 9, format: 'XXX XX XXX XX' },
    'MU': { maxLength: 8, format: 'XXXX XXXX' },
    'SC': { maxLength: 7, format: 'X XXX XXX' },
    'MV': { maxLength: 7, format: 'XXX-XXXX' },
    'FJ': { maxLength: 7, format: 'XXX XXXX' },
    'PG': { maxLength: 8, format: 'XXXX XXXX' },
    'SB': { maxLength: 7, format: 'XXX XXXX' },
    'VU': { maxLength: 7, format: 'XXX XXXX' },
    'NC': { maxLength: 6, format: 'XX.XX.XX' },
    'PF': { maxLength: 8, format: 'XX XX XX XX' },
    'WS': { maxLength: 7, format: 'XXX XXXX' },
    'TO': { maxLength: 7, format: 'XXX XXXX' },
    'TV': { maxLength: 7, format: 'XXX XXXX' },
    'NR': { maxLength: 7, format: 'XXX XXXX' },
    'KI': { maxLength: 8, format: 'XXXX XXXX' },
    'MH': { maxLength: 7, format: 'XXX-XXXX' },
    'FM': { maxLength: 7, format: 'XXX-XXXX' },
    'PW': { maxLength: 7, format: 'XXX-XXXX' }
  };

  // Fetch countries data
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd,flag');
        const data = await response.json();
        
        const formattedCountries: Country[] = data
          .filter((country: any) => country.idd?.root && country.idd?.suffixes?.length > 0)
          .map((country: any) => {
            const code = country.cca2;
            const dialCode = country.idd.root + (country.idd.suffixes[0] || '');
            const phoneInfo = phoneData[code] || { maxLength: 10 };
            
            return {
              name: country.name.common,
              code,
              dialCode,
              flag: country.flag,
              maxLength: phoneInfo.maxLength,
              format: phoneInfo.format
            };
          })
          .sort((a: Country, b: Country) => a.name.localeCompare(b.name));

        setCountries(formattedCountries);
        
        // Set default country (India)
        const defaultCountry = formattedCountries.find(c => c.code === 'IN') || formattedCountries[0];
        setSelectedCountry(defaultCountry);
        
      } catch (error) {
        console.error('Error fetching countries:', error);
        // Fallback data
        const fallbackCountries: Country[] = [
          { name: 'India', code: 'IN', dialCode: '+91', flag: '🇮🇳', maxLength: 10, format: 'XXXXX XXXXX' },
          { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸', maxLength: 10, format: '(XXX) XXX-XXXX' },
          { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧', maxLength: 10, format: 'XXXX XXX XXXX' },
          { name: 'Canada', code: 'CA', dialCode: '+1', flag: '🇨🇦', maxLength: 10, format: '(XXX) XXX-XXXX' },
          { name: 'Australia', code: 'AU', dialCode: '+61', flag: '🇦🇺', maxLength: 9, format: 'XXX XXX XXX' }
        ];
        setCountries(fallbackCountries);
        setSelectedCountry(fallbackCountries[0]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Parse initial value
  useEffect(() => {
    if (value && countries.length > 0) {
      // Try to extract country code and phone number from value
      const match = value.match(/^(\+\d{1,4})\s*(.*)$/);
      if (match) {
        const [, dialCode, number] = match;
        const country = countries.find(c => c.dialCode === dialCode);
        if (country) {
          setSelectedCountry(country);
          setPhoneNumber(number.replace(/\D/g, ''));
        }
      } else {
        setPhoneNumber(value.replace(/\D/g, ''));
      }
    }
  }, [value, countries]);

  // Validate Indian phone numbers
  const validateIndianPhoneNumber = (digits: string): boolean => {
    if (digits.length !== 10) return false;

    // Indian mobile numbers must start with 9, 8, 7, or 6
    const firstDigit = digits.charAt(0);
    return ['9', '8', '7', '6'].includes(firstDigit);
  };

  // Handle phone number change
  const handlePhoneChange = (inputValue: string) => {
    if (!selectedCountry) return;

    // Remove all non-digits
    const digits = inputValue.replace(/\D/g, '');

    // Limit to max length for selected country
    const limitedDigits = digits.slice(0, selectedCountry.maxLength);

    setPhoneNumber(limitedDigits);

    // Validate phone number
    let isValid = limitedDigits.length === selectedCountry.maxLength;

    // Additional validation for Indian numbers
    if (selectedCountry.code === 'IN' && limitedDigits.length === 10) {
      isValid = validateIndianPhoneNumber(limitedDigits);
    }

    const fullNumber = selectedCountry.dialCode + ' ' + limitedDigits;
    onChange(fullNumber, isValid);
  };

  // Handle country selection
  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    setSearchTerm('');
    
    // Update phone number with new country code
    const fullNumber = country.dialCode + ' ' + phoneNumber;
    const isValid = phoneNumber.length === country.maxLength;
    onChange(fullNumber, isValid);
  };

  // Filter countries based on search
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.dialCode.includes(searchTerm)
  );

  // Format phone number for display
  const formatPhoneNumber = (number: string, format?: string) => {
    if (!format || !number) return number;
    
    let formatted = format;
    let digitIndex = 0;
    
    for (let i = 0; i < formatted.length && digitIndex < number.length; i++) {
      if (formatted[i] === 'X') {
        formatted = formatted.substring(0, i) + number[digitIndex] + formatted.substring(i + 1);
        digitIndex++;
      }
    }
    
    // Remove remaining X's
    return formatted.replace(/X/g, '');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className={`flex ${className}`}>
        <div className="w-full px-4 py-3 sm:py-4 bg-white/5 border border-white/20 rounded-xl text-white flex items-center justify-center backdrop-blur-sm">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-neon-cyan"></div>
          <span className="ml-2 text-sm">Loading countries...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex space-x-2 ${className}`}>
      {/* Country Code Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          disabled={disabled}
          className={`flex items-center px-3 py-3 sm:py-4 bg-white/5 border rounded-xl text-white transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed min-w-[110px] focus:outline-none focus:ring-2 ${
            error
              ? 'border-red-400 focus:ring-red-400 focus:border-red-400 hover:border-red-400'
              : 'border-white/20 focus:ring-neon-cyan focus:border-neon-cyan hover:border-neon-cyan'
          }`}
        >
          {selectedCountry ? (
            <>
              <span className="text-lg mr-2">{selectedCountry.flag}</span>
              <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
            </>
          ) : (
            <span className="text-gray-400 text-sm">Select</span>
          )}
          <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-80 bg-gradient-to-br from-gray-900/95 to-gray-800/95 border border-white/20 rounded-xl shadow-2xl backdrop-blur-sm z-50 max-h-64 overflow-hidden">

            {/* Search Input */}
            <div className="p-3 border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search countries..."
                  className="w-full pl-10 pr-8 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-cyan-300/50 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 transition-all text-sm focus:outline-none"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-cyan-400 hover:text-neon-cyan"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Countries List */}
            <div className="max-h-48 overflow-y-auto">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => handleCountrySelect(country)}
                    className="w-full flex items-center px-4 py-3 text-left hover:bg-white/5 transition-colors text-white"
                  >
                    <span className="text-lg mr-3">{country.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{country.name}</div>
                      <div className="text-xs text-gray-400">{country.dialCode}</div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-400 text-sm text-center">
                  No countries found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Phone Number Input */}
      <div className="flex-1">
        <input
          type="tel"
          value={selectedCountry?.format ? formatPhoneNumber(phoneNumber, selectedCountry.format) : phoneNumber}
          onChange={(e) => handlePhoneChange(e.target.value)}
          placeholder={selectedCountry ? `${selectedCountry.maxLength} digits` : placeholder}
          disabled={disabled}
          required={required}
          className={`w-full px-4 py-3 sm:py-4 bg-white/5 border rounded-xl text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed ${
            error
              ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
              : 'border-white/20 focus:ring-neon-cyan focus:border-neon-cyan'
          }`}
        />
        {/* Error Message */}
        {error && (
          <p className="mt-1 text-xs text-red-400">
            {error}
          </p>
        )}

        {/* Validation Feedback */}
        {!error && selectedCountry && phoneNumber && (
          <div className="mt-1 text-xs">
            <div className="text-cyan-300/60">
              {phoneNumber.length}/{selectedCountry.maxLength} digits
            </div>
            {selectedCountry.code === 'IN' && phoneNumber.length === 10 && !validateIndianPhoneNumber(phoneNumber) && (
              <div className="text-red-400 mt-1">
                Indian mobile numbers must start with 9, 8, 7, or 6
              </div>
            )}
            {phoneNumber.length === selectedCountry.maxLength &&
             (selectedCountry.code !== 'IN' || validateIndianPhoneNumber(phoneNumber)) && (
              <div className="text-green-400 mt-1">
                ✓ Valid phone number
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneInput;
