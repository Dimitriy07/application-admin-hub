/* eslint-disable @typescript-eslint/no-explicit-any */
import { Document, WithId } from "mongodb";
import {
  DB_REFERENCE_TO_COL1,
  DB_REFERENCE_TO_COL2,
} from "@/app/_constants/mongodb-config";

// MANAGEMENT DATA TYPE
type Settings = Record<string, any>;

export interface Item {
  readonly id: string;
  icon?: string;
  name: string;
  password?: string;
  settings?: Settings;
  role?: string;
}

export interface ItemContainerProps {
  items: Item[] | DynamicResourceItem[];
  urlPath?: string;
  resourceId?: string;
  collectionName?: string;
  refIdToCollectionLevel1?: string;
  isEdit?: string;
  isSettings?: string;
  managementId?: string;
  currentCollection?: string;
  query: string;
  userRole?: UserRole;
  refNameToCollection?: string;
}

export interface ItemRowProps {
  //items (array of objects with information from db)
  item: Item;
  // urlPath - part of url which has to be added to the url
  urlPath?: string;
  collectionName?: string;
  hasSettings: boolean;
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
  [DB_REFERENCE_TO_COL2]?: string | null;
  [DB_REFERENCE_TO_COL1]?: string;
};

export type UserRegistration = {
  refIdToCollectionLevel2: string; // reference to Id of collection 2 Level (ex. entityId)
  refIdToCollectionLevel3: string; // reference to Id of collection 3 Level (ex. accountId)
  name: string;
  email: string;
  password: string;
  role: UserRole;
  confirm: Readonly<string>;
};

// VERIFICATION TOKEN

export interface VerificationToken extends WithId<Document> {
  email: string;
  token: string;
  expires: Date;
}

//FORM ELEMENTS

export type ConditionalFieldConfig = {
  when: { field: string; value: string };
  fields: Record<string, FormElementType>;
};

type BaseFormElement = {
  id: string;
  name: string;
  labelName: string;
  placeholder?: string;
};

type SelectElement = BaseFormElement & {
  type: "select";
  options: ReadonlyArray<{ value: string; content: string }>;
};

type InputElement = BaseFormElement & {
  type: "text" | "email" | "password" | "number";
  min?: number;
  max?: number;
};

export type FormElementType = InputElement | SelectElement;

export type FormConfig = Record<string, FormElementType>;

export type FormConfigWithConditions = FormConfig & {
  conditionalFields?: ConditionalFieldConfig[];
};

// APP CONFIGURATIONS

export type RestrictionResult = {
  isRestricted: boolean;
  restrictedMessage?: string;
};

export type RestrictionLogicArgs = {
  collectionName: string;
  settings: Record<string, any>;
  resourcesArr: any[];
};

export type RestrictionLogicFn = (
  args: RestrictionLogicArgs
) => RestrictionResult;

export type AppSettingsFields = Record<string, any>;
export type AppResourceFields = Record<string, any>;

export type AppConfig = {
  id: string;
  // name: string;
  urlSlug: string;
  settings: AppSettingsFields;
  resourceConfig: AppResourceFields;
  restrictionLogic?: (...args: any[]) => any;
};
