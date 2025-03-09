import { DB_RESOURCES_NAME } from "@/app/_constants/mongodb-config";
import { fetchUserInfoFromDb } from "@/app/_lib/data/user-data";
import { UserSession } from "@/app/_types/types";

export async function getUserByEmail(email: string, password: string) {
  const USER_COLLECTION = "users";
  const getUser = fetchUserInfoFromDb(DB_RESOURCES_NAME, USER_COLLECTION);

  const fetchedUser = await getUser(email, "email");

  if (!fetchedUser) throw new Error("User is not found (wrong email)");
  const user: UserSession = {
    password: fetchedUser.password,
    email: fetchedUser.email,
    id: fetchedUser._id.toString(),
    role: fetchedUser.role,
  };
  if (user?.password === password) {
    return user;
  } else throw new Error("Password invalid");
}

export async function getUserById(id: string) {
  const USER_COLLECTION = "users";
  const getUser = fetchUserInfoFromDb(DB_RESOURCES_NAME, USER_COLLECTION);

  const fetchedUser = await getUser(id, "id");
  if (!fetchedUser) throw new Error("User is not found (wrong )");
  const user: UserSession = {
    password: fetchedUser.password,
    email: fetchedUser.email,
    id: fetchedUser._id.toString(),
    role: fetchedUser.role,
  };

  return user;
}
