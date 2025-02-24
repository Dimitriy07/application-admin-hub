import SideNavigation from "@/app/_components/SideNavigation";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid grid-cols-[10rem_1fr] h-full gap-6">
      <aside>
        <SideNavigation />
      </aside>
      <div className="py-1">{children}</div>
    </div>
  );
}
