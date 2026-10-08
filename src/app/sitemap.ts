import type { MetadataRoute } from "next";
import { brand } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: brand.siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${brand.siteUrl}/shop`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${brand.siteUrl}/track`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
