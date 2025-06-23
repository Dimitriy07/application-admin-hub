"use client";

// import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { login } from "@/app/_services/actions";
import { ZodError } from "zod";
import Button from "./Button";
import { USER_LOGIN_SCHEMA } from "@/app/_constants/validations-schema-names";
import CardWrapper from "./CardWrapper";
import FormGenerator from "./FormGenerator";
import { loginFormField } from "@/app/_config/formConfigs";
import { FormConfigWithConditions } from "@/app/_types/types";
import PopupWindow from "./PopupWindow";

function LoginForm({ ip }: { ip: string }) {
  const [error, setError] = useState("");

  async function onSubmit(formData: Record<string, string>) {
    try {
      const email = formData.email;
      const password = formData.password;

      if (!email || !password) {
        setError("Email and password are required.");
        return;
      }

      const res = await login(email, password, ip);
      if (res && "error" in res) {
        throw new Error(res.error);
      }
    } catch (err) {
      if (err instanceof ZodError) {
        setError(err.errors[0].message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  }

  // THERE IS A GLITCH IN AUTHJS NOT TO USE NEXT REDIRECT IN TRY CATCH.
  if (error === "NEXT_REDIRECT") setError("");

  return (
    <PopupWindow>
      <CardWrapper>
        <CardWrapper.CardLabel>Login</CardWrapper.CardLabel>
        <CardWrapper.CardContent>
          <FormGenerator
            formFields={loginFormField as FormConfigWithConditions}
            onSubmit={onSubmit}
            formId="login-form"
            validationSchema={USER_LOGIN_SCHEMA}
            isEdit={true}
          />
        </CardWrapper.CardContent>
        {error ? (
          <CardWrapper.CardMessage type={"error"}>
            {error || ""}
          </CardWrapper.CardMessage>
        ) : null}

        <Button type="submit" form="login-form">
          Login
        </Button>
      </CardWrapper>
    </PopupWindow>
  );
}

export default LoginForm;
