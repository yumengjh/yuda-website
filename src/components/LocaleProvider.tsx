import { createContext, type ReactNode, useContext, useMemo } from "react";
import { I18nextProvider } from "react-i18next";
import { createI18n } from "../i18n";
import { en } from "../i18n/locales/en";
import { zh } from "../i18n/locales/zh";
import type { Locale } from "../i18n/routing";

const LocaleContext = createContext<Locale>("zh");

export function LocaleProvider({
	children,
	locale,
}: {
	children: ReactNode;
	locale: Locale;
}) {
	const i18n = useMemo(() => createI18n(locale), [locale]);
	return (
		<LocaleContext.Provider value={locale}>
			<I18nextProvider i18n={i18n}>{children}</I18nextProvider>
		</LocaleContext.Provider>
	);
}

export function useLocale() {
	return useContext(LocaleContext);
}

/** Structured page copy for the current locale; chrome strings still go through `t`. */
export function useCopy() {
	return useContext(LocaleContext) === "en" ? en : zh;
}

/** Prefixes an app path with the current locale. */
export function useLocalePath() {
	const locale = useContext(LocaleContext);
	return (path: string) =>
		locale === "en" ? `/en${path === "/" ? "" : path}` : path;
}
