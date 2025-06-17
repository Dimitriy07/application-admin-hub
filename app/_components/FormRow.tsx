/**
 * FormRow Component
 *
 * A reusable component that renders a single form row, including:
 * - A label
 * - A form input element (delegated to `FormElement`)
 * - Optional error message display
 *
 * This component is typically used inside dynamic form builders such as `DynamicFormFields`.
 * It receives one field configuration object and renders it appropriately, including validation error feedback and form registration.
 *
 * @component
 *
 * @param {object} props
 * @param {FormElementType} props.field - The configuration object describing the form element (id, name, label, type, placeholder, options, etc.).
 * @param {boolean} props.isEdit - Whether the form is currently in "edit" mode. If false, input is rendered as disabled.
 * @param {UseFormRegister<FormElementType>} props.register - The `register` function from React Hook Form to bind form fields.
 * @param {FieldErrors<any>} [props.errors] - Optional error object from React Hook Form for validation messages.
 *
 * @example
 * ```tsx
 * <FormRow
 *   field={{
 *     id: "username",
 *     name: "username",
 *     labelName: "Username",
 *     type: "text",
 *     placeholder: "Enter your username"
 *   }}
 *   isEdit={true}
 *   register={register}
 *   errors={errors}
 * />
 * ```
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldErrors, UseFormRegister } from "react-hook-form";
import FormElement from "./FormElement";
import { FormElementType } from "@/app/_types/types";

interface FormRowProps {
  field: FormElementType;
  isEdit: boolean;
  register: UseFormRegister<FormElementType>;
  errors?: FieldErrors<any>;
}

function FormRow({ field, isEdit, register, errors }: FormRowProps) {
  return (
    <div className="flex gap-4 mb-3">
      <label className="w-60 font-bold " htmlFor={field.id}>
        {field.labelName}:
      </label>
      <div className="w-full">
        <FormElement
          type={field.type}
          id={field.id}
          options={"options" in field ? [...field.options] : undefined}
          placeholder={"placeholder" in field ? field.placeholder : undefined}
          disabled={!isEdit}
          {...register(field.name as keyof FormElementType)}
          className="border h-8 w-full"
        />

        {errors && errors[field.name]?.message && (
          <p className="text-sm text-red-500">
            {errors[field.name]?.message as string}
          </p>
        )}
      </div>
    </div>
  );
}

export default FormRow;
