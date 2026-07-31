import { siteUrl } from "@/data/site";

// AI crawlers are opted in explicitly rather than left to the wildcard, so
// answer engines are unambiguously allowed to read and cite this profile.
const AI_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "Amazonbot",
  "meta-externalagent",
  "CCBot",
  "Bytespider",
  "cohere-ai",
  "DuckAssistBot",
  "YouBot",
];

export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_AGENTS, allow: "/" },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
