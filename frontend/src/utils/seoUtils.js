/**
 * SEO Utilities for generating structured data and meta tags
 */

/**
 * Generate Product JSON-LD Schema
 */
export const generateProductSchema = (
  product,
  baseUrl = "https://guntinoglam.com",
) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.name,
    image: product.images?.[0] || `${baseUrl}/og-image.jpg`,
    brand: {
      "@type": "Brand",
      name: "Guntino Glam",
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "KES",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${baseUrl}/products/${product._id}`,
    },
    aggregateRating:
      product.rating && product.numReviews > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: Math.round(product.rating),
            ratingCount: product.numReviews,
            reviewCount: product.numReviews,
          }
        : undefined,
    category: product.category,
    collection: product.collection,
  };
};

/**
 * Generate Breadcrumb JSON-LD Schema
 */
export const generateBreadcrumbSchema = (
  items,
  baseUrl = "https://guntinoglam.com",
) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };
};

/**
 * Generate Organization JSON-LD Schema
 */
export const generateOrganizationSchema = (
  baseUrl = "https://guntinoglam.com",
) => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Guntino Glam",
    url: baseUrl,
    logo: `${baseUrl}/LogoGuntino.svg`,
    description:
      "Guntino Glam is a Nairobi-based fashion brand offering curated Somali Dirac for sale and hire.",
    sameAs: [
      "https://www.instagram.com/guntinoglam",
      "https://www.tiktok.com/@guntinoglam",
      "https://www.facebook.com/guntinoglam",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nairobi",
      addressCountry: "KE",
      addressRegion: "Nairobi",
    },
    areaServed: "KE",
  };
};

/**
 * Generate LocalBusiness JSON-LD Schema
 */
export const generateLocalBusinessSchema = (
  baseUrl = "https://guntinoglam.com",
) => {
  return {
    "@context": "https://schema.org",
    "@type": ["ClothingStore", "LocalBusiness"],
    name: "Guntino Glam",
    url: baseUrl,
    logo: `${baseUrl}/LogoGuntino.svg`,
    description: "Somali Fashion & Dirac - Buy or Hire",
    image: `${baseUrl}/og-image.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Nairobi",
      addressLocality: "Nairobi",
      addressCountry: "KE",
    },
    areaServed: "KE",
    priceRange: "1000-50000",
  };
};

/**
 * Generate FAQPage JSON-LD Schema
 */
export const generateFAQSchema = (faqs) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
};

/**
 * Generate Collection Page Schema
 */
export const generateCollectionSchema = (
  collectionName,
  baseUrl = "https://guntinoglam.com",
) => {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${collectionName} Collection - Guntino Glam`,
    url: `${baseUrl}/products?collection=${encodeURIComponent(collectionName)}`,
    description: `Browse our exclusive ${collectionName} collection at Guntino Glam`,
  };
};

/**
 * Create canonical URL
 */
export const getCanonicalUrl = (
  pathname,
  baseUrl = "https://guntinoglam.com",
) => {
  // Remove trailing slashes and query parameters for canonical URL
  const cleanPath = pathname.split("?")[0].replace(/\/$/, "");
  return `${baseUrl}${cleanPath}` || baseUrl;
};

/**
 * Generate Open Graph tags
 */
export const generateOGTags = (config) => {
  return {
    title: config.title || "Guntino Glam",
    description:
      config.description ||
      "Curated Somali Dirac for sale and hire. Based in Nairobi, Kenya.",
    url: config.url || "https://guntinoglam.com",
    image: config.image || "https://guntinoglam.com/og-image.jpg",
    type: config.type || "website",
  };
};
