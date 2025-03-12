import React from "react";

import BreadcrumbsNav from "@/app/_components/BreadcrumbsNav";
import Button from "@/app/_components/Button";
import Navigation from "@/app/_components/Navigation";
import ToolboxBar from "@/app/_components/ToolboxBar";

import "@/app/globals.css";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
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
        <main className="bg-ocean-100 h-screen flex-1">{children}</main>
        <ToolboxBar>
          <Button>Add</Button>
        </ToolboxBar>
      </SessionProvider>
    </>
  );
}
