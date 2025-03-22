import { v4 as uuidv4 } from "uuid";
import { DB_AUTHENTICATION_NAME } from "@/app/_constants/mongodb-config";
import { VerificationToken } from "@/app/_types/types";
import {
  createTokenInDb,
  deleteTokenInfoFromDb,
  fetchTokenInfoFromDb,
} from "@/app/_lib/data/token-data";
// import util from "util";

const VERIFICATION_TOKEN_COLLECTION = "verification-token";

export async function getVerificationTokenByEmail(email: string) {
  const getVerificationToken = fetchTokenInfoFromDb(
    DB_AUTHENTICATION_NAME,
    VERIFICATION_TOKEN_COLLECTION
  );

  const fetchedToken = await getVerificationToken(email, "email");

  if (!fetchedToken) return null;

  return fetchedToken;
}

export async function getVerificationTokenByTokenId(id: string) {
  const getVerificationToken = fetchTokenInfoFromDb(
    DB_AUTHENTICATION_NAME,
    VERIFICATION_TOKEN_COLLECTION
  );

  const fetchedToken = await getVerificationToken(id, "id");

  if (!fetchedToken) throw new Error("There is no verification token");

  return fetchedToken;
}

export async function getVerificationTokenByToken(token: string) {
  const getVerificationToken = fetchTokenInfoFromDb(
    DB_AUTHENTICATION_NAME,
    VERIFICATION_TOKEN_COLLECTION
  );

  const fetchedToken = await getVerificationToken(token, "token");

  if (!fetchedToken) throw new Error("There is no verification token");

  return fetchedToken;
}

export async function deleteVerificationTokenById(id: string) {
  const deleteToken = deleteTokenInfoFromDb(
    DB_AUTHENTICATION_NAME,
    VERIFICATION_TOKEN_COLLECTION
  );
  await deleteToken(id);
}

export async function generateVerificationToken(email: string) {
  const EXPIRY_TIME = 3600 * 1000;
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + EXPIRY_TIME);

  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await deleteVerificationTokenById(existingToken._id.toString());
  }
  const createNewToken = createTokenInDb(
    DB_AUTHENTICATION_NAME,
    VERIFICATION_TOKEN_COLLECTION
  );
  const verificationToken = await createNewToken({
    email,
    token,
    expires,
  } as VerificationToken & Document);
  return verificationToken;
}
