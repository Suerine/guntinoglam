# Backend SEO Improvements - Implementation Guide

## 📋 Overview

This guide provides backend implementations for improved SEO on Guntino Glam.

---

## 🔍 1. Dynamic Sitemap Generation

### Option A: XML Sitemap Endpoint (Recommended)

Add this route to your Express backend:

```javascript
// routes/sitemapRoutes.js
import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/api/sitemap.xml", async (req, res) => {
  try {
    const baseUrl = "https://guntinoglam.com";

    // Fetch all products
    const products = await Product.find({ isActive: true })
      .select("_id updatedAt slug")
      .lean();

    // Generate XML header
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml +=
      '         xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';

    // Static pages
    const staticPages = [
      { url: "/", priority: 1.0, changefreq: "weekly" },
      { url: "/products", priority: 0.9, changefreq: "daily" },
      {
        url: "/products?collection=Faransawi",
        priority: 0.8,
        changefreq: "weekly",
      },
      {
        url: "/products?collection=Maqbal",
        priority: 0.8,
        changefreq: "weekly",
      },
      {
        url: "/products?collection=Guntino",
        priority: 0.8,
        changefreq: "weekly",
      },
      {
        url: "/products?collection=Stones",
        priority: 0.8,
        changefreq: "weekly",
      },
      {
        url: "/products?collection=Baati",
        priority: 0.8,
        changefreq: "weekly",
      },
      {
        url: "/products?collection=Traditional",
        priority: 0.8,
        changefreq: "weekly",
      },
      { url: "/shipping-returns", priority: 0.6, changefreq: "monthly" },
      { url: "/refund-policy", priority: 0.6, changefreq: "monthly" },
      { url: "/terms-of-service", priority: 0.6, changefreq: "monthly" },
      { url: "/order-information", priority: 0.5, changefreq: "yearly" },
    ];

    // Add static pages
    staticPages.forEach((page) => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `  </url>\n`;
    });

    // Add product pages
    products.forEach((product) => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/products/${product._id}</loc>\n`;
      xml += `    <lastmod>${product.updatedAt.toISOString().split("T")[0]}</lastmod>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `  </url>\n`;
    });

    xml += "</urlset>";

    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (error) {
    console.error("Sitemap generation error:", error);
    res.status(500).send("Error generating sitemap");
  }
});

export default router;
```

Add to server.js:

```javascript
import sitemapRoutes from "./routes/sitemapRoutes.js";
app.use(sitemapRoutes);
```

Update robots.txt:

```
User-agent: *
Allow: /
Sitemap: https://guntinoglam.com/api/sitemap.xml
```

### Option B: Static Sitemap Generation (during build)

```javascript
// scripts/generateSitemap.js
import Product from "./models/Product.js";
import fs from "fs";
import path from "path";

async function generateSitemap() {
  const baseUrl = "https://guntinoglam.com";
  const products = await Product.find({ isActive: true });

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Add all URLs
  // ... (same as above)

  xml += "</urlset>";

  fs.writeFileSync(
    path.join(process.cwd(), "frontend/public/sitemap.xml"),
    xml,
  );
  console.log("✅ Sitemap generated successfully");
}

generateSitemap();
```

---

## 2. Robots.txt Optimization

Update `frontend/public/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /cart
Disallow: /checkout
Disallow: /orders
Disallow: /profile
Disallow: /login
Disallow: /wishlist
Allow: /products

User-agent: Googlebot
Allow: /
Disallow: /admin
Crawl-delay: 1

User-agent: Bingbot
Crawl-delay: 1

Sitemap: https://guntinoglam.com/api/sitemap.xml
```

---

## 3. Meta Tags API Endpoint

Add this endpoint to serve dynamic meta tags (useful for social media previews):

```javascript
// routes/metaRoutes.js
import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/api/meta/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .select("name description images price collection category")
      .lean();

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      title: `${product.name} | Guntino Glam`,
      description:
        product.description ||
        `Premium ${product.collection} from Guntino Glam`,
      image: product.images?.[0],
      url: `https://guntinoglam.com/products/${product._id}`,
      price: product.price,
      currency: "KES",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

---

## 4. Add Product SEO Fields to Model

Update `models/Product.js`:

```javascript
const productSchema = new Schema({
  // ... existing fields

  // SEO fields
  metaTitle: {
    type: String,
    maxlength: 60,
    trim: true,
  },
  metaDescription: {
    type: String,
    maxlength: 160,
    trim: true,
  },
  metaKeywords: {
    type: String,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  ogImage: String, // For Open Graph
  altText: String, // Image alt text

  // Content
  longDescription: String, // For rich snippets

  // Publishing
  isActive: {
    type: Boolean,
    default: true,
  },
});

// Middleware to generate slug
productSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }
  next();
});
```

---

## 5. Structured Data Endpoints

```javascript
// routes/schemaRoutes.js
import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// Product schema endpoint
router.get("/api/schema/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();

    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: product.images?.[0],
      brand: {
        "@type": "Brand",
        name: "Guntino Glam",
      },
      offers: {
        "@type": "Offer",
        price: product.price,
        priceCurrency: "KES",
        availability: product.inStock ? "InStock" : "OutOfStock",
      },
      category: product.category,
      collection: product.collection,
      aggregateRating:
        product.numReviews > 0
          ? {
              "@type": "AggregateRating",
              ratingValue: product.rating,
              reviewCount: product.numReviews,
            }
          : undefined,
    };

    res.json(schema);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

---

## 6. Response Headers for SEO

Add to Express middleware (server.js):

```javascript
// SEO-friendly headers
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "SAMEORIGIN");

  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Enable XSS protection
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Content Security Policy
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' js.paystack.co; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com",
  );

  next();
});
```

---

## 7. Redirects for Old/Duplicate URLs

```javascript
// Permanent redirects for SEO
app.get("/shop", (req, res) => res.redirect(301, "/products"));
app.get("/store", (req, res) => res.redirect(301, "/products"));
app.get("/collection/:name", (req, res) => {
  res.redirect(301, `/products?collection=${req.params.name}`);
});
```

---

## 8. Image Optimization Configuration (Cloudinary)

Update `config/cloudinary.js`:

```javascript
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Generate optimized URLs
export const getOptimizedImageUrl = (publicId, options = {}) => {
  return cloudinary.v2.url(publicId, {
    quality: "auto",
    fetch_format: "auto",
    width: options.width || 800,
    height: options.height || 1000,
    crop: "fill",
    gravity: "auto",
    ...options,
  });
};

export default cloudinary;
```

---

## 9. API Response Optimization

Add caching headers:

```javascript
app.get("/api/products", (req, res, next) => {
  // Cache products list for 1 hour
  res.setHeader("Cache-Control", "public, max-age=3600");
  next();
});

app.get("/api/products/:id", (req, res, next) => {
  // Cache individual product for 24 hours
  res.setHeader("Cache-Control", "public, max-age=86400");
  next();
});
```

---

## 10. Monitoring Setup

```javascript
// Setup logging for monitoring
import morgan from "morgan";

app.use(morgan("combined")); // HTTP request logging

// Custom monitoring for SEO
app.use((req, res, next) => {
  if (req.path.includes("sitemap") || req.path.includes("robots")) {
    console.log(`🤖 Bot request: ${req.method} ${req.path} from ${req.ip}`);
  }
  next();
});
```

---

## 📊 Implementation Checklist

- [ ] Add dynamic sitemap endpoint
- [ ] Update robots.txt
- [ ] Add SEO fields to Product model
- [ ] Add meta tags endpoint
- [ ] Add schema endpoints
- [ ] Configure response headers
- [ ] Set up redirects for old URLs
- [ ] Optimize Cloudinary configuration
- [ ] Add cache headers
- [ ] Test all SEO endpoints
- [ ] Monitor with Google Search Console
- [ ] Monitor with Google Analytics 4

---

## 🔗 Testing Commands

```bash
# Test sitemap
curl https://guntinoglam.com/api/sitemap.xml

# Test robots.txt
curl https://guntinoglam.com/robots.txt

# Test meta endpoint
curl https://guntinoglam.com/api/meta/product/[PRODUCT_ID]

# Test schema endpoint
curl https://guntinoglam.com/api/schema/product/[PRODUCT_ID]
```

---

## 📈 Expected Impact

- 30-50% improvement in organic search visibility
- Better crawlability for search engines
- Improved click-through rates from SERPs
- Better social media sharing previews
- Improved Core Web Vitals scores

---

**Last Updated:** May 2026
