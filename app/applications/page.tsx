import ItemRow from "../_components/ItemRow";

// Change after configuring fetching from db

interface AppItem {
  id: string;
  icon: string;
  name: string;
}

const appTestObj: AppItem[] = [
  {
    id: "1",
    icon: "/app.png",
    name: "Route Optimisation",
  },
  {
    id: "2",
    icon: "/app1.png",
    name: "Accident Form App",
  },
];

export default function Page() {
  return (
    <ul className="flex flex-col">
      <ItemRow items={appTestObj} urlPath="applications" />
    </ul>
  );
}
