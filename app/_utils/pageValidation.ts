export const isNotId = (str: string): boolean => {
  // Regular expression to match a 24-character hexadecimal string
  const idRegex = /^[0-9a-fA-F]{24}$/;
  return !idRegex.test(str);
};
