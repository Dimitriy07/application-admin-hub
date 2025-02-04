import ItemRow from "@/app/_components/ItemRow";

interface AccountItem {
  id: string;
  name: string;
}

const accountTestObj: AccountItem[] = [
  {
    id: "1",
    name: "Sales Account",
  },
  {
    id: "2",
    name: "Fleet Account",
  },
];

export default function Page() {
  return (
    <ul className="flex flex-col">
      <ItemRow items={accountTestObj} urlPath="accounts" />
    </ul>
  );
}
