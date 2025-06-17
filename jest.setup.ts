/* eslint-disable @typescript-eslint/no-explicit-any */
import * as dotenv from "dotenv";
import "@testing-library/jest-dom";
dotenv.config({ path: ".env.local" });
(process.env as any).NODE_ENV = "test";
