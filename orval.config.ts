import { defineConfig } from "orval";

export default defineConfig({
  "domain-provider-api": {
    input: "./openapi-domain-provider.json",
    output: {
      client: "react-query",
      target: "./src/api/generated/domain-provider-api.ts",
      schemas: "./src/api/generated/model",
      override: {
        mutator: {
          path: "./src/api/axios-instance.ts",
          name: "customInstance",
        },
      },
    },
  },
});
