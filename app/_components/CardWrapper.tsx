"use client";

import { createContext } from "react";
import { PropsWithChildren } from "react";
import { HiOutlineCheckCircle } from "react-icons/hi2";
import { HiExclamationTriangle } from "react-icons/hi2";

const CardWrapperContext = createContext(null);

function CardWrapper({ children }: PropsWithChildren) {
  return (
    <CardWrapperContext.Provider value={{}}>
      <div>{children}</div>
    </CardWrapperContext.Provider>
  );
}

function CardLabel({ children }: PropsWithChildren) {
  return (
    <div className="flex justify-center font-bold text-ocean-800 pb-2 pt-1">
      {children}
    </div>
  );
}
function CardContent({ children }: PropsWithChildren) {
  return <div className="m-3 text-ocean-800">{children}</div>;
}
function CardPopupMessage({
  children,
  type,
}: {
  children: React.ReactNode;
  type: "success" | "error";
}) {
  return (
    <div
      className={`${
        type === "success"
          ? "bg-green-200 text-green-800"
          : "bg-red-300 text-red-900"
      } flex items-center gap-2`}
    >
      <span>
        {type === "success" ? (
          <HiOutlineCheckCircle />
        ) : (
          <HiExclamationTriangle />
        )}
      </span>
      {children}
    </div>
  );
}
function CardButtons({ children }: PropsWithChildren) {
  return <div className="flex justify-between">{children}</div>;
}

CardWrapper.CardLabel = CardLabel;
CardWrapper.CardContent = CardContent;
CardWrapper.CardPopupMessage = CardPopupMessage;
CardWrapper.CardButtons = CardButtons;

export default CardWrapper;
