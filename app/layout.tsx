import type { Metadata } from "next";
import { Noto_Serif_KR, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSerif = Noto_Serif_KR({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const notoSans = Noto_Sans_KR({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Sermon Webpage",
  description: "Church Sermon Archive",
};

import { AuthProvider } from "@/components/AuthProvider";
import FloatingNav from "@/components/FloatingNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${notoSerif.variable} ${notoSans.variable} antialiased font-sans`}
      >
        <AuthProvider>
          {children}
          <FloatingNav />
        </AuthProvider>
      </body>
    </html>
  );
}
