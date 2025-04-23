import { PropsWithChildren } from "react";

function DataDisplayContainer({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col justify-between h-full items-start">
      {children}
    </div>
  );
}

export default DataDisplayContainer;
