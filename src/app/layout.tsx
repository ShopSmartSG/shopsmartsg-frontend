import type { Metadata } from "next";

import "./globals.css";

import { PrimeReactProvider } from "primereact/api";
import Navbar from '../../shared/components/navbar/navbar';


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
        <PrimeReactProvider>
          <Navbar />
          <div className="p-2">{children}</div>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
