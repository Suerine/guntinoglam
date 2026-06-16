import { useContext, useState, useRef, useEffect } from "react"
import { CurrencyContext } from "../../context/CurrencyContext"
import { FiChevronDown } from "react-icons/fi"

export default function CurrencySwitcher() {
  const { currency, changeCurrency, currencies } = useContext(CurrencyContext)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const currentCurrency = currencies.find((c) => c.code === currency)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2  hover:border-gray-300 transition-colors text-xs font-normal"
      >
        <span>{currentCurrency?.code}</span>
        <FiChevronDown
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border border-gray-200 z-50">
          {currencies.map((c) => (
            <button
              key={c.code}
              onClick={() => {
                changeCurrency(c.code)
                setIsOpen(false)
              }}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                currency === c.code ? "bg-pink-50 text-pink-600 font-normal" : ""
              } first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0`}
            >
              <div className="font-normal text-xs">{c.code}</div>
              <div className="text-xs text-gray-500">{c.name}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
