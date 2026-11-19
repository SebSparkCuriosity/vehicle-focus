import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/garage", "/console", "/login"] }],
    sitemap: "https://www.vehicle-focus.com/sitemap.xml",
    host: "https://www.vehicle-focus.com",
  };
}
