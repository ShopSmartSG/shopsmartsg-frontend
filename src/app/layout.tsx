import type { Metadata } from "next";

import "./globals.css";

import { PrimeReactProvider } from "primereact/api";
import Navbar from '../../shared/components/navbar/navbar';
import { AdminProvider } from "@/context/AdminContext";
import { SessionProvider as CustomSessionProvider } from "@/context/SessionContext";
import ServiceWorkerRegistration from '../../shared/components/ServiceWorkerRegistration';
export const metadata: Metadata = {
  title: "ShopSmart",
  description: 'ShopSmart is a advanced application which helps to screen through the all the stores and give you the best price for what you want',
  keywords: "shopsmart, store, price, screen, filter, sort",
};

export default async function RootLayout({
  children,
  
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body>
        <AdminProvider>
          <PrimeReactProvider>
              <Navbar />
              <ServiceWorkerRegistration />
              
              <div className="p-2 surface-ground">{children}</div>
          </PrimeReactProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
