/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DB_REFERENCE_TO_COL1,
  DB_REFERENCE_TO_COL2,
  DB_RESOURCES_NAME,
} from "@/app/_constants/mongodb-config";
import {
  fetchUserInfoFromDb,
  updateUserInfoInDb,
} from "@/app/_lib/data/user-data";
import { UserSession } from "@/app/_types/types";
import bcrypt from "bcryptjs";

export async function getUserByEmailAndPassword(
  email: string,
  password: string
) {
  const USER_COLLECTION = "users";
  const getUser = fetchUserInfoFromDb(DB_RESOURCES_NAME, USER_COLLECTION);

  const fetchedUser = await getUser(email, "email");

  if (!fetchedUser) throw new Error("User with this email wasn't found");
  const user: UserSession = {
    password: fetchedUser.password,
    email: fetchedUser.email,
    id: fetchedUser._id.toString(),
    role: fetchedUser.role,
    emailVerified: fetchedUser.emailVerified,
  };
  const verifiedPassword = await bcrypt.compare(password, user.password);
  if (verifiedPassword) {
    return user;
  } else return { error: "Invalid Password" };
}

// TO USE FOR CHECKING IF WE HAVE THE SAME EMAIL IN THE DB
export async function getUserByEmail(email: string) {
  const USER_COLLECTION = "users";
  const getUser = fetchUserInfoFromDb(DB_RESOURCES_NAME, USER_COLLECTION);

  const fetchedUser = await getUser(email, "email");

  if (!fetchedUser) {
    return { error: "User with this email wasn't found" };
  }
  const user: UserSession = {
    password: fetchedUser.password,
    email: fetchedUser.email,
    id: fetchedUser._id.toString(),
    role: fetchedUser.role,
    emailVerified: fetchedUser.emailVerified,
  };
  return user;
}

// AS ID IS INDEXED TO REDUCE THE WORKLOAD ON DB
export async function getUserById(id: string) {
  const USER_COLLECTION = "users";
  const getUser = fetchUserInfoFromDb(DB_RESOURCES_NAME, USER_COLLECTION);

  const fetchedUser = await getUser(id, "id");
  if (!fetchedUser) throw new Error("User with this ID wasn't found");
  const user: UserSession = {
    password: fetchedUser.password,
    email: fetchedUser.email,
    id: fetchedUser._id.toString(),
    role: fetchedUser.role,
    emailVerified: fetchedUser.emailVerified,
    name: fetchedUser.name,
    [DB_REFERENCE_TO_COL2]: fetchedUser[DB_REFERENCE_TO_COL2],
    [DB_REFERENCE_TO_COL1]: fetchedUser[DB_REFERENCE_TO_COL1],
  };

  return user;
}

export async function updateUserById(id: string, updatedObj: any) {
  const USER_COLLECTION = "users";
  const updateUser = updateUserInfoInDb(DB_RESOURCES_NAME, USER_COLLECTION);

  const updatedUser = await updateUser(id, updatedObj);
  if (!updatedUser) throw new Error("User with this ID wasn't found");
  return updatedUser;
}
