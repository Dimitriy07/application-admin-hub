/* eslint-disable @typescript-eslint/no-explicit-any */
import * as dotenv from "dotenv";
import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

dotenv.config({ path: ".env.local" });
(process.env as any).NODE_ENV = "test";

(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;
