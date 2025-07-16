import path from "path";
import fs from "fs";

export function appendToAppModules(slug: string) {
  const modulesPath = path.resolve(process.cwd(), "app/_config/appModules.ts");
  const modulesContent = fs.readFileSync(modulesPath, "utf-8");

  if (modulesContent.includes(`"${slug}"`)) {
    console.log(`ℹ️ "${slug}" already in appModules`);
    return;
  }

  const updated = modulesContent.replace(
    /(export const appModules = \[)([\s\S]*?)(\];)/,
    (_, start, middle, end) => {
      return `${start}${middle.trimEnd()},\n  "${slug}"\n${end}`;
    }
  );

  fs.writeFileSync(modulesPath, updated);
  console.log(`✅ "${slug}" added to appModules.ts`);
}
