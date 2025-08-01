"use server";

import { signIn, signOut } from "../../auth"; // keep ../../ - for jest
import { AuthError } from "next-auth";
import {
  getUserByEmail,
  getUserByEmailAndPassword,
  updateUserById,
} from "@/app/_services/data-service/userDataService";
import {
  deleteVerificationTokenById,
  generateVerificationToken,
  getVerificationTokenByToken,
  getVerificationTokenByTokenId,
} from "./data-service/tokenDataService";
import { sendVerificationEmail } from "@/app/_lib/mail";
import { UserRegistration } from "@/app/_types/types";
import {
  createResourceItem,
  deleteResourceItem,
  updateResourceItem,
} from "./data-service/resourcesDataService";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import {
  createManagementItem,
  deleteManagementItem,
  updateManagementItem,
} from "./data-service/managementDataService";
import { redirect } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/app/routes";
import { rateLimitCheck } from "@/app/_utils/ratelimit";
import {
  DB_REFERENCE_TO_COL2,
  DB_REFERENCE_TO_COL3,
} from "@/app/_constants/mongodb-config";

/////////LOGIN SERVER ACTION//////////

export async function login(email: string, password: string, ip: string) {
  const rate = await rateLimitCheck(ip, true);
  if (!rate.allowed) {
    redirect("/auth/too-many-requests");
  }
  const existingUser = await getUserByEmailAndPassword(email, password);
  if ("error" in existingUser) return { error: existingUser.error };
  if (
    !existingUser ||
    !existingUser.email ||
    !existingUser.password ||
    (existingUser.role !== "admin" && existingUser.role !== "superadmin")
  ) {
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
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
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

export async function signOutUser() {
  try {
    await signOut();
  } catch (err) {
    throw new Error("The user isn't signed out. " + err);
  } finally {
    redirect("/auth/login");
  }
}

export async function newVerification(token: string) {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) return { error: "Token does not exist!" };
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return { error: "Token has expired!" };
  const existingUser = await getUserByEmail(existingToken.email);
  if ("error" in existingUser) {
    return { error: "User doesn't exist" };
  }

  const updatedObj = {
    emailVerified: { date: new Date() },
    email: existingToken.email,
  };

  if (!existingUser.id) return { error: "Email does not exist!" };
  await updateUserById(existingUser.id, updatedObj);
  await deleteVerificationTokenById(existingToken._id.toString());
  return { success: "Email verified" };
}

// REGISTER SERVER ACTION

export async function register(
  userFormData: UserRegistration,
  collectionName: string
): Promise<{ success: boolean; message: string } | { error: string }> {
  const { email } = userFormData;
  const existingUser = await getUserByEmail(email);
  if (!("error" in existingUser))
    return { error: "User with this email already exists." };
  const { password } = userFormData;
  if (password) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const {
        refIdToCollectionLevel2,
        refIdToCollectionLevel3,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        confirm,
        ...updatedUserObj
      } = userFormData;
      const newUserObj = {
        [DB_REFERENCE_TO_COL2]: new ObjectId(refIdToCollectionLevel2),
        [DB_REFERENCE_TO_COL3]: new ObjectId(refIdToCollectionLevel3),
        ...updatedUserObj,
        password: hashPassword,
        role: userFormData.role,
      };
      await createResourceItem(collectionName, newUserObj);
      const verificationTokenId = await generateVerificationToken(
        userFormData.email
      );
      const verificationToken = await getVerificationTokenByTokenId(
        verificationTokenId.insertedId.toString()
      );
      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
      );
      return { success: true, message: "Verification email was sent" };
    } catch (err) {
      return {
        error: err as string,
        message: "Something went wrong during Registration Process",
      };
    }
  } else {
    try {
      const {
        refIdToCollectionLevel2,
        refIdToCollectionLevel3,
        ...updatedUserObj
      } = userFormData;
      const newUserObj = {
        [DB_REFERENCE_TO_COL2]: new ObjectId(refIdToCollectionLevel2),
        [DB_REFERENCE_TO_COL3]: new ObjectId(refIdToCollectionLevel3),
        ...updatedUserObj,
        role: userFormData.role,
      };

      await createResourceItem(collectionName, newUserObj);
      return { success: true, message: "User is added" };
    } catch (err) {
      return {
        error: err as string,
        message: "Something went wrong during Registration Process",
      };
    }
  }
}

export async function addItem(
  formData: Record<string, string>,
  collectionName: string | undefined | null,
  refNameToCollection: string,
  isResource: boolean
) {
  if (!collectionName) return { error: "Collection name is not provided" };
  const newItemObj = {
    name: formData.name,
    [refNameToCollection]: new ObjectId(formData.refIdToCollection),
  };
  try {
    if (isResource) await createResourceItem(collectionName, newItemObj);
    else await createManagementItem(collectionName, newItemObj);
    return { success: true, message: "Item added to database!" };
  } catch (err) {
    throw new Error("Item hasn't been added to database: " + err);
  }
}

type WithPassword = { password?: string };

export async function updateItem<T>(
  formData: T,
  collectionName: string,
  itemId: string,
  isResource = true
) {
  if (!collectionName || !itemId)
    return { error: "Collection or itemId name is not provided" };
  try {
    if (isResource) {
      let updatedObj = formData;
      if ((formData as WithPassword).password) {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(
          (formData as WithPassword).password!,
          salt
        );
        updatedObj = { ...formData, password: hashPassword };
      }
      await updateResourceItem(collectionName, itemId, updatedObj);
    } else {
      await updateManagementItem(collectionName, itemId, formData);
    }
    return { success: true, message: "Item was updated in database" };
  } catch (err) {
    return { error: "Item wasn't updated in database: " + err };
  }
}

export async function deleteItem(
  collectionName: string,
  itemId: string,
  referenceToCol: string | undefined,
  isResource = true
) {
  if (!collectionName || !itemId)
    return { error: "Collection or itemId name is not provided" };
  // try {
  let result;
  if (isResource) {
    result = await deleteResourceItem(collectionName, itemId);
  } else {
    result = await deleteManagementItem(collectionName, itemId, referenceToCol);
  }
  return result;
  // } catch (err) {
  //   return { error: "Item wasn't deleted: " + err };
  // }
}
