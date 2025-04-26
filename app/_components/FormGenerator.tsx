/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm } from "react-hook-form";
import { FormElementType, FormConfig } from "@/app/_types/types";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BaseSyntheticEvent, useEffect } from "react";
import FormElement from "./FormElement";
import createZodSchema from "@/app/_lib/validationSchema";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

interface FormGeneratorProps {
  formFields: FormConfig;
  onSubmit: (data: Partial<FormElementType>) => Promise<void>;
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  //CONFIGURE ZOD SCHEMA FOR VALIDATION
  let schema: ZodType<any, any, any>;
  //IF IT IS SPECIFIC SCHEMA CONFIGURE AS THE SPECIFIC SCHEMA
  if (validationSchema) schema = createZodSchema(validationSchema);
  //IF IT IS GENERAL SCHEMA CONFIGURE AS THE GENERAL SCHEMA
  else schema = createZodSchema(undefined, formFields);

  //CREATE SCHEMA TYPE FOR USEFORM
  type ValidationSchema = z.infer<typeof schema>;

  const completedDefaults = Object.keys(formFields).reduce((acc, key) => {
    acc[key] = defaultValues?.[key] ?? "";
    return acc;
  }, {} as Record<string, any>);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, isDirty, dirtyFields },
    reset,
    getValues,
  } = useForm<ValidationSchema>({
    resolver: zodResolver(schema),

    defaultValues: completedDefaults,
  });

  // CLEAR EDIT PARAMS WHEN THE PAGE IS REFRESHED
  useEffect(function () {
    if (isEdit) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("edit");
      router.replace(`${pathname}?${params.toString()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //TAKE NEW DEFAULT VALUE AFTER SUBMISSION OR RESET FORM
  useEffect(
    function () {
      if (isSubmitSuccessful) {
        if (isEdit) {
          const params = new URLSearchParams(searchParams.toString());
          params.delete("edit");
          router.refresh();
          router.replace(`${pathname}?${params.toString()}`);
        } else reset();
      }
    },
    [isSubmitSuccessful, reset, router, isEdit, pathname, searchParams]
  );

  //TO MONITOR IF FORM DATA IS CHANGED SO IT CAN BE SAVED
  useEffect(
    function () {
      //IF FIELDS ARE DIRTY - ADD ISDIRTY PARAMS TO MONITOR FOR SAVE BUTTON
      const params = new URLSearchParams(searchParams.toString());
      if (isDirty) {
        params.set("isDirty", "true");
        router.push(pathname + "?" + params);
      }
      if (!isDirty && searchParams.get("isDirty")) {
        params.delete("isDirty");
        router.replace(pathname + "?" + params);
      }
    },
    [isDirty, pathname, router, searchParams]
  );

  //RESET TO DEFAULT VALUE WHEN PRESS CANCEL (FIELDS ARE DIRTY AND NO EDIT)
  useEffect(
    function () {
      if (isDirty && !isEdit) {
        reset(defaultValues);
      }
    },
    [defaultValues, isDirty, isEdit, reset]
  );

  // HANDLE SUBMIT PASSED AS A PROPS
  const handelOnSubmit = async (e: BaseSyntheticEvent) => {
    //PREVENT SUBBMITING THE FORM BY 'ENTER' WITHOUT DATA IN THE FIELDS
    if (!isDirty && isEdit) {
      e.preventDefault();
      return false;
    }
    // SUBMITTING THE DIRTY FIELDS ONLY
    else if (isDirty) {
      const changedFields = Object.keys(dirtyFields).reduce((acc, key) => {
        if (dirtyFields[key]) {
          acc[key] = getValues(key);
        }
        return acc;
      }, {} as { [key: string]: any });
      await handleSubmit(() => onSubmit(changedFields))(e).catch((err) =>
        console.error("Error in the submitted form. Error: " + err)
      );
    }
    //SUBMITTING ALL FIELDS (FOR ADDING ITEMS)
    else
      await handleSubmit(onSubmit)(e).catch((err) =>
        console.error("Error in the submitted form. Error: " + err)
      );
  };
  return (
    <form
      id={formId}
      className={
        isCompactForm ? "flex flex-col" : "flex flex-col w-full h-full"
      }
      onSubmit={handelOnSubmit}
    >
      {Object.entries(formFields).map(([key, field]) => (
        <div key={key} className="flex gap-4 mb-3">
          <label className="w-60 font-bold " htmlFor={field.id}>
            {field.labelName}:
          </label>
          <div className="w-full">
            <FormElement
              type={field.type}
              id={field.id}
              options={"options" in field ? field.options : undefined}
              placeholder={
                "placeholder" in field ? field.placeholder : undefined
              }
              disabled={!isEdit}
              {...register(field.name as keyof FormElementType)}
              className="border h-8 w-full"
            />

            {errors[field.name]?.message && (
              <p className="text-sm text-red-500">
                {errors[field.name]?.message as string}
              </p>
            )}
          </div>
        </div>
      ))}
    </form>
  );
}

export default FormGenerator;
