import React from "react";

import "@/app/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col">
        <main className="bg-ocean-100 h-screen flex-1">{children}</main>
      </body>
    </html>
  );
}
