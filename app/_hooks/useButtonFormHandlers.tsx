import { useRouter } from "next/navigation";
import { useCallback } from "react";
import createZodSchema from "@/app/_lib/validationSchema";
import { USER_REGISTRATION_SCHEMA } from "@/app/_constants/validations-schema-names";
import { addItem, register } from "@/app/_services/actions";
import {
  DB_COLLECTION_LEVEL2,
  DB_COLLECTION_LEVEL3,
  DB_REFERENCE_TO_COL1,
  DB_REFERENCE_TO_COL2,
  DB_REFERENCE_TO_COL3,
} from "@/app/_constants/mongodb-config";

interface UseButtonFormHandlersArgs {
  /** Current page name from the route (used for identifying collection) */
  pageName: string;
  /** Type of resource, if applicable (e.g., "users") */
  resourceType: string | null;
  /** Reference ID to parent collection level 1 (e.g., app ID) */
  refToIdCollection1: string;
  /** Reference ID to parent collection level 2 (e.g., entity ID) */
  refToIdCollection2: string;
  /** Reference ID to parent collection level 3 (e.g., account ID) */
  refToIdCollection3: string;
  /** Determines if the `pageName` is valid (not an ObjectId) */
  isPageNameValid: boolean;
  /** Function to set error messages */
  setError: (err: string) => void;
  /** Function to set success messages */
  setSuccess: (msg: string) => void;
}

/**
 * Custom hook to return two submission handlers:
 * 1. `handleUserRegistration` – used for registering new users with validation.
 * 2. `handleItemAddition` – used for adding generic items with parent references.
 *
 * Both methods report success/error to `setSuccess` and `setError`, and refresh the router.
 *
 * @param {UseButtonFormHandlersArgs} args - Hook input arguments
 * @returns {Object} - Handlers: `handleUserRegistration`, `handleItemAddition`
 */
export function useButtonFormHandlers({
  pageName,
  resourceType,
  refToIdCollection1,
  refToIdCollection2,
  refToIdCollection3,
  isPageNameValid,
  setError,
  setSuccess,
}: UseButtonFormHandlersArgs) {
  const router = useRouter();

  /**
   * Handles user registration.
   * - Validates form data using a Zod schema.
   * - Adds collection references (entity/account IDs).
   * - Submits using `register()` service function.
   */
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
        throw new Error("User registration failed");
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

  /**
   * Handles addition of general (non-user) items.
   * - Determines proper parent reference field and value based on collection level.
   * - Submits using `addItem()` service function.
   * - Automatically detects whether this is a resource item or management item.
   */
  const handleItemAddition = useCallback(
    async (formData: Record<string, string>) => {
      try {
        let refToCollectionName: string | undefined;
        let refToIdCollection: string | undefined;

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

        if (!isPageNameValid || !refToCollectionName) {
          return setError("Invalid collection reference");
        }

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
