import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),

  // Targeted overrides: these rules are too strict for real-world data fetching hooks.
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
      // If you hit this again and want to allow patterns like useCallback(fn, depsVar)
      // consider leaving it on and refactoring instead. But you can turn it off:
      // "react-hooks/use-memo": "off",
    },
  },
]);

export default eslintConfig;
