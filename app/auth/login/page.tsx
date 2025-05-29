import LoginForm from "@/app/_components/LoginForm";
import { headers } from "next/headers";

export default async function LoginPage() {
  const ip = (await headers()).get("x-forwarded-for");
  if (!ip) return null;
  return (
    <div className="flex flex-col items-center justify-center  mx-auto h-full">
      <LoginForm ip={ip} />
    </div>
  );
}
