import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { FiShoppingBag, FiHeart, FiShoppingCart, FiLogOut, FiUser, FiMail, FiChevronRight } from "react-icons/fi"

function ProfilePage() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FFF5FF] flex justify-center items-center px-4">
        <div className="text-center">
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=Playfair+Display:wght@600;700&display=swap');
            .prod-bebas { font-family: 'Bebas Neue', sans-serif; }
            .prod-dm { font-family: 'DM Sans', sans-serif; }
            .font-playfair { font-family: 'Playfair Display', serif; }
          `}</style>
          <h1 className="font-playfair text-4xl text-black mb-4">Welcome Back</h1>
          <p className="prod-dm text-gray-500 mb-6 text-sm tracking-widest uppercase">You need to sign in to view your profile</p>
          <Link to="/login" className="inline-block bg-black text-white prod-dm font-medium px-8 py-3 rounded-lg hover:bg-gray-900 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const links = [
    { to: "/orders", label: "My Orders", icon: FiShoppingBag, desc: "Track & view past orders" },
    { to: "/wishlist", label: "Wishlist", icon: FiHeart, desc: "Items you've saved" },
    { to: "/cart", label: "Cart", icon: FiShoppingCart, desc: "Ready to checkout" },
  ]

  return (
    <div className="min-h-screen bg-[#FFF5FF] py-6 sm:py-12">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=Playfair+Display:wght@600;700&display=swap');
        .prod-bebas { font-family: 'Bebas Neue', sans-serif; }
        .prod-dm { font-family: 'DM Sans', sans-serif; }
        .font-playfair { font-family: 'Playfair Display', serif; }
      `}</style>

      {/* Hero banner */}
      <div className="bg-[#FFF5FF] text-[#191A23] px-4 sm:px-6 lg:px-10 py-16 sm:py-24 relative overflow-hidden mb-12 sm:mb-16 border-b border-gray-200">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-pink-500/5 to-transparent rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-6 mb-1">
            {/* Avatar */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-pink-300 to-pink-300 flex items-center justify-center shrink-0 border-2 border-pink-300/50">
              <span className="text-[#191A23] font-playfair font-bold text-3xl sm:text-4xl">
                {initials}
              </span>
            </div>

            <div>
              <p className="prod-dm text-[#191A23]/50 text-xs tracking-[0.3em] uppercase mb-2">Welcome back</p>
              <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl leading-tight text-[#191A23]">{user.name}</h1>
              <p className="prod-dm text-[#191A23]/60 text-sm mt-2">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

        {/* Quick links section */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-playfair text-3xl sm:text-4xl text-black">Quick Access</h2>
            <div className="flex-1 h-px bg-gray-200 hidden sm:block" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {links.map(({ to, label, icon: Icon, desc }) => (
              <Link
                key={to}
                to={to}
                className="group bg-white rounded-xl p-6 sm:p-8 border-2 border-gray-100 hover:border-pink-300 transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-full bg-black/5 group-hover:bg-black group-hover:text-white flex items-center justify-center transition-all duration-300 mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-playfair font-bold text-lg text-black mb-1">{label}</h3>
                <p className="font-montserrat text-sm text-gray-500 mb-4">{desc}</p>
                <div className="flex items-center text-pink-600 text-sm prod-dm font-medium group-hover:translate-x-1 transition-transform">
                  View <FiChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Account Details Section */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-playfair text-3xl sm:text-4xl text-black">Account Details</h2>
            <div className="flex-1 h-px bg-gray-200 hidden sm:block" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Name Card */}
            <div className="bg-white rounded-xl border-2 border-gray-100 p-6 hover:border-pink-300 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-black/5 flex items-center justify-center shrink-0">
                  <FiUser className="w-6 h-6 text-black/40" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="prod-dm text-xs tracking-widest uppercase text-gray-400 font-medium mb-2">Full Name</p>
                  <p className="prod-dm text-lg text-black font-medium truncate">{user.name}</p>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-xl border-2 border-gray-100 p-6 hover:border-pink-300 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-black/5 flex items-center justify-center shrink-0">
                  <FiMail className="w-6 h-6 text-black/40" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="prod-dm text-xs tracking-widest uppercase text-gray-400 font-medium mb-2">Email Address</p>
                  <p className="prod-dm text-lg text-black font-medium truncate">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Section */}
        <div className="border-t border-gray-200 pt-8 pb-12">
          <button
            onClick={() => {
              logout()
              navigate("/")
            }}
            className="flex items-center gap-2 prod-dm text-sm font-medium text-red-600 hover:text-red-700 transition-colors group"
          >
            <FiLogOut className="w-5 h-5" />
            Sign Out
          </button>
          <p className="prod-dm text-xs text-gray-400 mt-2">You will be logged out and redirected to the home page</p>
        </div>

      </div>
    </div>
  )
}

export default ProfilePage