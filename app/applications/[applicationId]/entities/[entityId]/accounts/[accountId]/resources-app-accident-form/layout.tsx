import SideNavigationContainer from "@/app/_components/SideNavigationContainer";
import { DB_REFERENCE_TO_COL1 } from "@/app/_constants/mongodb-config";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ [key in typeof DB_REFERENCE_TO_COL1]: string }>;
}) {
  const resolvedParams = await params;
  const refIdToCollectionLevel1 = resolvedParams[DB_REFERENCE_TO_COL1];
  return (
    <div className="grid grid-cols-[10rem_1fr] h-full">
      <aside>
        <SideNavigationContainer
          refIdToCollectionLevel1={refIdToCollectionLevel1}
        />
      </aside>
      <div className="">{children}</div>
    </div>
  );
}
