/// <reference types="vitest" />

import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.ts";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      coverage: {
        exclude: ["src/api"],
        include: ["src"],
      },
      environment: "jsdom",
      globals: true,
    //   printConsoleTrace: true,
      onConsoleLog(log: string, type: 'stdout' | 'stderr'): boolean | void {
        return !(log === 'message from third party library' && type === 'stdout')
      },
    },
  })
);
