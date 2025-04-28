import { auth } from "@/auth";
import UserNavigation from "./UserNavigation";

export default async function Navigation() {
  const session = await auth();
  return (
    <nav className="flex justify-between px-4 py-2 bg-ocean-800 text-ocean-100 items-center">
      <div>User Info</div>
      <div>Search bar</div>

      <UserNavigation userName={session?.user?.name} />
    </nav>
  );
}
