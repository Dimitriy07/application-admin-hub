import ToolboxButtons from "./ToolboxButtons";

function ToolboxContainer({
  isRestricted = true,
  restrictedMessage = "Settings parameters must be configured",
}: {
  isRestricted?: boolean;
  restrictedMessage?: string;
}) {
  return (
    <div className="h-10 flex justify-between items-center border">
      {isRestricted ? (
        <span className="text-coral-800 font-bold">{restrictedMessage}</span>
      ) : (
        <ToolboxButtons disabled={isRestricted} />
      )}
    </div>
  );
}

export default ToolboxContainer;
