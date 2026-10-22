import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	reporter: process.env.CI ? "github" : "list",
	retries: process.env.CI ? 2 : 0,
	testDir: "./e2e",
	use: {
		baseURL: "http://127.0.0.1:4173",
		trace: "on-first-retry",
	},
	webServer: {
		command: "NITRO_HOST=127.0.0.1 NITRO_PORT=4173 node .output/server/index.mjs",
		env: { ...process.env, NITRO_HOST: "127.0.0.1", NITRO_PORT: "4173" },
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
		url: "http://127.0.0.1:4173/health",
	},
	projects: [
		{
			name: "chromium",
			use: {
				...devices["Desktop Chrome"],
				// Point at a preinstalled Chromium when the bundled one is not downloaded.
				launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH
					? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
					: {},
			},
		},
	],
});
