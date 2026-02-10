import { useState, useRef, useEffect } from 'react';
import { useCurrency } from '../../contexts/CurrencyContext';

interface CurrencySelectorProps {
  scrolled?: boolean;
  isHome?: boolean;
}

export default function CurrencySelector({ scrolled = false, isHome = false }: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { currency, setCurrency, availableCurrencies } = useCurrency();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCurrencyChange = (code: string) => {
    setCurrency(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-300 ${
          scrolled || !isHome
            ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm'
        }`}
      >
        <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{currency.code}</span>
        <i className={`ri-arrow-down-s-line text-sm sm:text-base transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 max-h-64 sm:max-h-80 overflow-y-auto">
            {availableCurrencies.map((curr) => (
              <button
                key={curr.code}
                onClick={() => handleCurrencyChange(curr.code)}
                className={`w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm hover:bg-amber-50 transition-colors ${
                  currency.code === curr.code ? 'bg-amber-50 text-amber-600 font-medium' : 'text-gray-700'
                }`}
              >
                <span className="font-medium">{curr.symbol}</span> {curr.code}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
