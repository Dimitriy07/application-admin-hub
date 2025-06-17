/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * DynamicFormFields Component
 *
 * Renders a list of dynamic form fields based on a configuration object.
 * Supports both static and conditional fields.
 *
 * - Static fields are rendered unconditionally.
 * - Conditional fields are rendered based on another field’s value using `watch`.
 *
 * This component integrates tightly with React Hook Form using `register`, `errors`, and `watch`.
 *
 * @component
 * @example
 * <DynamicFormFields
 *   formFields={formConfig}
 *   isEdit={true}
 *   register={register}
 *   errors={errors}
 *   watch={watch}
 * />
 *
 * @typedef {Object} DynamicFormFieldsProps
 * @property {FormConfigWithConditions} formFields - Object containing form field definitions and optional conditional logic.
 * @property {boolean} isEdit - Determines whether the form is in edit mode (can affect disabled state).
 * @property {UseFormRegister<FormElementType>} register - React Hook Form `register` function for input binding.
 * @property {FieldErrors<any>} [errors] - Optional error object returned from React Hook Form validation.
 * @property {UseFormWatch<any>} watch - React Hook Form `watch` function used to observe field values.
 */

import { FormConfigWithConditions, FormElementType } from "@/app/_types/types";
import FormRow from "./FormRow";
import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";

type DynamicFormFieldsProps = {
  formFields: FormConfigWithConditions;
  isEdit: boolean;
  register: UseFormRegister<FormElementType>;
  errors?: FieldErrors<any>;
  watch: UseFormWatch<any>;
};

function DynamicFormFields({
  formFields,
  isEdit,
  register,
  errors,
  watch,
}: DynamicFormFieldsProps) {
  return (
    <>
      {/* Render base (non-conditional) fields */}
      {Object.entries(formFields).map(([key, field]) => {
        if (Array.isArray(field)) return null; // skip conditional config
        return (
          <FormRow
            key={key}
            field={field}
            isEdit={isEdit}
            register={register}
            errors={errors}
          />
        );
      })}

      {/* Render fields that depend on other values */}
      {formFields.conditionalFields?.map((condition) => {
        const fieldValue = watch(condition.when.field);

        return fieldValue === condition.when.value
          ? Object.entries(condition.fields).map(([key, field]) => (
              <FormRow
                key={key}
                field={field}
                isEdit={isEdit}
                register={register}
                errors={errors}
              />
            ))
          : null;
      })}
    </>
  );
}

export default DynamicFormFields;
