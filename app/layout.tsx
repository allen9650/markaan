import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Markaan by Ahsan Raza - Professional Local Image Watermarking",
  description: "Markaan by Ahsan Raza. Secure, local high-speed bulk watermark generator for Windows users. 100% private, no cloud uploads.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        {children}
      </body>
    </html>
  );
}
