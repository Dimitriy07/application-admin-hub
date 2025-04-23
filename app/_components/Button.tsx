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
    primary: "bg-coral-800 text-coral-100",
    secondary: "bg-coral-0 text-ocean-800",
    danger: "bg-red-600 text-white",
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
      aria-label={`${children} button`}
      disabled={isLoading}
      {...props}
      onClick={handleClick}
      className={`${sizes[size]} flex items-center m-1 rounded-md ${
        isButtonDisabled ? variations["disabled"] : variations[variation]
      }`}
    >
      {isLoading ? (
        <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
      ) : (
        children
      )}
    </button>
  );
}
