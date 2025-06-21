/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getUserByEmailAndPassword } from "@/app/_services/data-service/userDataService";

// export const runtime = "nodejs"; // Force Node.js runtime

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 }
      );
    }

    const user = await getUserByEmailAndPassword(email, password);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
