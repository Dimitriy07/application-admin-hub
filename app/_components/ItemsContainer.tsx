import ItemRow from "@/app/_components/ItemRow";

import { ItemContainerProps } from "@/app/_types/types";

/**
 * Props for the `ItemsContainer` component.
 *
 * @typedef {Object} ItemContainerProps
 * @property {Item[] | DynamicResourceItem[]} items - An array of items to be displayed. Each item should conform to the `Item` type.
 * @property {string} urlPath - (optional) A string representing the URL path to be appended to the base URL for navigation.
 */

/**
 * A component that renders a list of items.
 *
 * This component takes an array of items and a URL path, and maps over the items to render
 * each one using the `ItemRow` component. The `urlPath` is passed down to each `ItemRow` to
 * enable dynamic navigation.
 *
 * @param {ItemContainerProps} props - The props for the `ItemsContainer` component.
 * @param {Item[]} props.items - The array of items to render.
 * @param {string} props.urlPath - (optional) The URL path to append for navigation.
 * @returns {JSX.Element} A `ul` element containing a list of `ItemRow` components.
 */

export default function ItemsContainer({ items, urlPath }: ItemContainerProps) {
  return (
    <ul className="flex flex-col">
      {items.map((item) => (
        <ItemRow item={item} urlPath={urlPath} key={item.id} />
      ))}
    </ul>
  );
}
