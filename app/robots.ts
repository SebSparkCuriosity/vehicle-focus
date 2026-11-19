import type { MetadataRoute } from "next";

// Until launch (SITE_LIVE=true), keep every deployment out of search engines.
// Preview links on vercel.app must never compete with the real vehicle-focus.com.
export default function robots(): MetadataRoute.Robots {
  if (process.env.SITE_LIVE !== "true") {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/garage", "/console", "/login"] }],
    sitemap: "https://www.vehicle-focus.com/sitemap.xml",
    host: "https://www.vehicle-focus.com",
  };
}
