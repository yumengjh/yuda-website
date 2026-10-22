import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "../components/pages/HomePage";
import { createI18n } from "../i18n";
import { getPageSeo, getWebPageSchema } from "../lib/seo";

const i18n = createI18n("zh");
const title = i18n.t("seo.home.title");
const description = i18n.t("seo.home.description");

export const Route = createFileRoute("/")({
	head: () => ({
		...getPageSeo({
			path: "/",
			title,
			description,
			keywords: i18n.t("seo.home.keywords"),
		}),
		scripts: [
			{
				type: "application/ld+json",
				children: getWebPageSchema({ path: "/", title, description }),
			},
		],
	}),
	component: HomePage,
});
