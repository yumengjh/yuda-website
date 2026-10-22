import { expect, test } from "@playwright/test";

test("renders localized SSR metadata and switches language", async ({ page }) => {
	const response = await page.goto("/");

	expect(response?.status()).toBe(200);
	await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
	await expect(page).toHaveTitle(/^AI 数字衣柜 .+ 鱼搭$/);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		"https://example.com/",
	);
	await expect(
		page.locator('link[rel="alternate"][hreflang="en-US"]'),
	).toHaveAttribute("href", "https://example.com/en");

	await page.getByRole("button", { name: "EN" }).first().click();
	await expect(page).toHaveURL(/\/en$/);
	await expect(page.locator("html")).toHaveAttribute("lang", "en");
	await expect(page.locator("h1")).toContainText("Snap one.");
});

test("navigates between pages behind the transition curtain", async ({
	page,
}) => {
	await page.goto("/");
	await page.getByRole("link", { name: "价格", exact: true }).first().click();
	await expect(page).toHaveURL(/\/pricing$/);
	await expect(page.locator("h1")).toContainText("选一个方案");

	await page.getByRole("button", { name: /年付/ }).click();
	await expect(page.locator(".plan--featured .plan-amount")).toHaveText("180");
});

test("returns a noindex 404 page and protected response headers", async ({
	page,
	request,
}) => {
	const missingResponse = await page.goto("/missing-page");
	expect(missingResponse?.status()).toBe(404);
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		"noindex, nofollow",
	);

	const health = await request.get("/health");
	expect(health.ok()).toBeTruthy();
	expect(await health.json()).toEqual({ status: "ok" });

	const home = await request.get("/");
	expect(home.headers()["x-content-type-options"]).toBe("nosniff");
	expect(home.headers()["x-frame-options"]).toBe("DENY");
	expect(home.headers()["strict-transport-security"]).toContain(
		"max-age=31536000",
	);
});
