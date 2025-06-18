import { useRouter } from "next/navigation";
import { useCallback } from "react";
import createZodSchema from "@/app/_lib/validationSchema";
import { USER_REGISTRATION_SCHEMA } from "@/app/_constants/schema-names";
import { addItem, register } from "@/app/_services/actions";
import {
  DB_COLLECTION_LEVEL2,
  DB_COLLECTION_LEVEL3,
  DB_REFERENCE_TO_COL1,
  DB_REFERENCE_TO_COL2,
  DB_REFERENCE_TO_COL3,
} from "@/app/_constants/mongodb-config";

export function useButtonFormHandlers({
  pageName,
  resourceType,
  refToIdCollection1,
  refToIdCollection2,
  refToIdCollection3,
  isPageNameValid,
  setError,
  setSuccess,
}: {
  pageName: string;
  resourceType: string | null;
  refToIdCollection1: string;
  refToIdCollection2: string;
  refToIdCollection3: string;
  isPageNameValid: boolean;
  setError: (err: string) => void;
  setSuccess: (msg: string) => void;
}) {
  const router = useRouter();

  //HANDLE USER FORM SEPARATELY FROM OTHER DATA MANIPULATION
  const handleUserRegistration = useCallback(
    async (formData: Record<string, string>) => {
      const result = createZodSchema(USER_REGISTRATION_SCHEMA).safeParse(
        formData
      );
      if (!result.success) {
        setError(`Validation failed: ${result.error}`);
        return;
      }

      const regResult = await register(
        {
          ...result.data,
          refToIdCollection2,
          refToIdCollection3,
        },
        resourceType!
      );
      if ("error" in regResult) {
        setError(regResult.error);
        throw new Error("new error");
      }
      setSuccess(regResult.message);
      router.refresh();
    },
    [
      resourceType,
      refToIdCollection2,
      refToIdCollection3,
      router,
      setError,
      setSuccess,
    ]
  );

  // HANDLE FORM OTHER FROM USER FORM
  const handleItemAddition = useCallback(
    async (formData: Record<string, string>) => {
      try {
        let refToCollectionName, refToIdCollection;

        if (resourceType) {
          refToCollectionName = DB_REFERENCE_TO_COL3;
          refToIdCollection = refToIdCollection3;
        } else {
          switch (pageName) {
            case DB_COLLECTION_LEVEL2:
              refToCollectionName = DB_REFERENCE_TO_COL1;
              refToIdCollection = refToIdCollection1;
              break;
            case DB_COLLECTION_LEVEL3:
              refToCollectionName = DB_REFERENCE_TO_COL2;
              refToIdCollection = refToIdCollection2;
              break;
            default:
              return setError("Invalid collection reference");
          }
        }

        if (!isPageNameValid || !refToCollectionName)
          return setError("Invalid collection reference");

        const item = await addItem(
          { ...formData, refToIdCollection },
          resourceType ? resourceType : pageName,
          refToCollectionName,
          !!resourceType
        );
        if (item.success) setSuccess(item.message);
        router.refresh();
        setSuccess("");
      } catch (err) {
        setError(`Item hasn't been added: ${err}`);
      }
    },
    [
      pageName,
      resourceType,
      refToIdCollection1,
      refToIdCollection2,
      refToIdCollection3,
      isPageNameValid,
      router,
      setError,
      setSuccess,
    ]
  );
  return { handleUserRegistration, handleItemAddition };
}
