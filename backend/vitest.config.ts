import path from "path";

// Reference: https://stackoverflow.com/questions/76179780/vitest-loading-absolute-path-working-for-some-components-but-not-all

const config = {
  resolve: {
    alias: [
      {
        find: "@collectionNames",
        replacement: path.resolve(
          __dirname,
          "./src/constants/collectionNames.ts"
        ),
      },
      {
        find: "@controllers",
        replacement: path.resolve(__dirname, "./src/controllers"),
      },
      {
        find: "@models",
        replacement: path.resolve(__dirname, "./src/models"),
      },
      {
        find: "@repositories",
        replacement: path.resolve(__dirname, "./src/repositories"),
      },
      {
        find: "@routes",
        replacement: path.resolve(__dirname, "./src/routes"),
      },
      {
        find: "@services",
        replacement: path.resolve(__dirname, "./src/services"),
      },
      {
        find: "@utils",
        replacement: path.resolve(__dirname, "./src/utils"),
      },
    ],
  },
};

export default config;
