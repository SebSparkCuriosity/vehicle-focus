import type { MetadataRoute } from "next";

const BASE = "https://www.vehicle-focus.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number; changeFrequency: "monthly" | "yearly" }[] = [
    { path: "", priority: 1, changeFrequency: "monthly" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    { path: "/membership", priority: 0.9, changeFrequency: "monthly" },
    { path: "/the-garage", priority: 0.8, changeFrequency: "monthly" },
    { path: "/readiness", priority: 0.8, changeFrequency: "monthly" },
    { path: "/advisers", priority: 0.7, changeFrequency: "monthly" },
    { path: "/about", priority: 0.6, changeFrequency: "yearly" },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
  ];
  const lastModified = new Date();
  return pages.map((p) => ({ url: `${BASE}${p.path}`, lastModified, changeFrequency: p.changeFrequency, priority: p.priority }));
}
