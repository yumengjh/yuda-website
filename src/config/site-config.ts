export interface PublicSiteEnvironment extends Record<string, unknown> {
	VITE_SITE_APP_URL?: string;
	VITE_SITE_AUTHOR?: string;
	VITE_SITE_DESCRIPTION?: string;
	VITE_SITE_GITHUB_URL?: string;
	VITE_SITE_NAME?: string;
	VITE_SITE_NAVIGATION_PROGRESS?: string;
	VITE_SITE_NAVIGATION_PROGRESS_DELAY_MS?: string;
	VITE_SITE_OG_IMAGE?: string;
	VITE_SITE_PROMO_POSTER?: string;
	VITE_SITE_PROMO_VIDEO_URL?: string;
	VITE_SITE_TITLE_SEPARATOR?: string;
	VITE_SITE_URL?: string;
}

const defaults = {
	name: "鱼搭",
	url: "https://example.com",
	description:
		"鱼搭：拍照入柜、自动整理、按天气与场景推荐今天穿什么的 AI 数字衣柜。",
	author: "鱼搭",
	appUrl: "https://yuda.yumg.cn/",
	ogImage: "/og-default.png",
	promoVideoUrl: "https://cdntc.yumg.cn/yuda/yuda-promo.mp4",
	promoPoster: "/shots/promo-poster.jpg",
	githubUrl: "https://github.com/your-org/your-project",
	titleSeparator: " | ",
	navigationProgress: true,
	navigationProgressDelayMs: 120,
} as const;

function configuredValue(value: unknown, fallback: string) {
	return typeof value === "string" ? value.trim() || fallback : fallback;
}

function configuredBoolean(value: unknown, fallback: boolean) {
	if (typeof value !== "string") return fallback;
	if (value.trim().toLowerCase() === "true") return true;
	if (value.trim().toLowerCase() === "false") return false;
	return fallback;
}

function configuredDelay(value: unknown, fallback: number) {
	if (typeof value !== "string") return fallback;
	const delay = Number(value.trim());
	return Number.isInteger(delay) && delay >= 0 && delay <= 10_000
		? delay
		: fallback;
}

function configuredTitleSeparator(value: unknown, fallback: string) {
	return typeof value === "string" && value.trim() ? value : fallback;
}

export function createSiteConfig(
	env: PublicSiteEnvironment,
	isProduction = false,
) {
	const configuredUrl = configuredValue(env.VITE_SITE_URL, defaults.url);
	const parsedUrl = new URL(configuredUrl);

	if (isProduction && parsedUrl.protocol !== "https:") {
		throw new Error("VITE_SITE_URL must use HTTPS in production");
	}

	return {
		name: configuredValue(env.VITE_SITE_NAME, defaults.name),
		url: parsedUrl.origin,
		description: configuredValue(
			env.VITE_SITE_DESCRIPTION,
			defaults.description,
		),
		author: configuredValue(env.VITE_SITE_AUTHOR, defaults.author),
		appUrl: configuredValue(env.VITE_SITE_APP_URL, defaults.appUrl),
		ogImage: configuredValue(env.VITE_SITE_OG_IMAGE, defaults.ogImage),
		promoVideoUrl: configuredValue(
			env.VITE_SITE_PROMO_VIDEO_URL,
			defaults.promoVideoUrl,
		),
		promoPoster: configuredValue(
			env.VITE_SITE_PROMO_POSTER,
			defaults.promoPoster,
		),
		githubUrl: configuredValue(env.VITE_SITE_GITHUB_URL, defaults.githubUrl),
		titleSeparator: configuredTitleSeparator(
			env.VITE_SITE_TITLE_SEPARATOR,
			defaults.titleSeparator,
		),
		navigationProgress: configuredBoolean(
			env.VITE_SITE_NAVIGATION_PROGRESS,
			defaults.navigationProgress,
		),
		navigationProgressDelayMs: configuredDelay(
			env.VITE_SITE_NAVIGATION_PROGRESS_DELAY_MS,
			defaults.navigationProgressDelayMs,
		),
	} as const;
}
