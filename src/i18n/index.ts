import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "./locales/en";
import { zh } from "./locales/zh";
import type { Locale } from "./routing";

export const resources = {
	zh: { translation: zh },
	en: { translation: en },
} as const;

export function createI18n(locale: Locale) {
	const instance = i18next.createInstance();
	void instance.use(initReactI18next).init({
		resources,
		lng: locale,
		fallbackLng: "zh",
		interpolation: { escapeValue: false },
		initImmediate: false,
	});
	return instance;
}
