import { siteConfig } from "../config/site";
import { localizePath, routePath } from "../i18n/routing";

export interface PageSeoInput {
	path: string;
	title: string;
	description: string;
	keywords: string;
}

export function formatPageTitle(
	pageTitle: string,
	siteName = siteConfig.name,
	titleSeparator = siteConfig.titleSeparator,
) {
	return `${pageTitle}${titleSeparator}${siteName}`;
}

export function getPageSeo(input: PageSeoInput) {
	const canonicalUrl = new URL(input.path, `${siteConfig.url}/`).toString();
	const image = new URL(siteConfig.ogImage, `${siteConfig.url}/`).toString();
	const title = formatPageTitle(
		input.title,
		siteConfig.name,
		siteConfig.titleSeparator,
	);

	return {
		canonicalUrl,
		links: [
			{ rel: "canonical", href: canonicalUrl },
			...getAlternateLocaleLinks(input.path),
		],
		meta: [
			{ title },
			{ name: "description", content: input.description },
			{ name: "keywords", content: input.keywords },
			{ name: "author", content: siteConfig.author },
			{ name: "robots", content: "index, follow" },
			{ property: "og:type", content: "website" },
			{ property: "og:site_name", content: siteConfig.name },
			{ property: "og:url", content: canonicalUrl },
			{ property: "og:title", content: title },
			{ property: "og:description", content: input.description },
			{ property: "og:image", content: image },
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:title", content: title },
			{ name: "twitter:description", content: input.description },
			{ name: "twitter:image", content: image },
		],
	};
}

export function getAlternateLocaleLinks(path: string) {
	const publicPath = routePath(path);
	const zhUrl = new URL(
		localizePath(publicPath, "zh"),
		`${siteConfig.url}/`,
	).toString();
	const enUrl = new URL(
		localizePath(publicPath, "en"),
		`${siteConfig.url}/`,
	).toString();

	return [
		{ rel: "alternate", hrefLang: "zh-CN", href: zhUrl },
		{ rel: "alternate", hrefLang: "en-US", href: enUrl },
		{ rel: "alternate", hrefLang: "x-default", href: zhUrl },
	];
}

export function getWebPageSchema(
	input: Pick<PageSeoInput, "title" | "description" | "path">,
) {
	const url = new URL(input.path, `${siteConfig.url}/`).toString();
	return JSON.stringify({
		"@context": "https://schema.org",
		"@graph": [
			{ "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
			{
				"@type": "WebPage",
				name: formatPageTitle(
					input.title,
					siteConfig.name,
					siteConfig.titleSeparator,
				),
				description: input.description,
				url,
			},
		],
	});
}
