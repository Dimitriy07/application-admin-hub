"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/app/_services/actions";
import CardWrapper from "./CardWrapper";
import Button from "./Button";
import { BarLoader } from "react-spinners";
import { DEFAULT_LOGIN_REDIRECT } from "@/app/routes";
import Link from "next/link";

function NewVerificationForm() {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const onSubmit = useCallback(() => {
    if (success || error) return;
    if (!token) {
      setError("Token was not found");
      return;
    }
    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => setError("Something went wrong!"));
  }, [token, success, error]);

  useEffect(
    function () {
      onSubmit();
    },
    [onSubmit]
  );

  return (
    <CardWrapper>
      <CardWrapper.CardLabel>
        Confirming your verification
      </CardWrapper.CardLabel>
      <CardWrapper.CardButtons>
        <Link href={DEFAULT_LOGIN_REDIRECT}>
          <Button>Back to Login</Button>
        </Link>
      </CardWrapper.CardButtons>
      {!success && !error && <BarLoader />}
      {success && (
        <CardWrapper.CardMessage type="success">
          {success}
        </CardWrapper.CardMessage>
      )}
      {error && (
        <CardWrapper.CardMessage type="error">{error}</CardWrapper.CardMessage>
      )}
    </CardWrapper>
  );
}

export default NewVerificationForm;
