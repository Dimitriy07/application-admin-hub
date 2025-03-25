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
  isModal?: boolean;
}

export default function Button({
  children,
  size = "medium",
  variation = "primary",
  onClick,
  isLoading = false,
  isModal = false,
  ...props
}: ButtonProps) {
  const sizes = {
    small: "py-1 px-2 h-6 text-sm",
    medium: "py-2 px-4 h-8 text-base",
    large: "py-4 px-6 h-12 text-xl",
  };

  const variations = {
    primary: "bg-coral-800 text-coral-100",
    secondary: "bg-gray-300 text-gray-900",
    danger: "bg-red-600 text-white",
  };
  const modalContext = useContext(ModalContext);
  if (!modalContext) {
    return (
      <button
        aria-label={`${children} button`}
        disabled={isLoading}
        {...props}
        onClick={onClick}
        className={`${sizes[size]} ${variations[variation]} flex items-center m-1 rounded-md`}
      >
        {isLoading ? (
          <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
        ) : (
          children
        )}
      </button>
    );
  }
  return (
    <button
      aria-label={`${children} button`}
      disabled={isLoading}
      {...props}
      onClick={isModal ? modalContext?.close : onClick}
      className={`${sizes[size]} ${variations[variation]} flex items-center m-1 rounded-md`}
    >
      {isLoading ? (
        <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
      ) : (
        children
      )}
    </button>
  );
}
