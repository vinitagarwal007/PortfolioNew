import "./globals.css";
import { Inter, JetBrains_Mono } from "next/font/google";
import CircuitCanvas from "./components/CircuitCanvas";
import { StructuredData } from "./structured-data";
import { siteUrl } from "@/data/site";

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

export const viewport = {
  themeColor: "#06080b",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <head>
        <StructuredData />
      </head>
      <body className={inter.className}>
        <CircuitCanvas className="site-bg" />
        {children}
      </body>
    </html>
  );
}
