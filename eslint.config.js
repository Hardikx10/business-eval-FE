import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import prettierConfig from 'eslint-config-prettier';


export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  prettierConfig,
  {
    "files": ["*.jsx", "*.tsx"], 
    "rules": {
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": "off"
      
    },
    settings: {
      react: {
        version: "detect",
      },
    }
  }
];