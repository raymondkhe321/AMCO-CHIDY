import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Currency {
  code: string;
  symbol: string;
  rate: number;
  locale: string;
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (code: string) => void;
  formatPrice: (priceUSD: number) => string;
  availableCurrencies: Currency[];
}

const currencies: Record<string, Currency> = {
  USD: { code: 'USD', symbol: '$', rate: 1, locale: 'en-US' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79, locale: 'en-GB' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, locale: 'de-DE' },
  NGN: { code: 'NGN', symbol: '₦', rate: 1580, locale: 'en-NG' },
  CAD: { code: 'CAD', symbol: 'C$', rate: 1.36, locale: 'en-CA' },
  AUD: { code: 'AUD', symbol: 'A$', rate: 1.53, locale: 'en-AU' },
  INR: { code: 'INR', symbol: '₹', rate: 83.12, locale: 'en-IN' },
  ZAR: { code: 'ZAR', symbol: 'R', rate: 18.45, locale: 'en-ZA' },
  AED: { code: 'AED', symbol: 'د.إ', rate: 3.67, locale: 'ar-AE' },
  JPY: { code: 'JPY', symbol: '¥', rate: 149.50, locale: 'ja-JP' },
  CNY: { code: 'CNY', symbol: '¥', rate: 7.24, locale: 'zh-CN' },
};

const countryToCurrency: Record<string, string> = {
  US: 'USD',
  GB: 'GBP',
  DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR', BE: 'EUR', AT: 'EUR', PT: 'EUR', IE: 'EUR', GR: 'EUR', FI: 'EUR',
  NG: 'NGN',
  CA: 'CAD',
  AU: 'AUD',
  IN: 'INR',
  ZA: 'ZAR',
  AE: 'AED',
  JP: 'JPY',
  CN: 'CNY',
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

async function detectUserCountry(): Promise<string> {
  try {
    // Try browser locale first
    const browserLocale = navigator.language;
    const countryCode = browserLocale.split('-')[1]?.toUpperCase();
    
    if (countryCode && countryToCurrency[countryCode]) {
      return countryToCurrency[countryCode];
    }

    // Fallback: Try IP-based geolocation with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch('https://ipapi.co/json/', { 
      signal: controller.signal 
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      const detectedCountry = data.country_code;
      
      if (detectedCountry && countryToCurrency[detectedCountry]) {
        return countryToCurrency[detectedCountry];
      }
    }
  } catch (error) {
    console.log('Currency detection fallback to USD');
  }

  return 'USD';
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(currencies.USD);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeCurrency = async () => {
      try {
        // Check if user has a saved preference
        const savedCurrency = localStorage.getItem('amco_currency');
        
        if (savedCurrency && currencies[savedCurrency]) {
          setCurrencyState(currencies[savedCurrency]);
          setIsInitialized(true);
          return;
        }

        // Auto-detect currency
        const detectedCode = await detectUserCountry();
        setCurrencyState(currencies[detectedCode]);
        setIsInitialized(true);
      } catch (error) {
        console.error('Currency initialization error:', error);
        setCurrencyState(currencies.USD);
        setIsInitialized(true);
      }
    };

    initializeCurrency();
  }, []);

  const setCurrency = (code: string) => {
    if (currencies[code]) {
      setCurrencyState(currencies[code]);
      try {
        localStorage.setItem('amco_currency', code);
      } catch (error) {
        console.error('Failed to save currency preference:', error);
      }
    }
  };

  const formatPrice = (priceUSD: number): string => {
    const convertedPrice = priceUSD * currency.rate;
    
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: currency.code === 'JPY' ? 0 : 2,
      maximumFractionDigits: currency.code === 'JPY' ? 0 : 2,
    }).format(convertedPrice);
  };

  const availableCurrencies = Object.values(currencies);

  if (!isInitialized) {
    return null;
  }

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      formatPrice,
      availableCurrencies
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
