import { createContext, useState, useEffect } from "react"

export const CurrencyContext = createContext()

const CURRENCIES = {
  KSH: { code: "KSH", symbol: "Ksh", name: "Kenyan Shilling" },
  USD: { code: "USD", symbol: "$", name: "US Dollar" },
  EUR: { code: "EUR", symbol: "€", name: "Euro" },
}

// Exchange rates relative to KSH
const EXCHANGE_RATES = {
  KSH: 1,
  USD: 0.0078, // 1 KSH = ~0.0078 USD
  EUR: 0.0074, // 1 KSH = ~0.0074 EUR
}

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem("selectedCurrency") || "KSH"
  })

  useEffect(() => {
    localStorage.setItem("selectedCurrency", currency)
  }, [currency])

  const convertPrice = (priceInKsh, targetCurrency = currency) => {
    if (!priceInKsh) return 0
    return (priceInKsh * EXCHANGE_RATES[targetCurrency]).toFixed(2)
  }

  const formatPrice = (priceInKsh, targetCurrency = currency) => {
    const convertedPrice = convertPrice(priceInKsh, targetCurrency)
    const symbol = CURRENCIES[targetCurrency].symbol
    
    if (targetCurrency === "KSH") {
      return `${symbol} ${parseInt(convertedPrice).toLocaleString()}`
    }
    return `${symbol} ${parseFloat(convertedPrice).toFixed(2)}`
  }

  const changeCurrency = (newCurrency) => {
    if (CURRENCIES[newCurrency]) {
      setCurrency(newCurrency)
    }
  }

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        changeCurrency,
        convertPrice,
        formatPrice,
        currencies: Object.values(CURRENCIES),
        EXCHANGE_RATES,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}
