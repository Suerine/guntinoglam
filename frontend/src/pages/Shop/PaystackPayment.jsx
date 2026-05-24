import { useEffect, useState } from 'react'

const PaystackPayment = ({ email, amount, onSuccess, onClose, metadata }) => {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if Paystack script is loaded
    if (typeof window !== 'undefined' && window.PaystackPop) {
      setIsReady(true)
    } else {
      setError('Paystack payment system is not available. Please refresh the page.')
    }
  }, [])

  const handlePayment = () => {
    if (!isReady || !window.PaystackPop) {
      setError('Paystack is not loaded. Please refresh and try again.')
      return
    }

    if (!email || !amount) {
      setError('Email and amount are required to process payment.')
      return
    }

    try {
      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email,
        amount: amount * 100, // Paystack uses kobo/cents — multiply by 100
        currency: 'KES',
        metadata,
        callback: (response) => {
          setError(null)
          onSuccess(response) // response.reference is the transaction reference
        },
        onClose: () => {
          onClose?.()
        },
      })
      handler.openIframe()
    } catch (err) {
      setError('Failed to initialize payment. Please try again.')
      console.error('Paystack error:', err)
    }
  }

  return (
    <>
      {error && (
        <div style={{
          padding: '0.75rem',
          marginBottom: '0.5rem',
          backgroundColor: '#fee',
          color: 'rgba(201, 38, 38, 1)',
          borderRadius: '4px',
          fontSize: '0.85rem',
          textAlign: 'center',
        }}>
          {error}
        </div>
      )}
      <button
        onClick={handlePayment}
        disabled={!isReady}
        style={{
          width: '100%',
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '0.6rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: '#fff',
          background: !isReady ? '#ccc' : '#0ba4db', // Paystack blue
          border: 'none',
          padding: '1rem',
          cursor: !isReady ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          transition: 'background 0.25s ease',
          opacity: !isReady ? 0.6 : 1,
        }}
        onMouseEnter={e => !isReady || (e.currentTarget.style.background = '#0990c3')}
        onMouseLeave={e => !isReady || (e.currentTarget.style.background = '#0ba4db')}
      >
        {!isReady ? 'Loading Paystack...' : `Pay KSh ${amount?.toLocaleString()} via Paystack`}
      </button>
    </>
  )
}

export default PaystackPayment