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
