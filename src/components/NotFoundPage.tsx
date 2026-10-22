import { useTranslation } from "react-i18next";
import { useLocalePath } from "./LocaleProvider";
import { TransitionLink } from "./motion/PageTransition";
import { Sticker } from "./Sticker";

export function NotFoundPage() {
	const { t } = useTranslation();
	const localePath = useLocalePath();
	return (
		<main id="main" className="page not-found shell">
			<div className="not-found-art" aria-hidden="true">
				<span className="not-found-code num">4</span>
				<Sticker kind="tee" className="not-found-sticker float" />
				<span className="not-found-code num">4</span>
			</div>
			<h1 className="title">{t("notFound.title")}</h1>
			<p className="lead">{t("notFound.description")}</p>
			<TransitionLink
				to={localePath("/")}
				className="button button--primary button--lg"
			>
				{t("app.backHome")}
			</TransitionLink>
		</main>
	);
}
