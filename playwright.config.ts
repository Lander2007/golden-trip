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
    baseURL: "http://localhost:3456",
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
  webServer: {
    command: "npx next start -p 3456",
    url: "http://localhost:3456/en",
    reuseExistingServer: true,
    timeout: 120000,
  },
})
