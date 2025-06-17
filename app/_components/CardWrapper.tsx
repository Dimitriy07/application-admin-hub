/**
 * CardWrapper Module
 *
 * A compound component layout for building flexible, styled card UIs using Tailwind CSS.
 * It provides a base wrapper with named subcomponents for consistent content structure,
 * including labels, messages, content blocks, and action buttons.
 *
 * @component
 * @example
 * <CardWrapper>
 *   <CardWrapper.CardLabel>Login</CardWrapper.CardLabel>
 *   <CardWrapper.CardMessage type="error">Invalid credentials</CardWrapper.CardMessage>
 *   <CardWrapper.CardContent>
 *     <LoginForm />
 *   </CardWrapper.CardContent>
 *   <CardWrapper.CardButtons>
 *     <Button>Cancel</Button>
 *     <Button variation="primary">Submit</Button>
 *   </CardWrapper.CardButtons>
 * </CardWrapper>
 *
 * @returns JSX.Element - A composed card layout with labeled sections and optional status message.
 */

// Required imports
import { PropsWithChildren } from "react";
import { HiExclamationTriangle } from "react-icons/hi2";
import { HiOutlineCheckCircle } from "react-icons/hi2";

// Base wrapper that stacks content vertically
function CardWrapper({ children }: PropsWithChildren) {
  return <div className="w-full flex flex-col h-full">{children}</div>;
}

// Optional label at the top of the card
function CardLabel({ children }: PropsWithChildren) {
  return (
    <div className="flex justify-center font-bold text-ocean-800 pb-2 pt-1">
      {children}
    </div>
  );
}

// Main content block with spacing and styling
function CardContent({ children }: PropsWithChildren) {
  return <div className="m-3 text-ocean-800">{children}</div>;
}

// Message block for success or error messages
function CardMessage({
  children,
  type,
}: {
  children: React.ReactNode;
  type?: "success" | "error";
}) {
  return (
    <div
      aria-label="status-message"
      className={`${
        type === "success"
          ? "bg-green-200 text-green-800"
          : "bg-red-300 text-red-900"
      } flex items-center gap-2 p-2 rounded-md`}
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

// Button row at the bottom of the card
function CardButtons({ children }: PropsWithChildren) {
  return <div className="flex justify-between mt-6">{children}</div>;
}

// Attach subcomponents as properties of the main component
CardWrapper.CardLabel = CardLabel;
CardWrapper.CardContent = CardContent;
CardWrapper.CardMessage = CardMessage;
CardWrapper.CardButtons = CardButtons;

export default CardWrapper;
