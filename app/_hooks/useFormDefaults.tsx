/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { FormConfigWithConditions } from "@/app/_types/types";

/**
 * Custom hook that generates a complete default values object
 * for use in form libraries (like React Hook Form) based on a form configuration schema.
 *
 * It supports:
 * - Non-conditional form fields (flat fields).
 * - Conditional fields (shown based on another field’s value).
 * - Avoids populating the `password` field for security reasons.
 *
 * @param formFields - Configuration object defining all form fields including conditional ones.
 * @param defaultValues - Initial values from database or API that may only partially match the form config.
 *
 * @returns A memoized object containing all default values for the form, filled in with empty strings when missing.
 *
 * @example
 * const defaultValues = useFormDefaults(formConfig, dbUserData);
 * const methods = useForm({ defaultValues });
 */
function useFormDefaults(
  formFields: FormConfigWithConditions,
  defaultValues: any
) {
  const completedDefault = useMemo(() => {
    const defaults: Record<string, any> = {};

    // Populate defaults for all top-level (non-conditional) fields
    Object.keys(formFields).forEach((key) => {
      if (key !== "conditionalFields") {
        defaults[key] = defaultValues?.[key] ?? "";
      }
    });

    // Populate defaults for fields that are conditionally rendered
    formFields.conditionalFields?.forEach((condition) => {
      Object.keys(condition.fields).forEach((key) => {
        // Skip if already set, unless it's password
        if (!(key in defaults) && key !== "password") {
          defaults[key] = defaultValues?.[key] ?? "";
        }
        if (key === "password") {
          // Always clear password field
          defaults[key] = "";
        }
      });
    });

    return defaults;
  }, [formFields, defaultValues]);

  return completedDefault;
}

export default useFormDefaults;
