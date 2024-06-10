const config = {
  collectCoverageFrom: ["**/*.mjs", "!jest.config.mjs", "!schemas/**"], // Collect coverage from .mjs files
  coverageReporters: ["text", "html"], // Generate text and HTML coverage reports
  coverageDirectory: "coverage", // Output directory for coverage reports
  testMatch: ["**/__tests__/**/*.mjs?(x)", "**/?(*.)+(spec|test).mjs?(x)"], // Include .mjs test files

  transform: {
    "^.+\\.mjs$": "babel-jest", // Use babel-jest to transform .mjs files
  },
};

export default config;
