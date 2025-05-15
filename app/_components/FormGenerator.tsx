/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm } from "react-hook-form";
import { FormElementType, FormConfigWithConditions } from "@/app/_types/types";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BaseSyntheticEvent, useContext, useEffect, useMemo } from "react";
import createZodSchema from "@/app/_lib/validationSchema";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import FormRow from "./FormRow";
import { ModalContext } from "./Modal";

interface FormGeneratorProps {
  formFields: FormConfigWithConditions;
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

  const completedDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    //FILL IN FIELDS WITH DEFAULT DATA AND EMPTY DATA IF THERE IS NO DATA IN THE FIELD
    Object.keys(formFields).forEach((key) => {
      if (key !== "conditionalFields") {
        defaults[key] = defaultValues?.[key] ?? "";
      }
    });
    //FILL IN CONDITIONAL FIELDS WITH DEFAULT DATA AND EMPTY DATA IF THERE IS NO DATA IN THE FIELD
    formFields.conditionalFields?.forEach((condition) => {
      Object.keys(condition.fields).forEach((key) => {
        if (!(key in defaults)) {
          defaults[key] = defaultValues?.[key] ?? "";
        }
      });
    });

    return defaults;
  }, [defaultValues, formFields]);

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

  // USE CONTEXT TO CLOSE FORM AFTER SUBMITTING
  const context = useContext(ModalContext);
  let close: () => void;
  if (context) close = context.close;

  const params = useMemo(
    function () {
      return new URLSearchParams(searchParams.toString());
    },
    [searchParams]
  );
  // CLEAR EDIT PARAMS WHEN THE PAGE IS REFRESHED
  useEffect(function () {
    if (isEdit && searchParams.get("edit") === "true") {
      // const params = new URLSearchParams(searchParams.toString());
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
          // const params = new URLSearchParams(searchParams.toString());
          params.delete("edit");
          router.refresh();
          router.replace(`${pathname}?${params.toString()}`);
          if (context) close();
        } else reset();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSubmitSuccessful, reset, router, isEdit, pathname, searchParams, params]
  );

  //TO MONITOR IF FORM DATA IS CHANGED SO IT CAN BE SAVED
  useEffect(
    function () {
      //IF FIELDS ARE DIRTY - ADD ISDIRTY PARAMS TO MONITOR FOR SAVE BUTTON
      // const params = new URLSearchParams(searchParams.toString());
      if (isDirty && searchParams.get("isDirty") !== "true") {
        params.set("isDirty", "true");
        router.push(`${pathname}?${params.toString()}`);
      }
      if (!isDirty && searchParams.get("isDirty") === "true") {
        params.delete("isDirty");
        router.replace(`${pathname}?${params.toString()}`);
      }
    },
    [isDirty, pathname, router, searchParams, params]
  );

  //RESET TO DEFAULT VALUE WHEN PRESS CANCEL (FIELDS ARE DIRTY AND NO EDIT)
  useEffect(
    function () {
      if (isDirty && !isEdit) {
        reset(completedDefaults);
      }
    },
    [completedDefaults, isDirty, isEdit, reset]
  );

  // HANDLE SUBMIT PASSED AS A PROPS
  const handleOnSubmit = async (e: BaseSyntheticEvent) => {
    //PREVENT SUBBMITING THE FORM BY 'ENTER' WITHOUT DATA IN THE FIELDS
    if (!isDirty && isEdit) {
      e.preventDefault();
      return false;
    }
    // SUBMITTING THE DIRTY FIELDS ONLY
    else if (isDirty) {
      const changedFields = Object.keys(dirtyFields).reduce((acc, key) => {
        const typedKey = key as keyof ValidationSchema;
        acc[typedKey as string] = getValues(typedKey as string);
        return acc;
      }, {} as Partial<ValidationSchema>);
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
      onSubmit={handleOnSubmit}
    >
      {/* RENDER INPUT ELEMENT EXCEPT OF CONDITIONAL ELEMENTS */}
      {Object.entries(formFields).map(([key, field]) => {
        // as conditionalFields is array - narrow type to avoid arrays
        if (Array.isArray(field)) return null;
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

      {/* RENDER CONDITIONAL INPUT ELEMENTS */}
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
    </form>
  );
}

export default FormGenerator;
