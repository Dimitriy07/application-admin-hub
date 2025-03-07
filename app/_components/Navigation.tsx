import { signOut } from "@/auth";

export default function Navigation() {
  return (
    <nav className="flex justify-between px-4 py-8 bg-ocean-800 text-ocean-100">
      <div>User Info</div>
      <div>Search bar</div>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button type="submit">SignOut</button>
      </form>
    </nav>
  );
}
