import {
  createContext,
  Dispatch,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { createPortal } from "react-dom";
import useOutsideClick from "@/app/_hooks/useOutsideClick";
type RectPosition = { x: number; y: number };

type MenuContextType = {
  openId: string | undefined;
  position: RectPosition | null;
  setPosition: Dispatch<RectPosition | null>;
  //   setPosition: Dispatch<SetStateAction<RectPosition | null>>;
  close: () => void;
  open: Dispatch<SetStateAction<string | undefined>>;
};

const MenusContext = createContext<MenuContextType | null>(null);

function Menus({ children }: PropsWithChildren) {
  const [openId, setOpenId] = useState<string | undefined>();
  const [position, setPosition] = useState<RectPosition | null>(null);
  const close = () => setOpenId("");
  const open = setOpenId;

  return (
    <MenusContext.Provider
      value={{ openId, position, setPosition, close, open }}
    >
      {children}
    </MenusContext.Provider>
  );
}

function Toggle({ id, children }: { id: string; children: ReactNode }) {
  // const MENU_DEVIATION_X = 20;
  const MENU_DEVIATION_Y = 8;
  const context = useContext(MenusContext);

  if (!context) {
    throw new Error("Toggle must be used within a Menus provider");
  }

  const { openId, close, open, setPosition } = context;
  function handleClick(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();
    const menuButton = (e.target as HTMLButtonElement).closest("button");
    if (!menuButton) return;
    const rect = menuButton.getBoundingClientRect();
    setPosition({
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + MENU_DEVIATION_Y,
    });
    if (openId === "" || openId !== id) {
      open(id);
    } else {
      close();
    }
  }
  return <div onClick={handleClick}>{children}</div>;
}

function List({ id, children }: { id: string; children: ReactNode }) {
  const context = useContext(MenusContext);

  if (!context) {
    throw new Error("Toggle must be used within a Menus provider");
  }

  const { openId, close, position } = context;
  const ref = useOutsideClick(close, false);
  if (openId !== id || !position) return null;
  return createPortal(
    <div
      ref={ref}
      className={`fixed  bg-ocean-0 border border-ocean-500 rounded-md`}
      style={{ right: `${position?.x}px`, top: `${position?.y}px` }}
    >
      {children}
    </div>,
    document.body
  );
}

function Button({
  children,
  icon,
  onClick,
}: {
  children: ReactNode;
  icon: ReactNode;
  onClick: () => void;
}) {
  const context = useContext(MenusContext);

  if (!context) {
    throw new Error("Toggle must be used within a Menus provider");
  }

  const { close } = context;
  function handleClick() {
    onClick?.();
    close();
  }
  return (
    <li
      onClick={handleClick}
      className="text-ocean-800 list-none flex p-2 items-center justify-center gap-2 cursor-pointer hover:text-ocean-500"
    >
      {icon}
      <span>{children}</span>
    </li>
  );
}

// Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
