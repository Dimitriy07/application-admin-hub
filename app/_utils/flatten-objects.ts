/* eslint-disable @typescript-eslint/no-explicit-any */
export function flattenObject(obj: Record<string, any>, prefix = "") {
  return Object.keys(obj).reduce((acc, key) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (
      typeof obj[key] === "object" &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      Object.assign(acc, flattenObject(obj[key], path));
    } else {
      acc[path] = obj[key];
    }
    return acc;
  }, {} as Record<string, any>);
}
