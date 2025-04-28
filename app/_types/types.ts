/* eslint-disable @typescript-eslint/no-explicit-any */
import { Document, WithId } from "mongodb";

// MANAGEMENT DATA TYPE
type Settings = Record<string, any>;

export interface Item {
  readonly id: string;
  icon?: string;
  name: string;
  password?: string;
  settings?: Settings;
}

export interface ItemContainerProps {
  items: Item[] | DynamicResourceItem[];
  urlPath?: string;
  resourceId?: string;
  collectionName?: string;
  appId?: string;
  isEdit?: string;
  isSettings?: string;
  managementId?: string;
  currentPage?: string;
}

export interface ItemRowProps {
  //items (array of objects with information from db)
  item: Item;
  // urlPath - part of url which has to be added to the url
  urlPath?: string;
  collectionName?: string;
}

// RESOURCE DATA TYPE

export interface DynamicResourceItem {
  readonly id: string;
  name: string;
  [key: string]: string;
}

// COLLECTION DATA

export type CollectionWithInfo = {
  name: string;
  info?: { uuid?: { toString(): string } };
};

// BREADCRUMBS NAVIGATION

export interface BreadcrumbsNavProps {
  separator: string;
  homeElement: string;
  activeClass: string;
  listClass: string;
  containerClass: string;
}

// USER ROLE
export enum UserRole {
  admin = "admin",
  superadmin = "superadmin",
  user = "user",
}

// USER CREDENTIALS

export type UserSession = {
  id?: string;
  email: string;
  password: string;
  role: UserRole; //  "admin" | "superadmin" | "user";
  emailVerified: string;
  name?: string;
};

export type UserRegistration = {
  refToIdCollection2: string; // reference to Id of collection 2 Level (ex. entityId)
  refToIdCollection3: string; // reference to Id of collection 3 Level (ex. accountId)
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

// ITEM TO ADD

export type ItemAdded = {
  refToIdCollection: string | undefined;
  name: string;
};

// VERIFICATION TOKEN

export interface VerificationToken extends WithId<Document> {
  email: string;
  token: string;
  expires: Date;
}

//FORM ELEMENTS

export type FormElementType = {
  type: "text" | "email" | "password" | "select" | "number";
  id: string;
  name: string;
  labelName: string;
  placeholder?: string;
  options?: ReadonlyArray<{ value: string; content: string }>;
  min?: number;
  max?: number;
};

export type FormConfig = Record<string, FormElementType>;
// export type FormConfig = FormElementType[];

// export interface RegisterForm {
//   name: string;
//   email: string;
//   id: string;
//   password: string;
//   userRole: string;
// }
