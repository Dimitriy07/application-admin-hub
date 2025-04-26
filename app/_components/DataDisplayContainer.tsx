import { PropsWithChildren } from "react";

function DataDisplayContainer({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col justify-between h-full w-full">
      {children}
    </div>
  );
}

export default DataDisplayContainer;
