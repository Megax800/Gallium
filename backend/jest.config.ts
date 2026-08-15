export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",

  roots: ["<rootDir>/tests"],

  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "tsconfig-test.json",
      },
    ],
  },

  extensionsToTreatAsEsm: [".ts"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],

  transformIgnorePatterns: ["node_modules/(?!(?:@mikro-orm|mongodb|bson)/)"],
};
