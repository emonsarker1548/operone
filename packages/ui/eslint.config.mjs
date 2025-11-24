import { config } from "@repo/eslint-config/react-internal";

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    rules: {
      "no-console": "off",
      "react/prop-types": "off",
      "react/no-unknown-property": "off",
    },
  },
  {
    files: ["*.js", "*.mjs"],
    languageOptions: {
      globals: {
        module: "readonly",
        require: "readonly",
      },
    },
  },
];
