"use client";

// import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { login } from "../_services/actions";

function LoginForm() {
  const [error, setError] = useState("");
  // const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const res = await login(formData);
    console.log(res);
    if (res?.error) {
      setError(res.error as string);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 text-ocean-800 border border-ocean-800 rounded-md py-10 px-10 bg-ocean-0 shadow-xl"
    >
      {error && <div className="text-black">{error}</div>}
      <h2 className="font-bold text-center">LOG IN</h2>
      <div className="flex flex-col gap-1">
        <label htmlFor="email">Login (e-mail):</label>
        <input
          name="email"
          type="email"
          id="email"
          placeholder="e-mail"
          className="border border-ocean-800 rounded-sm  focus:outline-coral-500 px-2 py-1"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password">Password:</label>
        <input
          name="password"
          type="password"
          id="password"
          placeholder="Password"
          className="border border-ocean-800 rounded-sm focus:outline-coral-500 px-2 py-1"
        />
      </div>
      <div>
        <button type="submit">Login</button>
      </div>
    </form>
  );
}

export default LoginForm;
