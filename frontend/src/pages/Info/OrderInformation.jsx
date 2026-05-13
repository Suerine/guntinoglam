import React from "react"
import {
  FiPackage,
  FiTruck,
  FiClock,
  FiRefreshCw,
  FiShield,
  FiMapPin,
} from "react-icons/fi"

const OrderInformation = () => {
  const infoCards = [
    {
      icon: <FiPackage className="w-6 h-6" />,
      title: "Order Processing",
      description:
        "All orders are processed within 1–2 business days after confirmation.",
    },
    {
      icon: <FiTruck className="w-6 h-6" />,
      title: "Shipping & Delivery",
      description:
        "We deliver nationwide. Delivery timelines vary depending on your location.",
    },
    {
      icon: <FiClock className="w-6 h-6" />,
      title: "Delivery Time",
      description:
        "Nairobi deliveries usually arrive within 1–3 business days while upcountry orders may take longer.",
    },
    {
      icon: <FiRefreshCw className="w-6 h-6" />,
      title: "Returns & Exchanges",
      description:
        "We offer hassle-free exchanges and returns according to our return policy.",
    },
    {
      icon: <FiShield className="w-6 h-6" />,
      title: "Secure Payments",
      description:
        "All payments are processed securely to ensure a safe shopping experience.",
    },
    {
      icon: <FiMapPin className="w-6 h-6" />,
      title: "Pickup Options",
      description:
        "Customers may also arrange pickups depending on product availability and location.",
    },
  ]

  return (
    <div className="min-h-screen bg-[#FFF7FF] pt-36 pb-20 px-4 sm:px-6 lg:px-10">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto text-center mb-16">
        <p className="text-pink-500 uppercase tracking-[0.35em] text-xs font-medium mb-4">
          Customer Support
        </p>

        <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl text-black mb-6">
          Order Information
        </h1>

        <p className="max-w-2xl mx-auto text-gray-600 text-sm sm:text-base leading-relaxed">
          Everything you need to know about order processing, shipping,
          delivery, returns, and exchanges. For more information, please contact our customer support team on <a href="mailto:artbynajmaa@gmail.com?subject=Order%20Inquiry" className="text-pink-500 underline">artbynajmaa@gmail.com</a> or call us at <a href="tel:+254793904535" className="text-pink-500 underline">+254 793 904 535</a>.
        </p>
      </div>

      {/* Information Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        {infoCards.map((card, index) => (
          <div
            key={index}
            className="bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-2xl bg-pink-100 text-pink-500 flex items-center justify-center mb-5">
              {card.icon}
            </div>

            <h2 className="text-xl font-semibold text-black mb-3">
              {card.title}
            </h2>

            <p className="text-gray-600 text-sm leading-relaxed">
              {card.description}
            </p>
          </div>
        ))}
      </div>

      {/* Detailed Section */}
      <div className="max-w-5xl mx-auto bg-white  p-8 sm:p-12 shadow-sm border border-gray-100 mb-5">
        <h2 className="font-playfair text-3xl sm:text-4xl text-black mb-8">
         Buying Process
        </h2>

        <div className="space-y-8 text-gray-700 text-sm sm:text-base leading-relaxed">
          <div>
            <h3 className="font-semibold text-black mb-2">
              Browse
            </h3>
            <p>
              Choose the Dirac/Guntino of your choice from our wide selection.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-black mb-2">
              Add To Cart & Checkout
            </h3>
            <p>
              Add your desired items to the cart and proceed to checkout to complete your purchase securely.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-black mb-2">
              Payment
            </h3>
            <p>
              Select your preferred payment method and follow the prompts to complete your transaction securely.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-black mb-2">
              Delivery
            </h3>
            <p>
              Sit back and relax while we prepare and deliver your order to your doorstep. You can track your order status in your account.
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Section */}
      <div className="max-w-5xl mx-auto bg-white  p-8 sm:p-12 shadow-sm border border-gray-100">
        <h2 className="font-playfair text-3xl sm:text-4xl text-black mb-8">
          Important Information
        </h2>

        <div className="space-y-8 text-gray-700 text-sm sm:text-base leading-relaxed">
          <div>
            <h3 className="font-semibold text-black mb-2">
              Processing Orders
            </h3>
            <p>
              Orders are confirmed and processed during business days only.
              Delays may occur during holidays, high demand periods, or special
              promotions.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-black mb-2">
              Delivery Coverage
            </h3>
            <p>
              We currently ship across Kenya. Shipping timelines and costs may
              vary depending on your county and preferred delivery method.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-black mb-2">
              Returns & Refunds
            </h3>
            <p>
              If your purchase does not meet your expectations, you may request
              an exchange or refund according to our return policy. Products
              must be returned in their original condition.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-black mb-2">
              Need Assistance?
            </h3>
            <p>
              Our customer support team is always available to help with any
              questions regarding your order, shipping, or returns.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderInformation