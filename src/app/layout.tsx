import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StoreProvider from "@/providers/StoreProvider";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/web/navbar/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Messenger",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <main>
            <Navbar />
            {children}
          </main>
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}
