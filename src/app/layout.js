import "./globals.css";
import { Newsreader, JetBrains_Mono } from "next/font/google";
import { StructuredData } from "./structured-data";
import { siteUrl } from "@/data/site";

const serif = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

// Runs before first paint: stored choice first, then the OS preference. With
// no stored choice it keeps following the OS live. Exposes window.__setTheme
// for the header toggle. Hex values mirror --bg in globals.css.
const themeScript = `(function(){var d=document.documentElement,m=matchMedia("(prefers-color-scheme: light)"),c={dark:"#0B0C0E",light:"#F6F5F1"};function stored(){try{var t=localStorage.getItem("theme");return t==="light"||t==="dark"?t:null}catch(e){return null}}function apply(){var t=stored()||(m.matches?"light":"dark");d.setAttribute("data-theme",t);var e=document.querySelector('meta[name="theme-color"]');if(e)e.setAttribute("content",c[t])}window.__setTheme=function(t){try{localStorage.setItem("theme",t)}catch(e){}apply()};apply();m.addEventListener("change",apply)})();`;

const title = "Vinit Agarwal — Distributed Systems Engineer, Bangalore";
const description =
  "Vinit Agarwal is a backend and distributed systems engineer in Bangalore. He designs and owns systems end to end — architecture through production — that stay correct at scale and affordable to run, handling 10M+ interactions a day across 9 services.";
const preview =
  "https://res.cloudinary.com/drpl5yzbd/image/upload/v1723167988/unnamed_pwesqj.jpg";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Vinit Agarwal",
  },
  description,
  applicationName: "Vinit Agarwal — Portfolio",
  category: "technology",
  keywords: [
    "Vinit Agarwal",
    "Vinit Agarwal Bangalore",
    "Vinit Agarwal engineer",
    "Bangalore developer",
    "Bangalore backend developer",
    "distributed systems engineer",
    "distributed systems engineer India",
    "backend engineer Bangalore",
    "Python backend developer Bangalore",
    "software engineer Bangalore",
    "FastAPI developer",
    "Django developer India",
    "system design engineer",
    "Celery",
    "Redis",
    "Kubernetes",
    "event-driven architecture",
  ],
  authors: [{ name: "Vinit Agarwal", url: siteUrl }],
  creator: "Vinit Agarwal",
  publisher: "Vinit Agarwal",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title,
    description,
    type: "profile",
    firstName: "Vinit",
    lastName: "Agarwal",
    url: siteUrl,
    siteName: "Vinit Agarwal",
    locale: "en_IN",
    images: [
      {
        url: preview,
        secureUrl: preview,
        width: 1200,
        height: 630,
        alt: "Vinit Agarwal — Distributed Systems Engineer, Bangalore",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [preview],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Rendered by hand rather than via `viewport.themeColor` so the
            inline script can point it at an explicit user choice. */}
        <meta name="theme-color" content="#0B0C0E" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <StructuredData />
      </head>
      <body>{children}</body>
    </html>
  );
}
