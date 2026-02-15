import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuickRent - Vehicle Rental Platform",
  description: "Rent vehicles quickly and easily with QuickRent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
