/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * FormGenerator Component
 *
 * A dynamic form builder component that generates forms based on a
 * configuration object with support for conditional fields, validation,
 * and edit/add modes.
 *
 * This component uses:
 * - React Hook Form for form state management and validation
 * - Zod for schema-based validation (integrated via zodResolver)
 * - Custom hooks for default values and edit form state management
 * - DynamicFormFields component to render form inputs based on config
 * - ModalContext to optionally close a modal on successful submission
 *
 * Features:
 * - Supports edit mode with partial submission of only dirty fields
 * - Supports add mode with submission of all fields
 * - Dynamically applies a validation schema based on route and params
 * - Prevents submitting unmodified forms in edit mode
 *
 * @component
 *
 * @param {object} props
 * @param {FormConfigWithConditions} props.formFields - Configuration of form fields including conditional fields.
 * @param {(data: Record<string, string>) => Promise<void>} props.onSubmit - Async function to handle form submission.
 * @param {string} props.formId - Unique ID for the form element.
 * @param {any} [props.defaultValues] - Optional default values to populate the form.
 * @param {boolean} [props.isCompactForm=true] - Whether the form layout is compact (vertical only) or fills container.
 * @param {boolean} props.isEdit - Flag indicating if the form is in edit mode (true) or add mode (false).
 * @param {string} [props.validationSchema] - Optional name of the validation schema to apply.
 *
 * @example
 * ```tsx
 * <FormGenerator
 *   formFields={myFormConfig}
 *   onSubmit={handleFormSubmit}
 *   formId="user-edit-form"
 *   defaultValues={userData}
 *   isEdit={true}
 *   validationSchema="USER_EDIT_SCHEMA"
 * />
 * ```
 */
"use client";

import { BaseSyntheticEvent, useContext } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import useEditFormState from "../_hooks/useEditFormState";
import useFormDefaults from "@/app/_hooks/useFormDefaults";
import { useForm } from "react-hook-form";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DynamicFormFields from "./DynamicFormFields";
import { ModalContext } from "./Modal";
import createZodSchema from "@/app/_lib/validationSchema";
import { USER_EDIT_SCHEMA } from "@/app/_constants/schema-names";
import { FormConfigWithConditions } from "@/app/_types/types";
import { USERS_COLLECTION } from "@/app/_constants/form-names";

interface FormGeneratorProps {
  formFields: FormConfigWithConditions;
  onSubmit: (data: Record<string, string>) => Promise<void>;
  formId: string;
  defaultValues?: any;
  isCompactForm?: boolean;
  isEdit: boolean;
  validationSchema?: string;
}

function FormGenerator({
  formFields,
  onSubmit,
  formId,
  defaultValues,
  isEdit = false,
  isCompactForm = true,
  validationSchema,
}: FormGeneratorProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Determine if the form is for user editing within the resources app context
  const isResourcesApp =
    pathname.split("/").at(-1)?.startsWith("resources-app") &&
    searchParams.get("resourceType") === USERS_COLLECTION;

  // Override validation schema for user editing in resources app
  if (isResourcesApp) {
    validationSchema = USER_EDIT_SCHEMA;
  }

  // Create Zod validation schema based on schema name and form field config
  const schema: ZodType<any, any, any> = createZodSchema(
    validationSchema,
    formFields
  );

  // Type inferred from Zod schema for form values
  type ValidationSchema = z.infer<typeof schema>;

  // Generate completed default values, merging formFields and defaults
  const completedDefaults = useFormDefaults(formFields, defaultValues);

  // Initialize React Hook Form with validation and defaults
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitSuccessful, isDirty, dirtyFields },
    reset,
    getValues,
  } = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues: completedDefaults,
  });

  // Get modal context for closing modal after submit if applicable
  const context = useContext(ModalContext);
  const close = context?.close || (() => {});

  // Manage form state for edit mode: reset, close modal, etc.
  useEditFormState(
    isEdit,
    isDirty,
    isSubmitSuccessful,
    reset,
    completedDefaults,
    context,
    close
  );

  // Handle form submission event with custom logic for edit/add modes
  const handleOnSubmit = async (e: BaseSyntheticEvent) => {
    // Prevent submitting when no changes made in edit mode
    if (!isDirty && isEdit) {
      e.preventDefault();
      return false;
    }
    // Submit only changed fields in edit mode
    else if (isDirty) {
      const changedFields = Object.keys(dirtyFields).reduce((acc, key) => {
        const typedKey = key as keyof ValidationSchema;
        acc[typedKey as string] = getValues(typedKey as string);
        return acc;
      }, {} as Partial<ValidationSchema>);
      await handleSubmit(
        () => onSubmit(changedFields),
        (err) => {
          console.error(err);
        }
      )(e).catch((err) =>
        console.error("Error in the submitted form. Error: " + err)
      );
    }
    // Submit all fields in add mode
    else
      await handleSubmit(onSubmit, (err) => console.error(err))(e).catch(
        (err) => console.error("Error in the submitted form. Error: " + err)
      );
  };

  return (
    <form
      aria-label="main-form"
      id={formId}
      className={
        isCompactForm ? "flex flex-col" : "flex flex-col w-full h-full"
      }
      onSubmit={handleOnSubmit}
    >
      <DynamicFormFields
        formFields={formFields}
        isEdit={isEdit}
        register={register}
        errors={errors}
        watch={watch}
      />
    </form>
  );
}

export default FormGenerator;
