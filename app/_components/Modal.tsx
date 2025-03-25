"use client";

import React, {
  cloneElement,
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { createPortal } from "react-dom";
import useOutsideClick from "@/app/_hooks/useOutsideClick";
import PopupWindow from "./PopupWindow";

type ModalType = {
  openName: string | undefined;
  close: () => void;
  open: Dispatch<SetStateAction<string | undefined>>;
};

export const ModalContext = createContext<ModalType | null>(null);

function Modal({ children }: PropsWithChildren) {
  const [openName, setOpenName] = useState<string | undefined>("");
  const close = () => setOpenName("");
  const open = setOpenName;
  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      <div>{children}</div>
    </ModalContext.Provider>
  );
}

function Open({
  children,
  opens: opensWindowName,
}: {
  children: React.ReactElement<{ onClick?: () => void }>;
  opens: string;
}) {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("Open must be used within a Modal provider");
  }
  const { open } = context;
  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

function Window({
  children,
  name,
  isOutsideClickEnabled = false,
}: {
  children: React.ReactElement;
  name: string;
  isOutsideClickEnabled?: boolean;
}) {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("Window must be used within a Modal provider");
  }
  const { openName, close } = context;
  const outsideContainer = useOutsideClick(close);

  if (name !== openName) return null;

  return createPortal(
    <PopupWindow
      ref={isOutsideClickEnabled ? outsideContainer : null}
      close={close}
    >
      {children}
    </PopupWindow>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
