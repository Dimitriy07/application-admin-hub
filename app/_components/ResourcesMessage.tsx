function ResourcesMessage({ message }: { message?: string }) {
  return (
    <div className="px-3 text-xl font-bold text-coral-800">
      <p>{message ? message : "This is default Resource Message"}</p>
    </div>
  );
}

export default ResourcesMessage;
