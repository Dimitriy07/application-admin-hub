import SideNavigationContainer from "@/app/_components/SideNavigationContainer";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid grid-cols-[10rem_1fr] h-full ">
      <aside>
        <SideNavigationContainer />
      </aside>
      <div className="">{children}</div>
    </div>
  );
}
