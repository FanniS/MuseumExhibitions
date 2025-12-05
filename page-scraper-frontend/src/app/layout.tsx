import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ['400', '700'], // Specify the weights you want to use
  subsets: ['latin'], // Specify the subsets you want to use
});

export const metadata: Metadata = {
  title: "Page scraper",
  description: "Collects and displays information",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased`} >
        {children}
      </body>
    </html>
  );
}
