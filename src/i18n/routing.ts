export const appLocales = ["zh", "en"] as const;

export type Locale = (typeof appLocales)[number];

export function localeFromPathname(pathname: string): Locale {
	return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "zh";
}

export function localizePath(pathname: string, locale: Locale) {
	const path = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
	return locale === "en" ? `/en${path === "/" ? "" : path}` : path;
}

export function routePath(pathname: string) {
	return pathname.replace(/^\/en(?=\/|$)/, "") || "/";
}
