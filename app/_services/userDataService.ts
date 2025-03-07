import { DB_RESOURCES_NAME } from "@/app/_constants/mongodb-config";
import { fetchUserFromDb } from "@/app/_lib/userData";
import { User } from "@/app/_types/types";

export async function getUserFromDb(email: string, password: string) {
  const USER_COLLECTION = "users";
  const getUser = fetchUserFromDb(DB_RESOURCES_NAME, USER_COLLECTION);

  const fetchedUser = await getUser(email);
  if (!fetchedUser) throw new Error("User is not found");
  const user: User = {
    password: fetchedUser.password,
    email: fetchedUser.email,
    id: fetchedUser._id.toString(),
    role: fetchedUser.role,
  };
  if (user && user?.password === password) {
    return user;
  } else throw new Error("Password invalid");
}
