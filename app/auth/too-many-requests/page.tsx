import TooManyRequests from "@/app/_components/TooManyRequests";
import { rateLimitCheck } from "@/app/_utils/ratelimit";
import { DEFAULT_LOGIN_REDIRECT } from "@/app/routes";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function TooManyRequestsPage() {
  const ip = (await headers()).get("x-forwarded-for");
  if (!ip) return null;

  const rate = rateLimitCheck(ip);
  console.log(rate);
  // console.log(ip);
  const { blockedUntil, allowed } = rate;
  console.log(blockedUntil, allowed);
  if (allowed) {
    return redirect(DEFAULT_LOGIN_REDIRECT);
  }
  let nextAttemptAt;
  if (blockedUntil) {
    nextAttemptAt = new Date(blockedUntil).toLocaleTimeString();
  }
  return <TooManyRequests nextAttemptAt={nextAttemptAt} />;
}
