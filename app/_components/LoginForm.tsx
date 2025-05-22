"use client";

// import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { login } from "@/app/_services/actions";
import { ZodError } from "zod";
import Button from "./Button";
import { USER_LOGIN_SCHEMA } from "@/app/_constants/schema-names";
import CardWrapper from "./CardWrapper";
import FormGenerator from "./FormGenerator";
import { loginFormField } from "@/app/_config/formConfigs";
import { FormConfigWithConditions } from "@/app/_types/types";
import PopupWindow from "./PopupWindow";

function LoginForm() {
  const [error, setError] = useState("");

  async function onSubmit(formData: Record<string, string>) {
    try {
      const email = formData.email;
      const password = formData.password;

      if (!email || !password) return;

      const res = await login(email, password);
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
          <CardWrapper.CardPopupMessage type={"error"}>
            {error || ""}
          </CardWrapper.CardPopupMessage>
        ) : null}

        <Button type="submit" form="login-form">
          Login
        </Button>
      </CardWrapper>
    </PopupWindow>
  );
}

export default LoginForm;
