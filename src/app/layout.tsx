import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/navbar";
import { Toaster } from "sonner";
import NextAuthProvider from "@/components/provider/next-auth-provider";
import ReactQueryProvider from "@/components/provider/react-query-provider";
import { Suspense } from "react";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Orpheon",
  description: "Revolutionize Your Music with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} antialiased`}>
        <Toaster />
        <NextAuthProvider>
          <ReactQueryProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <Navbar />
              {children}
            </Suspense>
          </ReactQueryProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
