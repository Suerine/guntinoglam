import React from "react"
import {
  FiTruck,
  FiRefreshCw,
  FiPackage,
  FiClock,
  FiShield,
} from "react-icons/fi"

const ShippingReturns = () => {
  return (
    <div className="min-h-screen bg-[#FFF7FF] pt-36 pb-20 px-4 sm:px-6 lg:px-10">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto text-center mb-16">
        <p className="text-pink-500 uppercase tracking-[0.35em] text-xs font-medium mb-4">
          Shipping & Returns
        </p>

        <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl text-black mb-6">
          Shipping & Return Policy
        </h1>

        <p className="max-w-2xl mx-auto text-gray-600 text-sm sm:text-base leading-relaxed">
          We are committed to making your shopping experience smooth,
          transparent, and worry-free from checkout to delivery. For more information, please contact our customer support team on <a href="mailto:artbynajmaa@gmail.com?subject=Order%20Inquiry" className="text-pink-500 underline">artbynajmaa@gmail.com</a> or call us at <a href="tel:+254793904535" className="text-pink-500 underline">+254 793 904 535</a>.
        </p>
      </div>

      {/* Top Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        <div className="bg-white  p-6 border border-gray-100 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-pink-100 text-pink-500 flex items-center justify-center mb-5">
            <FiTruck className="w-6 h-6" />
          </div>

          <h2 className="text-lg font-semibold text-black mb-2">
            Fast Delivery
          </h2>

          <p className="text-gray-600 text-sm leading-relaxed">
            Nationwide shipping available with reliable delivery partners.
          </p>
        </div>

        <div className="bg-white  p-6 border border-gray-100 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-pink-100 text-pink-500 flex items-center justify-center mb-5">
            <FiRefreshCw className="w-6 h-6" />
          </div>

          <h2 className="text-lg font-semibold text-black mb-2">
            Easy Returns
          </h2>

          <p className="text-gray-600 text-sm leading-relaxed">
            Hassle-free exchanges and returns according to our policy.
          </p>
        </div>

        <div className="bg-white p-6 border border-gray-100 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-pink-100 text-pink-500 flex items-center justify-center mb-5">
            <FiClock className="w-6 h-6" />
          </div>

          <h2 className="text-lg font-semibold text-black mb-2">
            Quick Processing
          </h2>

          <p className="text-gray-600 text-sm leading-relaxed">
            Orders are processed within 1–2 business days after confirmation.
          </p>
        </div>

        <div className="bg-white  p-6 border border-gray-100 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-pink-100 text-pink-500 flex items-center justify-center mb-5">
            <FiShield className="w-6 h-6" />
          </div>

          <h2 className="text-lg font-semibold text-black mb-2">
            Secure Shopping
          </h2>

          <p className="text-gray-600 text-sm leading-relaxed">
            We prioritize secure transactions and customer satisfaction.
          </p>
        </div>
      </div>

      {/* Detailed Policy Section */}
      <div className="max-w-5xl mx-auto bg-white border border-gray-100 shadow-sm p-8 sm:p-12">
        <div className="flex items-center gap-3 mb-8">
          <FiPackage className="text-pink-500 w-7 h-7" />
          <h2 className="font-playfair text-3xl sm:text-4xl text-black">
            Policy Details
          </h2>
        </div>

        <div className="space-y-10 text-gray-700 text-sm sm:text-base leading-relaxed">
          {/* Shipping */}
          <div>
            <h3 className="text-xl font-semibold text-black mb-3">
              Shipping Information
            </h3>

            <p>
              Orders are processed within 1–2 business days after payment
              confirmation. Delivery timelines vary depending on your location
              and selected delivery method.
            </p>

            <p className="mt-4">
              Nairobi deliveries typically arrive within 1–3 business days,
              while deliveries outside Nairobi may take longer depending on the
              destination.
            </p>
          </div>

          {/* Returns */}
          <div>
            <h3 className="text-xl font-semibold text-black mb-3">
              Returns & Exchanges
            </h3>

            <p>
              Enjoy hassle-free exchanges and returns with our money-back
              guarantee. If your purchase does not meet your expectations,
              we’ll gladly assist according to our return and exchange policy.
            </p>

            <p className="mt-4">
              Returned products must be unused, undamaged, and in their
              original packaging to qualify for an exchange or refund.
            </p>
          </div>

          {/* Refunds */}
          <div>
            <h3 className="text-xl font-semibold text-black mb-3">
              Refund Policy
            </h3>

            <p>
              Approved refunds are processed after the returned product has been
              inspected. Please note that while return shipping costs may be
              covered depending on the situation, original shipping fees are
              non-refundable.
            </p>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xl font-semibold text-black mb-3">
              Customer Support
            </h3>

            <p>
              If you need assistance regarding shipping, delivery, returns, or
              exchanges, our customer support team is available to help ensure
              a smooth shopping experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShippingReturns