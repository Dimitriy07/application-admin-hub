import React from "react";
import BreadcrumbsNav from "@/app/_components/BreadcrumbsNav";
import Navigation from "@/app/_components/Navigation";
import "@/app/globals.css";
import { SessionProvider } from "next-auth/react";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SessionProvider>
        <Navigation />
        <BreadcrumbsNav
          separator="&rarr;"
          homeElement="Home"
          listClass="hover:underline mx-2 font-bold "
          activeClass="text-coral-800 pointer-events-none cursor-default"
          containerClass="flex text-ocean-800"
        />
        <main className="bg-ocean-0 flex-1">{children}</main>
      </SessionProvider>
    </>
  );
}
