"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/app/_services/actions";

function NewVerificationForm() {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const onSubmit = useCallback(() => {
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
  }, [token]);
  useEffect(
    function () {
      onSubmit();
    },
    [onSubmit]
  );
  return (
    <div>
      <p>{token}</p>
      <p>{success}</p>
      <p>{error}</p>
    </div>
  );
}

export default NewVerificationForm;
