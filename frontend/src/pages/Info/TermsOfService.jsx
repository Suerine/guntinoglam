import React from "react"
import {
  FiFileText,
  FiShield,
  FiShoppingBag,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi"

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-[#FFF7FF] pt-36 pb-20 px-4 sm:px-6 lg:px-10">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto text-center mb-16">
        <p className="text-pink-500 uppercase tracking-[0.35em] text-xs font-medium mb-4">
          Legal Information
        </p>

        <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl text-black mb-6">
          Terms of Service
        </h1>

        <p className="max-w-2xl mx-auto text-gray-600 text-sm sm:text-base leading-relaxed">
          Please read these terms carefully before using our website or placing
          an order. By accessing our services, you agree to these terms. For more information, please contact our customer support team on <a href="mailto:artbynajmaa@gmail.com?subject=Order%20Inquiry" className="text-pink-500 underline">artbynajmaa@gmail.com</a> or call us at <a href="tel:+254793904535" className="text-pink-500 underline">+254 793 904 535</a>.
        </p>
      </div>

      {/* Highlights */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        <div className="bg-white  border border-gray-100 shadow-sm p-6">
          <div className="w-14 h-14 rounded-2xl bg-pink-100 text-pink-500 flex items-center justify-center mb-5">
            <FiShoppingBag className="w-6 h-6" />
          </div>

          <h2 className="text-lg font-semibold text-black mb-2">
            Orders & Purchases
          </h2>

          <p className="text-gray-600 text-sm leading-relaxed">
            Orders placed through our website are subject to product
            availability and confirmation.
          </p>
        </div>

        <div className="bg-white  border border-gray-100 shadow-sm p-6">
          <div className="w-14 h-14 rounded-2xl bg-pink-100 text-pink-500 flex items-center justify-center mb-5">
            <FiShield className="w-6 h-6" />
          </div>

          <h2 className="text-lg font-semibold text-black mb-2">
            Privacy & Security
          </h2>

          <p className="text-gray-600 text-sm leading-relaxed">
            We are committed to protecting your personal information and secure
            transactions.
          </p>
        </div>

        <div className="bg-white border border-gray-100 shadow-sm p-6">
          <div className="w-14 h-14 rounded-2xl bg-pink-100 text-pink-500 flex items-center justify-center mb-5">
            <FiAlertCircle className="w-6 h-6" />
          </div>

          <h2 className="text-lg font-semibold text-black mb-2">
            User Responsibilities
          </h2>

          <p className="text-gray-600 text-sm leading-relaxed">
            Users are expected to provide accurate information and use the
            website responsibly.
          </p>
        </div>

        <div className="bg-white  border border-gray-100 shadow-sm p-6">
          <div className="w-14 h-14 rounded-2xl bg-pink-100 text-pink-500 flex items-center justify-center mb-5">
            <FiCheckCircle className="w-6 h-6" />
          </div>

          <h2 className="text-lg font-semibold text-black mb-2">
            Agreement
          </h2>

          <p className="text-gray-600 text-sm leading-relaxed">
            By continuing to use our platform, you agree to comply with these
            terms and conditions.
          </p>
        </div>
      </div>

      {/* Main Terms Section */}
      <div className="max-w-5xl mx-auto bg-white border border-gray-100 shadow-sm p-8 sm:p-12">
        <div className="flex items-center gap-3 mb-10">
          <FiFileText className="text-pink-500 w-7 h-7" />

          <h2 className="font-playfair text-3xl sm:text-4xl text-black">
            Terms & Conditions
          </h2>
        </div>

        <div className="space-y-10 text-gray-700 text-sm sm:text-base leading-relaxed">
          {/* Introduction */}
          <div>
            <h3 className="text-xl font-semibold text-black mb-3">
              Introduction
            </h3>

            <p>
              These Terms of Service govern your use of our website, products,
              and services. By accessing or purchasing from our platform, you
              agree to be bound by these terms.
            </p>
          </div>

          {/* Orders */}
          <div>
            <h3 className="text-xl font-semibold text-black mb-3">
              Orders & Payments
            </h3>

            <p>
              All orders are subject to product availability and payment
              confirmation. We reserve the right to cancel or refuse any order
              at our discretion.
            </p>

            <p className="mt-4">
              Prices and product availability may change without prior notice.
            </p>
          </div>

          {/* Shipping */}
          <div>
            <h3 className="text-xl font-semibold text-black mb-3">
              Shipping & Delivery
            </h3>

            <p>
              Delivery timelines are estimates and may vary depending on
              location, courier delays, or unforeseen circumstances.
            </p>

            <p className="mt-4">
              Customers are responsible for providing accurate delivery
              information during checkout.
            </p>
          </div>

          {/* Returns */}
          <div>
            <h3 className="text-xl font-semibold text-black mb-3">
              Returns & Refunds
            </h3>

            <p>
              Returns and exchanges are accepted according to our return policy.
              Products must be returned unused and in their original condition
              where applicable.
            </p>
          </div>

          {/* Intellectual Property */}
          <div>
            <h3 className="text-xl font-semibold text-black mb-3">
              Intellectual Property
            </h3>

            <p>
              All website content including images, branding, logos, and design
              elements remain the property of the business and may not be copied
              or reproduced without permission.
            </p>
          </div>

          {/* Liability */}
          <div>
            <h3 className="text-xl font-semibold text-black mb-3">
              Limitation of Liability
            </h3>

            <p>
              We are not liable for indirect, incidental, or consequential
              damages arising from the use of our website, products, or
              services.
            </p>
          </div>

          {/* Updates */}
          <div>
            <h3 className="text-xl font-semibold text-black mb-3">
              Changes to Terms
            </h3>

            <p>
              We reserve the right to update or modify these Terms of Service at
              any time without prior notice. Continued use of the platform after
              updates constitutes acceptance of the revised terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsOfService