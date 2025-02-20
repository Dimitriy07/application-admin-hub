import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  projects: [
    {
      displayName: "react",
      preset: "ts-jest",
      // testEnvironment: "node",
      testEnvironment: "jsdom",
      moduleNameMapper: {
        "^@/app/(.*)$": "<rootDir>/app/$1",
      },
      setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
      transform: {
        "^.+.tsx?$": ["ts-jest", {}],
      },
      // coverageProvider: "v8"
      testMatch: ["<rootDir>/app/__test__/**/*.test.ts?(x)"],
    },
    {
      displayName: "database",
      preset: "ts-jest",
      testEnvironment: "node",
      // testEnvironment: "jsdom",
      moduleNameMapper: {
        "^@/app/(.*)$": "<rootDir>/app/$1",
      },
      setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
      transform: {
        "^.+.tsx?$": ["ts-jest", {}],
      },
      testMatch: ["<rootDir>/app/__test__/**/*.node.test.ts?(x)"],
      // coverageProvider: "v8"
    },
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
