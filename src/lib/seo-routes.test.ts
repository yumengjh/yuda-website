import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { getPageSeo } from "./seo";

it("creates the English home canonical URL", () => {
	expect(
		getPageSeo({
			path: "/en",
			title: "Home",
			description: "Home",
			keywords: "React",
		}).canonicalUrl,
	).toBe("https://example.com/en");
});

it("lists every public localized page in the sitemap", () => {
	const sitemap = readFileSync("public/sitemap.xml", "utf8");
	for (const path of [
		"/",
		"/features",
		"/pricing",
		"/about",
		"/en",
		"/en/features",
		"/en/pricing",
		"/en/about",
	]) {
		expect(sitemap).toContain(`https://example.com${path}`);
	}
});
