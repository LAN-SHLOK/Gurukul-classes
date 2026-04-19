import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/staff", "/dashboard", "/api/"],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL ? `https://${process.env.NEXT_PUBLIC_SITE_URL}` : process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://gurukul-classes-bice.vercel.app"}/sitemap.xml`,
  };
}
