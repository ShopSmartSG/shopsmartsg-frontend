import type { Metadata } from "next";

import "./globals.css";

import { PrimeReactProvider } from "primereact/api";
import Navbar from '../../shared/components/navbar/navbar';
import { AdminProvider } from "@/context/AdminContext";
import { getSession } from "@/lib";
import { SessionProvider as CustomSessionProvider } from "@/context/SessionContext";
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
  const session = await getSession();
 

  return (
    <html lang="en">
      <body>
        <AdminProvider>
          <PrimeReactProvider>
            <CustomSessionProvider session={session}>
              <Navbar />
              
              <div className="p-2 surface-ground">{children}</div>
            </CustomSessionProvider>
          </PrimeReactProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
