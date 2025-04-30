import { auth } from "@/auth";
import UserNavigation from "./UserNavigation";
import SearchInput from "./SearchInput";

export default async function Navigation() {
  const session = await auth();
  return (
    <nav className="flex justify-between px-4 py-2 bg-ocean-800 text-ocean-100 items-center">
      <div>Application Logo</div>
      <SearchInput />
      <UserNavigation userName={session?.user?.name} />
    </nav>
  );
}
