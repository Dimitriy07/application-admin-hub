import { redirect } from "next/navigation";
import { DB_COLLECTION_LEVEL1 } from "@/app/_constants/mongodb-config";

export default function Page() {
  return redirect(`/${DB_COLLECTION_LEVEL1}`);
}
