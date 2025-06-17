import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

const sharedConfig = {
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "json",
    "node",
    "mjs",
    "cjs",
    "jsx",
  ],

  moduleNameMapper: {
    "^@/app/(.*)$": "<rootDir>/app/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  extensionsToTreatAsEsm: [".ts"], //other files that should run with native ESM

  preset: "ts-jest",
};

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: "v8",
  // collectCoverage: false,
  projects: [
    {
      ...sharedConfig,
      displayName: { name: "CLIENT", color: "blue" },
      testEnvironment: "jsdom",
      transform: {
        "^.+\\.(js|jsx|ts|tsx)$": [
          "babel-jest",
          {
            presets: [
              [
                "next/babel",
                {
                  "preset-react": {
                    runtime: "automatic", // Enable modern JSX transform
                  },
                },
              ],
            ],
          },
        ],
      },
      testMatch: ["<rootDir>/app/__test__/**/*.jsdom.test.ts?(x)"],
    },
    {
      ...sharedConfig,
      displayName: { name: "SERVER", color: "magenta" },
      testEnvironment: "node",
      transform: {
        "^.+.tsx?$": ["ts-jest", {}],
      },
      testMatch: ["<rootDir>/app/__test__/**/*.node.test.ts?(x)"],
    },
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
