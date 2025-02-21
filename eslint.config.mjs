import eslingPluginImport from "eslint-plugin-import";
import eslintPluginPrettier from "eslint-plugin-prettier";
import pluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import typescriptEslint from "typescript-eslint";

const files = {
  files: ["**/*.{js,mjs,cjs,ts,mts}"],
  ignores: ["node_modules/**/*.*", "dist/**/*.*"],
};

const prettierConfig = [
  {
    ...files,
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
];

const importConfig = [
  {
    ...files,
    plugins: {
      import: eslingPluginImport,
    },
    rules: {
      "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "import/no-named-as-default": "error",
      "import/no-default-export": "error",
    },
  },
  {
    files: ["*.{js,mjs,cjs}"],
    rules: {
      "import/no-default-export": "off",
    },
  },
];

const simpleImportSortConfig = [
  {
    ...files,
    plugins: {
      "simple-import-sort": pluginSimpleImportSort,
    },
    rules: {
      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // External packages
            ["^@?\\w"],

            // Internal packages
            ["^(@/)"],

            // Relative imports
            ["^\\.\\.(?!/?$)", "^\\.\\./?$", "^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],

            // Import types
            ["^@?\\w.*\\u0000$", "^[^.].*\\u0000$", "^\\..*\\u0000$"],

            // Style imports
            ["^.+\\.?(css)$"],
          ],
        },
      ],
    },
  },
];

const typescriptConfig = [
  ...typescriptEslint.configs.strict.map((config) => ({ ...config, ...files })),
  ...typescriptEslint.configs.stylistic.map((config) => ({ ...config, ...files })),
  {
    ...files,
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
];

const config = [
  ...prettierConfig,
  ...importConfig,
  ...simpleImportSortConfig,
  ...typescriptConfig,
  {
    ...files,
    rules: {
      "no-unused-expressions": "error",
    },
  },
  {
    ...files,
    files: ["**/*.{js,cjs}"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];

export default config;
