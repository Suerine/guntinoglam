import React, { useEffect, useState, useContext } from "react"
import { useParams, Link } from "react-router-dom"
import API from "../../api/axios"
import ProductCard from "./ProductCard"
import { CartContext } from "../../context/CartContext"
import { getWhatsAppLink } from "../../utils/helper"
import { FaWhatsapp } from "react-icons/fa"
import { FiShoppingCart, FiChevronRight, FiHeart, FiStar } from "react-icons/fi"
import { WishlistContext } from "../../context/WishlistContext"

const ProductPage = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [selectedImage, setSelectedImage] = useState("")
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [cartLoading, setCartLoading] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)

  const { addToCart } = useContext(CartContext)
  const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/api/products/${id}`)
        setProduct(res.data)
        setSelectedImage(res.data.images?.[0])
        setSelectedColor(res.data.colors?.[0] || null)
        setSelectedSize(res.data.sizes?.[0]?.size || null)
        const related = await API.get(`/api/products?category=${res.data.category}&limit=4`)
        setRelatedProducts(related.data.products || [])
      } catch (error) {
        console.error(error)
      }
    }
    fetchProduct()
  }, [id])

  useEffect(() => {
    if (product) {
      setIsInWishlist(wishlist.some(item => item._id === product._id))
    }
  }, [product, wishlist])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [id])

  if (!product) return (
    <div className="min-h-screen bg-[#FFF5FF] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="prod-dm text-gray-400 text-sm tracking-widest uppercase">Loading</p>
      </div>
    </div>
  )

  const discountPercentage = product.discount || 0
  const displayPrice = product.price
  const originalPrice = product.originalPrice

  return (
    <div className="min-h-screen bg-[#FFF5FF] py-6 sm:py-12">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=Playfair+Display:wght@600;700&display=swap');
        .prod-bebas { font-family: 'Bebas Neue', sans-serif; }
        .prod-dm { font-family: 'DM Sans', sans-serif; }
        .font-playfair { font-family: 'Playfair Display', serif; }
      `}</style>


      {/* Breadcrumb */}
      <div className="border-b border-gray-200 px-4 sm:px-6 lg:px-10 py-6 mb-8" style={{ paddingTop: '6.5rem' }}>
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs prod-dm text-gray-500 font-medium">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <FiChevronRight className="text-gray-300 w-4 h-4" />
          <Link to="/products" className="hover:text-black transition-colors">Products</Link>
          <FiChevronRight className="text-gray-300 w-4 h-4" />
          <span className="text-black truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      {/* Main product section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12 mb-16">

          {/* Image section with thumbnails on the left */}
          <div className="lg:col-span-2 flex flex-col lg:flex-row gap-4">
            
            {/* Thumbnails - left side on desktop, above on mobile */}
            <div className="order-2 lg:order-1 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
              {product.images?.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-20 lg:h-24 overflow-hidden border-2 transition-all duration-200
                    ${selectedImage === img ? "border-pink-500 scale-100" : "border-gray-200 opacity-60 hover:opacity-100"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main image - centered */}
            <div className="order-1 lg:order-2 flex-1">
              <div className="relative overflow-hidden bg-white aspect-[3/4] lg:aspect-auto lg:h-auto">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                
                {/* Discount badge */}
                {discountPercentage > 0 && (
                  <div className="absolute top-4 right-4 bg-pink-500 text-white prod-dm font-bold px-3 py-1 text-sm">
                    -{discountPercentage}%
                  </div>
                )}

                {/* Collection badge */}
                {product.collection && (
                  <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white text-xs prod-dm px-3 py-1 rounded-full tracking-widest uppercase">
                    {product.collection}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Product details - right side */}
          <div className="lg:col-span-1 flex flex-col justify-start space-y-6">

            {/* Header with title and wishlist */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="prod-dm text-pink-500 text-xs tracking-[0.3em] uppercase mb-2 font-medium">
                  {product.category}
                </p>
                <h1 className="font-playfair text-4xl sm:text-5xl lg:text-5xl leading-tight text-black/60 mb-3">
                  {product.name}
                </h1>
                
                {/* Rating and reviews */}
                {(product.rating > 0 || product.numReviews > 0) && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`w-4 h-4 ${i < Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <p className="prod-dm text-xs text-gray-500">
                      {product.rating.toFixed(1)} ({product.numReviews} reviews)
                    </p>
                  </div>
                )}
              </div>

              {/* Wishlist button */}
              <button
                onClick={async () => {
                  if (wishlistLoading) return
                  setWishlistLoading(true)
                  try {
                    if (isInWishlist) {
                      await removeFromWishlist(product._id)
                    } else {
                      await addToWishlist(product)
                    }
                  } finally {
                    setWishlistLoading(false)
                  }
                }}
                disabled={wishlistLoading}
                className="flex-shrink-0 mt-2 p-3 hover:bg-gray-100 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiHeart
                  className={`w-6 h-6 ${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                />
              </button>
            </div>

            {/* Price section */}
            <div className="space-y-2">
              <div className="flex items-end gap-3">
                <p className="font-montserrat text-4xl sm:text-5xl font-medium text-black">
                  KSh {displayPrice?.toLocaleString()}
                </p>
                {originalPrice && originalPrice > displayPrice && (
                  <p className="prod-dm text-lg text-gray-400 line-through">
                    KSh {originalPrice.toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            {/* Rental info */}
            {product.isRentable && (
              <div className="bg-pink-300 border border-pink-200 p-4">
                <p className="prod-dm text-xs tracking-[0.1em] uppercase text-white font-bold mb-2">
                  Available for Rent
                </p>
                <p className="prod-dm text-sm text-white">
                  KSh {product.rentalPrice?.toLocaleString()} per {product.rentalDuration}
                </p>
              </div>
            )}

            {/* Divider */}
            <div className="h-px bg-gray-200" />

            {/* Description */}
            <p className="prod-dm text-gray-600 text-sm sm:text-base leading-relaxed">
              {product.description}
            </p>

            {/* Color */}
             {product.colors && product.colors.length > 0 && (
               <div>
                 <p style={{
                   fontFamily: 'Montserrat, sans-serif',
                   fontSize: '0.6rem',
                   letterSpacing: '0.3em',
                   textTransform: 'uppercase',
                   color: 'rgba(0,0,0,0.35)',
                   marginBottom: '0.75rem',
                 }}>
                   Available Colors
                 </p>
                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                   {product.colors.map((color, index) => (
                     <span
                       key={index}
                       style={{
                         fontFamily: 'Montserrat, sans-serif',
                         fontSize: '0.6rem',
                         letterSpacing: '0.15em',
                         textTransform: 'uppercase',
                         color: 'rgba(0,0,0,0.5)',
                         border: '1px solid rgba(0,0,0,0.12)',
                         padding: '0.3rem 0.85rem',
                       }}
                     >
                       {color}
                     </span>
                   ))}
                 </div>
               </div>
             )}

            {/* Size selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="prod-dm text-xs tracking-[0.2em] uppercase text-gray-600 font-medium">Select Size</p>
                {selectedSize && (
                  <p className="prod-dm text-xs text-black font-medium">
                    Selected: <span className="text-pink-500">{selectedSize}</span>
                  </p>
                )}
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                {product.sizes?.map((sizeObj, index) => {
                  const isOutOfStock = sizeObj.stock === 0
                  return (
                    <button
                      key={index}
                      onClick={() => !isOutOfStock && setSelectedSize(sizeObj.size)}
                      disabled={isOutOfStock}
                      className={`py-2.5  text-sm prod-dm font-medium border-2 transition-all duration-200
                        ${selectedSize === sizeObj.size
                          ? "bg-black text-white border-black"
                          : isOutOfStock
                          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50"
                          : "bg-white text-gray-600 border-gray-300 hover:border-black hover:text-black"
                        }`}
                    >
                      {sizeObj.size}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200" />

            {/* CTAs */}
            <div className="space-y-3 pt-4">
              <button
                onClick={async (e) => {
                  e.preventDefault()
                  if (cartLoading) return
                  setCartLoading(true)
                  try {
                    await addToCart(product, selectedSize, selectedColor)
                  } finally {
                    setCartLoading(false)
                  }
                }}
                disabled={cartLoading}
                className="w-full py-4 bg-black text-white prod-dm font-bold text-base
                  flex items-center justify-center gap-2
                  hover:bg-gray-900 transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed "
              >
                <FiShoppingCart className="w-5 h-5" />
                {cartLoading ? "Adding..." : "Add to Cart"}
              </button>

              <a
                href={getWhatsAppLink(product)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-[#25D366] text-white prod-dm font-bold text-base
                  flex items-center justify-center gap-2
                  hover:bg-[#1ebe5d] transition-all duration-200 "
              >
                <FaWhatsapp className="w-5 h-5" />
                Ask on WhatsApp
              </a>
            </div>


            {/* Stock info */}
            <div className="prod-dm text-xs text-gray-500 space-y-1">
              <p>SKU: <span className="text-gray-700 font-medium">{product.sku || "N/A"}</span></p>
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {product.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Product details section */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="font-playfair text-3xl sm:text-4xl text-black">Product Details</h2>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="prod-dm text-gray-600 leading-relaxed text-sm sm:text-base">
                {product.description}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="prod-dm text-xs tracking-widest uppercase text-gray-500 font-bold mb-4">Information</p>
              <div className="space-y-3 prod-dm text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-medium text-black">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Collection:</span>
                  <span className="font-medium text-black">{product.collection}</span>
                </div>
                {product.colors && product.colors.length > 0 && (
                  <div className="flex justify-between">
                    <span>Available Colors:</span>
                    <span className="font-medium text-black">{product.colors.join(", ")}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Total Images:</span>
                  <span className="font-medium text-black">{product.images?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <h2 className="font-playfair text-3xl sm:text-4xl text-black">You May Also Like</h2>
                <div className="hidden sm:block h-px w-16 bg-gray-200" />
              </div>
              <Link
                to="/products"
                className="prod-dm text-xs tracking-widest uppercase text-gray-500 hover:text-black transition-colors flex items-center gap-1 font-medium"
              >
                View All <FiChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((item) => (
                <Link key={item._id} to={`/products/${item._id}`}>
                  <ProductCard product={item} />
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default ProductPage