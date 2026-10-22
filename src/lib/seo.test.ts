import { expect, it } from "vitest";
import { formatPageTitle, getPageSeo } from "./seo";

it("puts the page name before the brand with a configurable separator", () => {
	expect(formatPageTitle("首页", "YUMG", " ｜ ")).toBe("首页 ｜ YUMG");
});

it("creates absolute canonical and Open Graph URLs", () => {
	const seo = getPageSeo({
		path: "/en/features",
		title: "Features",
		description: "Template features",
		keywords: "React, template",
	});

	expect(seo.canonicalUrl).toBe("https://example.com/en/features");
	expect(seo.meta).toContainEqual({
		property: "og:url",
		content: seo.canonicalUrl,
	});
	expect(seo.links).toEqual(
		expect.arrayContaining([
			{
				rel: "alternate",
				hrefLang: "zh-CN",
				href: "https://example.com/features",
			},
			{
				rel: "alternate",
				hrefLang: "en-US",
				href: "https://example.com/en/features",
			},
			{
				rel: "alternate",
				hrefLang: "x-default",
				href: "https://example.com/features",
			},
		]),
	);
});
