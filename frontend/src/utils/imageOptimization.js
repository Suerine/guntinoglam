/**
 * Image Optimization Utilities
 * Helps optimize images for better SEO and performance
 */

const CLOUDINARY_NAME = import.meta.env.VITE_CLOUDINARY_NAME || "dtvn6rmeo";
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_NAME}/image/upload/`;
const CLOUDINARY_UPLOAD_SEGMENT = "/image/upload/";

const createTransformationString = ({
  width,
  height,
  quality = "auto",
  format = "auto",
  crop = "fill",
  gravity = "auto",
  radius,
}) => {
  return [
    `q_${quality}`,
    `f_${format}`,
    width ? `w_${width}` : null,
    height ? `h_${height}` : null,
    crop ? `c_${crop}` : null,
    gravity ? `g_${gravity}` : null,
    radius ? `r_${radius}` : null,
  ]
    .filter(Boolean)
    .join(",");
};

const normalizeCloudinaryUrl = (urlString, transformations) => {
  try {
    const url = new URL(urlString);
    const uploadIndex = url.pathname.indexOf(CLOUDINARY_UPLOAD_SEGMENT);
    if (uploadIndex === -1) return urlString;

    const afterUpload = url.pathname.slice(
      uploadIndex + CLOUDINARY_UPLOAD_SEGMENT.length,
    );
    const segments = afterUpload.split("/");
    const firstSegment = segments[0] || "";
    const isTransformSegment = ["q_", "f_", "w_", "h_", "c_", "g_", "r_"].some(
      (prefix) => firstSegment.includes(prefix),
    );
    const rest = isTransformSegment ? segments.slice(1).join("/") : afterUpload;

    url.pathname = `${url.pathname.slice(0, uploadIndex + CLOUDINARY_UPLOAD_SEGMENT.length)}${transformations}/${rest}`;
    return url.toString();
  } catch (error) {
    return urlString;
  }
};

/**
 * Generate optimized Cloudinary URL from either a full Cloudinary URL or a public ID.
 */
export const getOptimizedImage = (publicIdOrUrl, options = {}) => {
  if (!publicIdOrUrl) return null;

  const {
    width = 800,
    height,
    quality = "auto",
    format = "auto",
    crop = "fill",
    gravity = "auto",
    radius,
  } = options;

  const transformations = createTransformationString({
    width,
    height,
    quality,
    format,
    crop,
    gravity,
    radius,
  });

  if (
    typeof publicIdOrUrl === "string" &&
    publicIdOrUrl.includes(CLOUDINARY_UPLOAD_SEGMENT)
  ) {
    return normalizeCloudinaryUrl(publicIdOrUrl, transformations);
  }

  return `${CLOUDINARY_BASE_URL}${transformations}/${publicIdOrUrl}`;
};

/**
 * Generate responsive srcset for images
 */
export const getImageSrcSet = (publicIdOrUrl, alt = "") => {
  if (!publicIdOrUrl) return { src: "", srcSet: "" };

  const sizes = [400, 600, 800, 1000, 1200];
  const srcSet = sizes
    .map(
      (size) => `${getOptimizedImage(publicIdOrUrl, { width: size })} ${size}w`,
    )
    .join(", ");

  return {
    src: getOptimizedImage(publicIdOrUrl, { width: 800 }),
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
