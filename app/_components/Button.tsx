/**
 * Button Component
 *
 * A flexible, reusable, and styled button component that supports size, visual variations,
 * loading state, modal context interaction, and standard HTML button attributes.
 * It optionally integrates with a `ModalContext` to close modals on click.
 *
 * @component
 * @example
 * <Button
 *   size="large"
 *   variation="danger"
 *   isLoading={false}
 *   isModalClose={true}
 *   onClick={() => console.log("Button clicked!")}
 * >
 *   Delete
 * </Button>
 *
 * @param {React.ReactNode} children - The button's label or contents (required).
 * @param {"small" | "medium" | "large"} [size="medium"] - Sets padding and height based on button size.
 * @param {"primary" | "secondary" | "danger"} [variation="primary"] - Visual style of the button.
 * @param {() => void} [onClick] - Function to call when button is clicked.
 * @param {boolean} [isLoading=false] - Displays a loading spinner and disables the button.
 * @param {boolean} [isModalClose=false] - Automatically closes an open modal if inside `ModalContext`.
 * @param {boolean} [disabled=false] - Disables the button regardless of loading state.
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} [props] - Additional HTML button attributes (e.g., `type`, `aria-*`, etc.).
 *
 * @returns JSX.Element - A styled button with optional modal behavior and loading state.
 */

"use client";

import React, { useContext } from "react";
import { ModalContext } from "./Modal";

interface SizeType {
  small: string;
  medium: string;
  large: string;
}

interface VariationType {
  primary: string;
  secondary: string;
  danger: string;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: keyof SizeType;
  variation?: keyof VariationType;
  onClick?: () => void;
  isLoading?: boolean;
  isModalClose?: boolean;
  disabled?: boolean;
}

export default function Button({
  children,
  size = "medium",
  variation = "primary",
  onClick,
  isLoading = false,
  isModalClose = false,
  disabled = false,
  ...props
}: ButtonProps) {
  const sizes = {
    small: "py-1 px-2 h-6 text-sm",
    medium: "py-2 px-4 h-8 text-base",
    large: "py-4 px-6 h-12 text-xl",
  };

  const variations = {
    primary: "bg-coral-800 text-coral-100 hover:bg-coral-1000",
    secondary: "bg-coral-0 text-ocean-800 hover:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-800",
    disabled: "bg-gray-400 text-white cursor-not-allowed opacity-70",
  };

  const modalContext = useContext(ModalContext);

  const isButtonDisabled = isLoading || disabled;

  const handleClick = () => {
    if (isModalClose && modalContext) {
      modalContext.close();
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      aria-label={`${
        children &&
        `${(children as string)[0].toLowerCase()}${(children as string).slice(
          1
        )}`
      }-button`}
      disabled={isButtonDisabled}
      onClick={handleClick}
      className={`${sizes[size]} flex items-center m-1 rounded-md ${
        isButtonDisabled ? variations["disabled"] : variations[variation]
      }`}
      {...props}
    >
      {isLoading ? (
        <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
      ) : (
        children
      )}
    </button>
  );
}
