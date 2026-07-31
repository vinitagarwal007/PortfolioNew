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
      url: `${siteUrl}/throttle`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.7,
    },
  ];
}
