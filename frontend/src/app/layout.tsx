import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../utils/Providers";

export const metadata: Metadata = {
  title: "Task-App",
  description: "Created by Avis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
