/* eslint-disable @typescript-eslint/no-explicit-any */

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
