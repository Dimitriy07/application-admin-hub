interface Settings{
  maxUsers?: number,
  accountType?: string,
}

export interface Item {
  id: string,
  icon?: string,
  name: string,
  password?: string,
  settings?: Settings,
}

export interface ItemContainerProps {
  items: Item[];
  urlPath: string;
}

export interface ItemRowProps {
  //items (array of objects with information from db)
  item: Item;
  // urlPath - part of url which has to be added to the url
  urlPath: string;
}
