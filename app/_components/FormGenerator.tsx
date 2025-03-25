/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm } from "react-hook-form";
import { FormElement, FormConfig } from "@/app/_types/types";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface FormGeneratorProps {
  formFields: FormConfig;
  onSubmit: (data: FormElement) => void;
  formId: string;
  validationSchema: ZodType<any, any, any>;
}

function FormGenerator({
  formFields,
  onSubmit,
  formId,
  validationSchema,
}: FormGeneratorProps) {
  type RegValidationSchema = z.infer<typeof validationSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  return (
    <form
      id={formId}
      className="flex flex-col"
      onSubmit={handleSubmit(onSubmit)}
    >
      {formFields.map((field, i) => {
        if (field.type === "label")
          return (
            <label key={i} htmlFor={field.for}>
              {field.content}
            </label>
          );

        if (
          field.type === "input" ||
          field.type === "email" ||
          field.type === "password"
        )
          return (
            <div key={i}>
              <input
                type={field.type}
                id={field.id}
                placeholder={field.placeholder}
                {...register(field.name as keyof FormElement)}
              />
              {errors[field.name]?.message && (
                <p className="text-sm text-red-500">
                  {errors[field.name]?.message as string}
                </p>
              )}
            </div>
          );
        if (field.type === "select")
          return (
            <div key={i}>
              <select
                id={field.id}
                {...register(field.name as keyof FormElement)}
              >
                {field.options.map((option) => {
                  return (
                    <option key={option.value} value={option.value}>
                      {option.content}
                    </option>
                  );
                })}
              </select>
              {errors[field.name]?.message && (
                <p className="text-sm text-red-500">
                  {errors[field.name]?.message as string}
                </p>
              )}
            </div>
          );
      })}
      {/* <div className="mt-4">
        {Object.keys(errors).map((fieldName) => (
          <p key={fieldName} className="text-red-500">
            {errors[fieldName]?.message as string}
          </p>
        ))}
      </div> */}
    </form>
  );
}

export default FormGenerator;
