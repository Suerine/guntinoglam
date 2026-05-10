import { useState } from "react";
import { ChevronDown, ChevronUp, Truck } from "lucide-react";

export default function ShippingInfoDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full border border-gray-200 overflow-hidden bg-white shadow-sm">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-3">
          <div className="bg-black text-white p-2 rounded-full">
            <Truck size={18} />
          </div>

          <div>
            <h3 className="font-semibold text-gray-900" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              Shipping, Returns & Exchanges
            </h3>
            <p className="text-sm text-gray-500 font-montserrat">
              Learn more about our policy
            </p>
          </div>
        </div>

        {open ? (
          <ChevronUp className="text-gray-600" size={20} />
        ) : (
          <ChevronDown className="text-gray-600" size={20} />
        )}
      </button>

      {/* Dropdown Content */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 pb-5 text-sm leading-7 text-gray-700">
          <p>
            Enjoy hassle-free exchanges and returns with our money-back
            guarantee.
          </p>

          <p className="mt-4">
            If your purchase doesn't meet your expectations, we'll gladly
            refund your money as per our{" "}
            <span className="font-medium underline cursor-pointer">
              Return, Refund & Exchange Policy
            </span>
            .
          </p>

          <p className="mt-4">
            Please be aware that while we cover the return shipping costs,
            the initial shipping fee is non-refundable.
          </p>

          <p className="mt-4">
            Your satisfaction is our priority, and we're committed to making
            your shopping experience as seamless as possible.
          </p>

          <p className="mt-4">
            Feel free to reach out to our customer service team for assistance
            with any returns or exchanges.
          </p>
        </div>
      </div>
    </div>
  );
}