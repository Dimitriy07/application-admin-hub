"use client";

import { DEFAULT_LOGIN_REDIRECT } from "@/app/routes";
import Button from "./Button";
import Link from "next/link";

function ProhibitedURLAccess() {
  console.error("Prohibited route");

  return (
    <div>
      <p>
        The URL you are trying to reach is prohibited. Go back to the home page
      </p>
      <Link href={DEFAULT_LOGIN_REDIRECT}>
        <Button>Back</Button>
      </Link>
    </div>
  );
}

export default ProhibitedURLAccess;
