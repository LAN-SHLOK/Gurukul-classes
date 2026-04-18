import { MetadataRoute } from "next";

const BASE = "https://gurukulclasses.in";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE,                  lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/courses`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/faculty`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/events`,      lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/admissions`,  lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/contact`,     lastModified: new Date(), changeFrequency: "yearly",  priority: 0.7 },
    { url: `${BASE}/about`,       lastModified: new Date(), changeFrequency: "yearly",  priority: 0.6 },
    { url: `${BASE}/schedule`,    lastModified: new Date(), changeFrequency: "daily",   priority: 0.8 },
  ];
}
