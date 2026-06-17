import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { ThemeProvider } from "@/components/theme-provider";
import StoreProvider from "@/store/StoreProvider";
import { Toaster } from "react-hot-toast";

import { ModalProvider } from "@/components/ModalProvider";

export const metadata: Metadata = {
  title: "WhereIsMySlot",
  description: "Social and business discovery platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>
            <ModalProvider>
              {children}
            </ModalProvider>
            <Toaster 
              position="top-center"
              toastOptions={{
                style: {
                  background: '#333',
                  color: '#fff',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                },
                success: {
                  iconTheme: {
                    primary: '#facc15',
                    secondary: '#333',
                  },
                },
              }}
            />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
