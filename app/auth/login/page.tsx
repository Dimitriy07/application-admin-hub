import LoginForm from "@/app/_components/LoginForm";
import { rateLimitCheck } from "@/app/_utils/ratelimit";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const ip = (await headers()).get("x-forwarded-for") ?? "local";
  const rate = await rateLimitCheck(ip, false);
  if (!ip) return null;
  if (!rate.allowed && rate.blockedUntil && Date.now() < rate.blockedUntil) {
    redirect("/auth/too-many-requests");
  }
  return (
    <div className="flex flex-col items-center justify-center  mx-auto h-full">
      <LoginForm ip={ip} />
    </div>
  );
}
