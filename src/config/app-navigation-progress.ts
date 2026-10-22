import { siteConfig } from "./site";

export const appNavigationProgress = {
	delayMs: siteConfig.navigationProgressDelayMs,
	enabled: siteConfig.navigationProgress,
} as const;
