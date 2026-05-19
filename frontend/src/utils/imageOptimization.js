/**
 * Image Optimization Utilities
 * Helps optimize images for better SEO and performance
 */

/**
 * Generate optimized Cloudinary URL
 * @param {string} publicId - Cloudinary public ID
 * @param {object} options - Optimization options
 */
export const getOptimizedImage = (publicId, options = {}) => {
  if (!publicId) return null;

  const {
    width = 800,
    height = 1000,
    quality = "auto",
    format = "auto",
    crop = "fill",
    gravity = "auto",
    radius = "max",
  } = options;

  const baseUrl = "https://res.cloudinary.com/your-cloud-name/image/upload/";

  const transformations = [
    `q_${quality}`,
    `f_${format}`,
    `w_${width}`,
    `h_${height}`,
    `c_${crop}`,
    `g_${gravity}`,
  ].join(",");

  return `${baseUrl}${transformations}/${publicId}`;
};

/**
 * Generate responsive srcset for images
 */
export const getImageSrcSet = (publicId, alt = "") => {
  if (!publicId) return { src: "", srcSet: "" };

  const sizes = [400, 600, 800, 1000, 1200];
  const srcSet = sizes
    .map((size) => `${getOptimizedImage(publicId, { width: size })} ${size}w`)
    .join(", ");

  return {
    src: getOptimizedImage(publicId, { width: 800 }),
    srcSet,
    sizes: "(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 800px",
  };
};

/**
 * Get optimized OG image for social sharing
 * 1200x630px is optimal for Open Graph
 */
export const getOGImage = (publicId) => {
  if (!publicId) return null;
  return getOptimizedImage(publicId, {
    width: 1200,
    height: 630,
    crop: "fill",
    quality: 85,
  });
};

/**
 * Get optimized thumbnail for product cards
 * Usually 400x500px for fashion
 */
export const getThumbnail = (publicId) => {
  if (!publicId) return null;
  return getOptimizedImage(publicId, {
    width: 400,
    height: 500,
    quality: 80,
  });
};

/**
 * Get WebP format for modern browsers (with fallback)
 */
export const getWebPImage = (publicId, width = 800, height = 1000) => {
  if (!publicId) return null;
  return getOptimizedImage(publicId, {
    width,
    height,
    format: "webp",
    quality: "auto",
  });
};

/**
 * Lazy load image component data
 * Returns preload link for performance
 */
export const getImagePreloadLink = (publicId, width = 800) => {
  const src = getOptimizedImage(publicId, { width });
  return {
    rel: "preload",
    as: "image",
    href: src,
  };
};

/**
 * Image loading strategy constants
 */
export const IMAGE_LOADING = {
  LAZY: "lazy",
  EAGER: "eager",
};

/**
 * Image alt text generator (SEO-friendly)
 * Use this pattern for consistent alt text
 */
export const generateAltText = (productName, collection, category) => {
  return `${productName} - ${collection} Somali fashion ${category} from Guntino Glam`;
};

/**
 * Example usage in React:
 *
 * import { getImageSrcSet, generateAltText, IMAGE_LOADING } from '@/utils/imageOptimization';
 *
 * <img
 *   {...getImageSrcSet(product.images[0], product.name)}
 *   alt={generateAltText(product.name, product.collection, product.category)}
 *   loading={IMAGE_LOADING.LAZY}
 *   className="w-full h-full object-cover"
 * />
 */
