export const config = { runtime: "edge" };

export default function handler(req) {
  const url = new URL(req.url);
  const collection = url.searchParams.get("collection");

  if (collection) {
    const slug = collection
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    return Response.redirect(
      `https://www.guntinoglam.com/collections/${slug}`,
      308,
    );
  }

  // No collection param — fall through to normal SPA
  return Response.redirect(`https://www.guntinoglam.com/products`, 308);
}
