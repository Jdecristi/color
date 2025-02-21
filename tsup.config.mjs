import { defineConfig } from "tsup";

const config = defineConfig({
  format: ["cjs", "esm"],
  entry: ["./index.ts"],
  dts: true,
  shims: true,
  skipNodeModulesBundle: true,
  clean: true,
});

export default config;
