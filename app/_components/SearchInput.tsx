"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FormElement from "./FormElement";

function SearchInput() {
  const searchParams = useSearchParams();
  const path = usePathname();
  const router = useRouter();

  function handleSearch(query: string) {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }
    router.replace(`${path}?${params.toString()}`);
  }

  return (
    <div className="flex items-center justify-center gap-1">
      <FormElement
        key={path}
        type="input"
        placeholder="Search..."
        id="search"
        className="text-ocean-800"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("query")?.toString()}
      />
    </div>
  );
}

export default SearchInput;
