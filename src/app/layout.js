import hero from "../../public/hero/hero.png";
import "./globals.css";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  openGraph: {
    title: "Vinit Agarwal | Portfolio",
    description: "Portfolio for Vinit Agarwal",
    images: [
      {
        url: "https://res.cloudinary.com/drpl5yzbd/image/upload/v1723167988/unnamed_pwesqj.jpg",
        secureUrl:
          "https://res.cloudinary.com/drpl5yzbd/image/upload/v1723167988/unnamed_pwesqj.jpg",
        width: 1200,
        height: 630,
        alt: "Preview image for Portfolio",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100&family=Roboto:wght@100&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
