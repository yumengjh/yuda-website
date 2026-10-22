import { createFileRoute } from "@tanstack/react-router";
import { FeaturesPage } from "../../components/pages/FeaturesPage";
import { createI18n } from "../../i18n";
import { getPageSeo, getWebPageSchema } from "../../lib/seo";

const i18n = createI18n("en");
const title = i18n.t("seo.features.title");
const description = i18n.t("seo.features.description");

export const Route = createFileRoute("/en/features")({
	head: () => ({
		...getPageSeo({
			path: "/en/features",
			title,
			description,
			keywords: i18n.t("seo.features.keywords"),
		}),
		scripts: [
			{
				type: "application/ld+json",
				children: getWebPageSchema({
					path: "/en/features",
					title,
					description,
				}),
			},
		],
	}),
	component: FeaturesPage,
});
