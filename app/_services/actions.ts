"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import {
  getUserByEmail,
  getUserByEmailAndPassword,
  updateUserById,
} from "@/app/_services/userDataService";
import {
  deleteVerificationTokenById,
  generateVerificationToken,
  getVerificationTokenByToken,
  getVerificationTokenByTokenId,
} from "./tokenDataService";
import { sendVerificationEmail } from "@/app/_lib/mail";

/////////LOGIN SERVER ACTION//////////

export async function login(email: string, password: string) {
  const existingUser = await getUserByEmailAndPassword(email, password);
  if ("error" in existingUser) return { error: existingUser.error };
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "User doesn't exist!" };
  }
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
    throw error;
  }
}

export async function newVerification(token: string) {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) return { error: "Token does not exist!" };
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return { error: "Token has expired!" };
  const existingUser = await getUserByEmail(existingToken.email);

  const updatedObj = {
    emailVerified: { date: new Date() },
    email: existingToken.email,
  };

  if (!existingUser.id) return { error: "Email does not exist!" };
  await updateUserById(existingUser.id, updatedObj);
  await deleteVerificationTokenById(existingToken._id.toString());
  return { success: "Email verified" };
}
