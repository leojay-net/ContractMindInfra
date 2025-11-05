import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Allow any types - this is a pragmatic choice for rapid development
      "@typescript-eslint/no-explicit-any": "off",
      // Allow unused vars with underscore prefix
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_"
        }
      ],
      // Allow unescaped entities in JSX
      "react/no-unescaped-entities": "off",
      // Disable purity checks for 3D components (they're intentionally using randomness)
      "react-hooks/purity": "off",
      // Allow setState in effects (controlled usage)
      "react-hooks/set-state-in-effect": "warn",
    }
  }
]);

export default eslintConfig;
