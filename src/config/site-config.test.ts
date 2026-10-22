import { describe, expect, it } from "vitest";

import { createSiteConfig } from "./site-config";

describe("createSiteConfig", () => {
	it("uses safe template defaults when no public environment variables are set", () => {
		expect(createSiteConfig({})).toMatchObject({
			name: "鱼搭",
			appUrl: "https://yuda.yumg.cn/",
			url: "https://example.com",
			ogImage: "/og-default.png",
			titleSeparator: " | ",
			navigationProgress: true,
			navigationProgressDelayMs: 120,
		});
	});

	it("supports a configurable navigation delay and rejects invalid values", () => {
		expect(
			createSiteConfig({
				VITE_SITE_NAVIGATION_PROGRESS_DELAY_MS: "300",
			}),
		).toMatchObject({
			navigationProgressDelayMs: 300,
		});

		expect(
			createSiteConfig({ VITE_SITE_NAVIGATION_PROGRESS_DELAY_MS: "fast" }),
		).toMatchObject({ navigationProgressDelayMs: 120 });
	});

	it("preserves a custom title separator", () => {
		expect(
			createSiteConfig({ VITE_SITE_TITLE_SEPARATOR: " · " }),
		).toMatchObject({ titleSeparator: " · " });
	});

	it("allows the navigation progress indicator to be disabled with a public environment variable", () => {
		expect(
			createSiteConfig({ VITE_SITE_NAVIGATION_PROGRESS: "false" }),
		).toMatchObject({ navigationProgress: false });
	});

	it("normalizes a configured site URL and accepts public overrides", () => {
		expect(
			createSiteConfig({
				VITE_SITE_NAME: "Acme",
				VITE_SITE_URL: "https://acme.example/docs/",
				VITE_SITE_OG_IMAGE: "/social.png",
			}),
		).toMatchObject({
			name: "Acme",
			url: "https://acme.example",
			ogImage: "/social.png",
		});
	});

	it("rejects a non-HTTPS public site URL for production builds", () => {
		expect(() =>
			createSiteConfig({ VITE_SITE_URL: "http://localhost:3000" }, true),
		).toThrow("VITE_SITE_URL must use HTTPS in production");
	});
});
