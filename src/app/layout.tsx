import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { SessionProvider } from "next-auth/react";
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";
import GrainTexture from "@/components/ui/GrainTexture";
import BlobCursor from "@/components/ui/BlobCursor";
import NavigationSwipe from "@/components/ui/NavigationSwipe";
import ScrollProgress from "@/components/ui/ScrollProgress";
import BottomNav from "@/components/layout/BottomNav";
import LoadingScreen from "@/components/ui/LoadingScreen";
import LivePresence from "@/components/ui/LivePresence";
import PWARegister from "@/components/ui/PWARegister";
import AnnouncementBanner from "@/components/ui/AnnouncementBanner";
import SocketStatusIndicator from "@/components/ui/SocketStatusIndicator";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gurukulclasses.in"),
  title: {
    default: "Gurukul Classes | Premium Offline Tuition in Ahmedabad",
    template: "%s | Gurukul Classes",
  },
  description: "Gurukul Classes — Premium offline coaching in Ahmedabad for Grade 1–12, JEE & NEET. Expert faculty, proven results, small batches since 2011.",
  keywords: ["Gurukul Classes", "Coaching Ahmedabad", "JEE Coaching Ahmedabad", "NEET Coaching Ahmedabad", "Gujarat Board Tuition", "Offline Tuition Ghodasar", "Best Coaching Ahmedabad"],
  authors: [{ name: "Gurukul Classes", url: "https://gurukulclasses.in" }],
  creator: "Gurukul Classes",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://gurukulclasses.in",
    siteName: "Gurukul Classes",
    title: "Gurukul Classes | Premium Offline Tuition in Ahmedabad",
    description: "Premium offline coaching for Grade 1–12, JEE & NEET in Ahmedabad. Expert faculty, 98% result rate, since 2011.",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Gurukul Classes" }],
  },
  twitter: {
    card: "summary",
    title: "Gurukul Classes | Premium Offline Tuition in Ahmedabad",
    description: "Premium offline coaching for Grade 1–12, JEE & NEET in Ahmedabad.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${plusJakarta.variable} antialiased selection:bg-[#2D31FA] selection:text-white bg-black text-white min-h-screen`}>
        <SessionProvider>
          <SmoothScrollProvider>
            <LoadingScreen />
            <NavigationSwipe />
            <PWARegister />
            <AnnouncementBanner />
            <SocketStatusIndicator />
            <GrainTexture />
            <BlobCursor />
            <ScrollProgress />
            <LivePresence />
            <Header />
            <main className="relative z-10 pb-[72px] md:pb-0 bg-black">{children}</main>
            <div className="relative z-10 bg-black">
              <Footer />
            </div>
            <BottomNav />
          </SmoothScrollProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
