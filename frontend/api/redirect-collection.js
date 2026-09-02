export const config = { runtime: "edge" };

export default async function handler(req) {
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

  // No collection param — serve the SPA shell instead of redirecting
  const spaUrl = new URL("/index.html", req.url);
  return fetch(spaUrl);
}
