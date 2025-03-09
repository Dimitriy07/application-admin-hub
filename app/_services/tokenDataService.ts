import { v4 as uuidv4 } from "uuid";
import { DB_RESOURCES_NAME } from "@/app/_constants/mongodb-config";
import {
  createUserInfoInDb,
  deleteUserInfoFromDb,
  fetchUserInfoFromDb,
} from "@/app/_lib/data/user-data";
import { VerificationToken } from "@/app/_types/types";

const VERIFICATION_TOKEN_COLLECTION = "verification-token";

export async function getVerificationTokenByEmail(email: string) {
  const getVerificationToken = fetchUserInfoFromDb(
    DB_RESOURCES_NAME,
    VERIFICATION_TOKEN_COLLECTION
  );

  const fetchedToken = await getVerificationToken(email, "email");

  if (!fetchedToken) throw new Error("There is no verification token");

  return fetchedToken;
}

export async function getVerificationTokenByToken(token: string) {
  const getVerificationToken = fetchUserInfoFromDb(
    DB_RESOURCES_NAME,
    VERIFICATION_TOKEN_COLLECTION
  );

  const fetchedToken = await getVerificationToken(token, "token");

  if (!fetchedToken) throw new Error("There is no verification token");

  return fetchedToken;
}

export async function generateVerificationToken(email: string) {
  const EXPIRY_TIME = 3600 * 1000;
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + EXPIRY_TIME);

  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    const deleteToken = deleteUserInfoFromDb(
      DB_RESOURCES_NAME,
      VERIFICATION_TOKEN_COLLECTION
    );
    await deleteToken(existingToken.id);
  }
  const createNewToken = createUserInfoInDb(
    DB_RESOURCES_NAME,
    VERIFICATION_TOKEN_COLLECTION
  );
  const verificationToken = createNewToken({
    email,
    token,
    expires,
  } as VerificationToken & Document);
  return verificationToken;
}
