import React from "react";

import "@/app/globals.css";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="bg-ocean-100 h-screen flex-1">{children}</main>;
}
