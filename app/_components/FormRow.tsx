/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormElementType } from "@/app/_types/types";
import FormElement from "./FormElement";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface FormRowProps {
  field: FormElementType;
  isEdit: boolean;
  register: UseFormRegister<FormElementType>; // Better to use the full register type
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
          options={"options" in field ? field.options : undefined}
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
