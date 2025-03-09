"use client";

import { useRouter } from "next/navigation";

function ErrorCard() {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-4 text-ocean-800 border border-ocean-800 rounded-md py-10 px-10 bg-ocean-0 shadow-xl">
      <h2 className="font-bold text-center">Error</h2>
      <div className="flex flex-col gap-1">
        <p>Something went wrong!!!</p>
      </div>

      <div>
        <button onClick={() => router.push("/login")}>Back to Login</button>
      </div>
    </div>
  );
}

export default ErrorCard;
