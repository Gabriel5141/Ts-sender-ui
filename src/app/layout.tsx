import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { Providers } from "./providers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TSender",
  description: "TSender",
};

export default function RootLayout(props: {children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {props.children}

        </Providers>
        
      </body>
    </html>
  );
}
