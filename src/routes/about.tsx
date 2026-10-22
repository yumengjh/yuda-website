import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "../components/pages/AboutPage";
import { createI18n } from "../i18n";
import { getPageSeo, getWebPageSchema } from "../lib/seo";

const i18n = createI18n("zh");
const title = i18n.t("seo.about.title");
const description = i18n.t("seo.about.description");

export const Route = createFileRoute("/about")({
	head: () => ({
		...getPageSeo({
			path: "/about",
			title,
			description,
			keywords: i18n.t("seo.about.keywords"),
		}),
		scripts: [
			{
				type: "application/ld+json",
				children: getWebPageSchema({ path: "/about", title, description }),
			},
		],
	}),
	component: AboutPage,
});
