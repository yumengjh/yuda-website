import { createSiteConfig } from "./site-config";

export const siteConfig = createSiteConfig(
	import.meta.env,
	import.meta.env.PROD,
);
