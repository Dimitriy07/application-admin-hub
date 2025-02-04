import Navigation from "./_components/Navigation";

import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col">
        <Navigation />
        <div>breadcrumb navigation</div>
        <main className="bg-ocean-100 h-screen flex-1">{children}</main>
        
      </body>
    </html>
  );
}
