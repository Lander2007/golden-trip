import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./tests",
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000",
    trace: "off",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
  ...(process.env.PLAYWRIGHT_START_SERVER
    ? {
        webServer: {
          command: "npx next start -p 3456",
          url: "http://localhost:3456/en",
          reuseExistingServer: true,
          timeout: 120000,
        },
      }
    : {}),
})
