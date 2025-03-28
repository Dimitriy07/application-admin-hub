import { Ref } from "react";
import { HiXMark } from "react-icons/hi2";

function PopupWindow({
  children,
  ref,
  close,
}: {
  children: React.ReactElement;
  ref: Ref<HTMLDivElement>;
  close: () => void;
}) {
  return (
    <div className="fixed top-0 left-0 w-full h-screen backdrop-blur-xs bg-[rgba(255,255,255,0.1)] z-1000 transition-all duration-500">
      <div
        ref={ref}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-ocean-0 border rounded-md shadow-md  transition-all duration-500"
      >
        <div className="bg-ocean-800 rounded-t-md flex items-center h-8 px-2 py-1 justify-end">
          <button className="text-ocean-0 text-xl " onClick={close}>
            <HiXMark />
          </button>
        </div>
        <div className="py-2 px-3">{children}</div>
      </div>
    </div>
  );
}

export default PopupWindow;
