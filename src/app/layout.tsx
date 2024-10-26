import type { Metadata } from "next";

import "./globals.css";

import { PrimeReactProvider } from "primereact/api";
import Navbar from '../../shared/components/navbar/navbar';
import { AdminProvider } from "@/context/AdminContext";
import { type Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
export const metadata: Metadata = {
  title: "ShopSmart",
  description: 'ShopSmart is a advanced application which helps to screen through the all the stores and give you the best price for what you want',
  keywords: "shopsmart, store, price, screen, filter, sort",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AdminProvider>
          <PrimeReactProvider>
            <SessionProvider>
            <Navbar />
            <div className="p-2 surface-ground">{children}</div>
            </SessionProvider>
            
          </PrimeReactProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
