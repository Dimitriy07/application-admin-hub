/* eslint-disable @typescript-eslint/no-unused-vars */
import type { RestrictionLogicFn } from "@/app/_types/types";

export const restrictionLogic: RestrictionLogicFn = ({
  collectionName,
  settings,
  resourcesArr,
}) => {
  const isRestricted = false;
  return {
    isRestricted,
  };
};
