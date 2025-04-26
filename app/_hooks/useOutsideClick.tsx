import { useEffect, useRef } from "react";

function useOutsideClick(handler: () => void, capturing = false) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(
    function () {
      function handleClick(e: MouseEvent) {
        if (ref.current && !ref.current.contains(e.target as Node)) {
          handler();
        }
      }
      document.addEventListener("click", handleClick, capturing);
      return () =>
        document.removeEventListener("click", handleClick, capturing);
    },
    [handler, capturing]
  );
  return ref;
}

export default useOutsideClick;
