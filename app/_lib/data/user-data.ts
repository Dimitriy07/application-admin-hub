/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectId } from "mongodb";
import { dbConnect } from "../../_utils/db-connector";

export function fetchUserInfoFromDb(dbName: string, collectionName: string) {
  return async function fetchUserDoc(filterItem: string, label: string) {
    if (!filterItem) return null;

    const collection = await dbConnect(dbName, collectionName);
    let data;
    if (label === "id") {
      const filteredId = new ObjectId(filterItem);
      data = await collection.findOne({
        _id: filteredId,
      });
      return data;
    }
    data = await collection.findOne({
      [label]: filterItem,
    });

    return data;
  };
}

export function deleteUserInfoFromDb(dbName: string, collectionName: string) {
  return async function deleteUserDoc(filterItem: string) {
    if (!filterItem) return null;

    const collection = await dbConnect(dbName, collectionName);
    const filteredId = new ObjectId(filterItem);
    const data = await collection.deleteOne({
      _id: filteredId,
    });
    return data;
  };
}

export function createUserInfoInDb(dbName: string, collectionName: string) {
  return async function createUserDoc<T extends Document>(createDocObj: T) {
    const collection = await dbConnect(dbName, collectionName);
    const data = await collection.insertOne(createDocObj);
    return data;
  };
}

export function updateUserInfoInDb(dbName: string, collectionName: string) {
  return async function updateUserDoc(id: string, updateDocObj: any) {
    const collection = await dbConnect(dbName, collectionName);
    const filteredId = new ObjectId(id);
    const data = await collection.updateOne(
      { _id: filteredId },
      { $set: updateDocObj }
    );
    return data;
  };
}
