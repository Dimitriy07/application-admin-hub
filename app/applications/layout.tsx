import React from "react";

import BreadcrumbsNav from "@/app/_components/BreadcrumbsNav";
import Navigation from "@/app/_components/Navigation";
import ToolboxBar from "@/app/_components/ToolboxBar";

import "@/app/globals.css";
import { SessionProvider } from "next-auth/react";
import ToolboxButtons from "@/app/_components/ToolboxButtons";

export default async function RootLayout({
  children,
  // searchParams,
  params,
}: Readonly<{
  children: React.ReactNode;
  // searchParams: Promise<{ resourceType?: string; resourceId: string }>;
  params: Promise<{ accountId: string; entityId: string; appId: string }>;
}>) {
  // const resolvedSearchParams = await searchParams;
  const resolvedParams = await params;
  const { appId, entityId, accountId } = resolvedParams;
  console.log(entityId);
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
          <ToolboxButtons
            refToIdCollection1={appId}
            refToIdCollection2={entityId}
            refToIdCollection3={accountId}
          />
        </ToolboxBar>
      </SessionProvider>
    </>
  );
}
