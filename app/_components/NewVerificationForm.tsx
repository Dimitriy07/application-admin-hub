"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/app/_services/actions";
import CardWrapper from "./CardWrapper";
import Button from "./Button";
import { BarLoader } from "react-spinners";

function NewVerificationForm() {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
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

  const onClick = () => {
    router.replace("/auth/login");
  };
  return (
    <CardWrapper>
      <CardWrapper.CardLabel>
        Confirming your verification
      </CardWrapper.CardLabel>
      <CardWrapper.CardButtons>
        <Button onClick={onClick}>Back to Login</Button>
      </CardWrapper.CardButtons>
      {!success && !error && <BarLoader />}
      {success && (
        <CardWrapper.CardPopupMessage type="success">
          {success}
        </CardWrapper.CardPopupMessage>
      )}
      {error && (
        <CardWrapper.CardPopupMessage type="error">
          {error}
        </CardWrapper.CardPopupMessage>
      )}
    </CardWrapper>
  );
}

export default NewVerificationForm;
