"use client";

import { PropsWithChildren } from "react";

export default function Button({ children }: PropsWithChildren) {
  return (
    <button className="py-2 px-4 bg-coral-800 text-coral-100 flex items-center m-1 rounded-md">
      {children}
    </button>
  );
}
