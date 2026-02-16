import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/super-admin",
          "/api/",
          "/checkout/",
          "/_next/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/admin",
          "/super-admin",
          "/api/",
        ],
      },
    ],
    sitemap: "https://tol.ar/sitemap.xml",
    host: "https://tol.ar",
  }
}
