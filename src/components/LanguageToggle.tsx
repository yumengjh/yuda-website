import { useTranslation } from "react-i18next";
import { localizePath } from "../i18n/routing";
import { useLocale } from "./LocaleProvider";

export default function LanguageToggle() {
	const locale = useLocale();
	const { t } = useTranslation();
	function toggleLocale() {
		if (typeof window !== "undefined") {
			window.location.assign(
				localizePath(window.location.pathname, locale === "zh" ? "en" : "zh"),
			);
		}
	}
	return (
		<button
			className="pill-toggle"
			type="button"
			onClick={toggleLocale}
			aria-label={t("app.switchLocale")}
		>
			{t("app.switchLocale")}
		</button>
	);
}
