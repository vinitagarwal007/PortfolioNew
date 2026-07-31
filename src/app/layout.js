import "./globals.css";
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

const title = "Vinit Agarwal — Distributed Systems Engineer";
const description =
  "Backend engineer building distributed communication infrastructure at scale — 10M+ API calls a day across 9 services, with 8+ provider integrations normalised behind one plug-and-play framework.";
const preview =
  "https://res.cloudinary.com/drpl5yzbd/image/upload/v1723167988/unnamed_pwesqj.jpg";

export const metadata = {
  metadataBase: new URL("https://vinitagarwal.vercel.app"),
  title,
  description,
  keywords: [
    "Vinit Agarwal",
    "distributed systems",
    "backend engineer",
    "Python",
    "FastAPI",
    "Django",
    "Celery",
    "Redis",
    "Kubernetes",
  ],
  authors: [{ name: "Vinit Agarwal" }],
  openGraph: {
    title,
    description,
    type: "website",
    images: [
      {
        url: preview,
        secureUrl: preview,
        width: 1200,
        height: 630,
        alt: "Vinit Agarwal — Distributed Systems Engineer",
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

export const viewport = {
  themeColor: "#06080b",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
