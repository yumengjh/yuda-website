import { createFileRoute } from "@tanstack/react-router";
import { PricingPage } from "../components/pages/PricingPage";
import { createI18n } from "../i18n";
import { getPageSeo, getWebPageSchema } from "../lib/seo";

const i18n = createI18n("zh");
const title = i18n.t("seo.pricing.title");
const description = i18n.t("seo.pricing.description");

export const Route = createFileRoute("/pricing")({
	head: () => ({
		...getPageSeo({
			path: "/pricing",
			title,
			description,
			keywords: i18n.t("seo.pricing.keywords"),
		}),
		scripts: [
			{
				type: "application/ld+json",
				children: getWebPageSchema({ path: "/pricing", title, description }),
			},
		],
	}),
	component: PricingPage,
});
