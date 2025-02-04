import ItemRow from "@/app/_components/ItemRow";

interface UserItem {
  id: string;
  name: string;
}

const userTestObj: UserItem[] = [
  {
    id: "1",
    name: "John Old",
  },
  {
    id: "2",
    name: "Vasilii Ivanov",
  },
  {
    id: "3",
    name: "Ghee Fazam",
  },
];

export default function Page() {
  return (
    <ul className="flex flex-col">
      <ItemRow items={userTestObj} urlPath="users" />
    </ul>
  );
}
