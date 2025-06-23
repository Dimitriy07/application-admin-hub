import { useEffect, useRef } from "react";

/**
 * A custom hook that detects and handles clicks outside of a specified DOM element.
 *
 * Useful for:
 * - Closing dropdowns, modals, tooltips, etc., when clicking outside their container.
 *
 * @param handler - Function to call when a click is detected outside the target element.
 * @param capturing - Optional boolean to use capture phase for the event listener (default is `false`).
 *
 * @returns A `ref` object to be attached to the target element you want to detect outside clicks for.
 *
 * @example
 * const ref = useOutsideClick(() => setOpen(false));
 * return <div ref={ref}>This is the dropdown</div>;
 */
function useOutsideClick(handler: () => void, capturing = false) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(
    function () {
      /**
       * Event listener for document click events.
       * Triggers the handler if the click is outside the referenced element.
       */
      function handleClick(e: MouseEvent) {
        if (ref.current && !ref.current.contains(e.target as Node)) {
          handler();
        }
      }

      document.addEventListener("click", handleClick, capturing);
      return () => {
        document.removeEventListener("click", handleClick, capturing);
      };
    },
    [handler, capturing]
  );

  return ref;
}

export default useOutsideClick;
