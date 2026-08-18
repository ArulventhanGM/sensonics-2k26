import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SoundProvider } from '@/components/SoundProvider';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "SENSONICS '26 — Department of Electronics & Instrumentation",
  description:
    "Sensonics 2026 is a premier technical symposium by the Department of Electronics & Instrumentation. Explore 8 precision engineering and strategic challenges — 4 Technical and 4 Non-Technical events.",
  keywords: [
    "Sensonics",
    "Electronics",
    "Instrumentation",
    "Technical Symposium",
    "College Fest",
    "2026",
    "Robotics",
    "Hackathon",
    "BGMI",
    "Esports",
  ],
  openGraph: {
    title: "SENSONICS '26 — Where Electronics Meets Experience",
    description:
      "A celebration of technology, creativity, competition and innovation. 8 events, ₹1,00,000+ prize pool.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} scroll-smooth`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className="noise-bg background-cinematic min-h-screen">
        <SoundProvider>{children}</SoundProvider>
      </body>
    </html>
  );
}
