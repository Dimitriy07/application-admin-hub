"use client";

import { DEFAULT_LOGIN_REDIRECT } from "@/app/routes";
import Button from "./Button";
import { useRouter } from "next/navigation";

function ProhibitedURLAccess() {
  const router = useRouter();
  console.error("Prohibited route");

  function onClick() {
    router.replace(DEFAULT_LOGIN_REDIRECT);
  }
  return (
    <div>
      <p>
        The URL you are trying to reach is prohibited. Go back to the home page
      </p>
      <Button onClick={onClick}>Back</Button>
    </div>
  );
}

export default ProhibitedURLAccess;
