import { createFileRoute } from "@tanstack/react-router";
import { PricingPage } from "../../components/pages/PricingPage";
import { createI18n } from "../../i18n";
import { getPageSeo, getWebPageSchema } from "../../lib/seo";

const i18n = createI18n("en");
const title = i18n.t("seo.pricing.title");
const description = i18n.t("seo.pricing.description");

export const Route = createFileRoute("/en/pricing")({
	head: () => ({
		...getPageSeo({
			path: "/en/pricing",
			title,
			description,
			keywords: i18n.t("seo.pricing.keywords"),
		}),
		scripts: [
			{
				type: "application/ld+json",
				children: getWebPageSchema({ path: "/en/pricing", title, description }),
			},
		],
	}),
	component: PricingPage,
});
