import ItemRow from "@/app/_components/ItemRow";

interface EntityItem {
  id: string;
  name: string;
}

const entityTestObj: EntityItem[] = [
  {
    id: "1",
    name: "Monolith UK",
  },
  {
    id: "2",
    name: "Microsoft",
  },
];

export default function Page() {
  return (
    <ul className="flex flex-col">
      <ItemRow items={entityTestObj} urlPath="entities" />
    </ul>
  );
}
