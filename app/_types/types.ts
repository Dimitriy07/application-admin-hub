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
};

// VERIFICATION TOKEN

export interface VerificationToken extends WithId<Document> {
  email: string;
  token: string;
  expires: Date;
}

//FORM ELEMENTS

export type FormElement =
  | {
      type: "label";
      content: string;
      for: string;
    }
  | {
      type: "input" | "email" | "password";
      placeholder?: string;
      id: string;
      name: string;
    }
  | {
      type: "select";
      options: Array<{ value: string; content: string }>;
      name: string;
      id: string;
    };

export type FormConfig = FormElement[];

// export interface RegisterForm {
//   name: string;
//   email: string;
//   id: string;
//   password: string;
//   userRole: string;
// }
