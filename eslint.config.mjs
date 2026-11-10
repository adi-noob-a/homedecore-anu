import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "phase-1-deliverables/**",
  ]),
  {
    files: ["src/components/product-viewer/**/*.{ts,tsx}"],
    rules: {
      // react-three-fiber attaches three.js props (args, roughness, metalness, …) through JSX.
      "react/no-unknown-property": "off",
    },
  },
]);

export default eslintConfig;
