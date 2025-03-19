/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm } from "react-hook-form";
import { FormElement, FormConfig } from "@/app/_types/types";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface FormGeneratorProps {
  formSchema: FormConfig;
  onSubmit: (data: FormElement) => void;
  formId: string;
  validationSchema: ZodType<any, any, any>;
}

function FormGenerator({
  formSchema,
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

  console.log(errors);
  return (
    <form
      id={formId}
      className="flex flex-col"
      onSubmit={handleSubmit(onSubmit)}
    >
      {formSchema.map((schema, i) => {
        if (schema.type === "label")
          return (
            <label key={i} htmlFor={schema.for}>
              {schema.content}
            </label>
          );

        if (
          schema.type === "input" ||
          schema.type === "email" ||
          schema.type === "password"
        )
          return (
            <div key={i}>
              <input
                type={schema.type}
                id={schema.id}
                placeholder={schema.placeholder}
                {...register(schema.name as keyof FormElement)}
              />
              {errors[schema.name]?.message && (
                <p className="text-sm text-red-500">
                  {errors[schema.name]?.message as string}
                </p>
              )}
            </div>
          );
        if (schema.type === "select")
          return (
            <div key={i}>
              <select
                id={schema.id}
                {...register(schema.name as keyof FormElement)}
              >
                {schema.options.map((option) => {
                  return (
                    <option key={option.value} value={option.value}>
                      {option.content}
                    </option>
                  );
                })}
              </select>
              {errors[schema.name]?.message && (
                <p className="text-sm text-red-500">
                  {errors[schema.name]?.message as string}
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
