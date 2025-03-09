"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/app/_services/userDataService";
import {
  generateVerificationToken,
  getVerificationTokenByTokenId,
} from "./tokenDataService";
import { sendVerificationEmail } from "@/app/_lib/mail";
import util from "util";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const existingUser = await getUserByEmail(email, password);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "User doesn't exist!" };
  }
  console.log("!!!!!*****Existing user " + existingUser);
  if (!existingUser.emailVerified) {
    const verificationTokenId = await generateVerificationToken(
      existingUser.email
    );
    const verificationToken = await getVerificationTokenByTokenId(
      verificationTokenId.insertedId.toString()
    );
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Confirmation email sent!" };
  }
  try {
    await signIn("credentials", { email, password, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CallbackRouteError":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    // important to throw an error
    throw error;
  }
}

// 2000-01-01T00:00:00Z

// "emailVerified": {
//   "$date": "1970-01-01T00:00:00Z"
// }
