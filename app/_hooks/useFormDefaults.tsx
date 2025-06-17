/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { FormConfigWithConditions } from "@/app/_types/types";

function useFormDefaults(
  formFields: FormConfigWithConditions,
  defaultValues: any
) {
  const completedDefault = useMemo(() => {
    const defaults: Record<string, any> = {};

    // Fill in non-conditional fields
    Object.keys(formFields).forEach((key) => {
      if (key !== "conditionalFields") {
        defaults[key] = defaultValues?.[key] ?? "";
      }
    });
    // Fill in conditional fields
    formFields.conditionalFields?.forEach((condition) => {
      Object.keys(condition.fields).forEach((key) => {
        // Check if field is in defaults object and if field is not password
        if (!(key in defaults) && key !== "password") {
          defaults[key] = defaultValues?.[key] ?? "";
        }
        // Avoid showing password in a field
        if (key === "password") {
          defaults[key] = "";
        }
      });
    });

    return defaults;
  }, [formFields, defaultValues]);
  return completedDefault;
}

export default useFormDefaults;
