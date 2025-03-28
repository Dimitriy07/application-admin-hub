"use client";

// import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { login } from "../_services/actions";
import { userLoginSchema } from "@/app/_lib/validationSchema";
import { ZodError } from "zod";
import Button from "./Button";

function LoginForm() {
  const [error, setError] = useState("");
  // const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      const data = await userLoginSchema.parseAsync(
        Object.fromEntries(formData.entries())
      );
      const { email, password } = data;
      if (!email || !password) return data;
      const res = await login(email, password);
      if (res && "error" in res) {
        throw new Error(res.error);
      }
    } catch (error) {
      if (error instanceof ZodError) {
        setError(error.errors[0].message);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 text-ocean-800 border border-ocean-800 rounded-md py-10 px-10 bg-ocean-0 shadow-xl"
    >
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
      {error && <div className="text-black">{error}</div>}
      <div>
        <Button type="submit">Login</Button>
      </div>
    </form>
  );
}

export default LoginForm;
