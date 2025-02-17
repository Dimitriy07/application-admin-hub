import { PropsWithChildren } from "react";

export default function ToolboxBar({ children }: PropsWithChildren) {
  return <div className="h-8 flex justify-between">{children}</div>;
}
