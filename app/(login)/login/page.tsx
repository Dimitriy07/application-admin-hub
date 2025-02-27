import Button from "@/app/_components/Button";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center  mx-auto h-full">
      <form
        action=""
        className="flex flex-col gap-4 text-ocean-800 border border-ocean-800 rounded-md py-10 px-10 bg-ocean-0 shadow-xl"
      >
        <h2 className="font-bold text-center">LOG IN</h2>
        <div className="flex flex-col gap-1">
          <label htmlFor="login">Login (e-mail):</label>
          <input
            name="login"
            type="text"
            id="login"
            placeholder="e-mail"
            className="border border-ocean-800 rounded-sm  focus:outline-coral-500 px-2 py-1"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password">Password:</label>
          <input
            name="password"
            type="text"
            id="password"
            placeholder="Password"
            className="border border-ocean-800 rounded-sm focus:outline-coral-500 px-2 py-1"
          />
        </div>
        <div>
          <Button>Login</Button>
        </div>
      </form>
    </div>
  );
}
