import { siteUrl } from "@/data/site";

export default function sitemap() {
  const lastModified = new Date();
  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/systems`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/throttle`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.7,
    },
  ];
}
