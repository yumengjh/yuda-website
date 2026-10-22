import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { siteConfig } from "../config/site";
import { gsap, useGSAP } from "../lib/gsap";
import { navItems, RollText } from "./Header";
import { useLocalePath } from "./LocaleProvider";
import { TransitionLink } from "./motion/PageTransition";
import { useSmoothScroll } from "./motion/SmoothScroll";

export default function Footer() {
	const { t } = useTranslation();
	const localePath = useLocalePath();
	const scroll = useSmoothScroll();
	const root = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			gsap.from("[data-footer-letter]", {
				yPercent: 100,
				stagger: 0.05,
				ease: "power3.out",
				scrollTrigger: {
					trigger: "[data-footer-word]",
					start: "top bottom",
					end: "bottom bottom",
					scrub: 1,
				},
			});
		},
		{ scope: root },
	);

	return (
		<footer ref={root} className="site-footer">
			<div className="footer-grid shell">
				<div className="footer-intro">
					<p className="footer-slogan">{t("app.footer.slogan")}</p>
					<a className="button button--primary" href={siteConfig.appUrl}>
						{t("app.footer.openApp")}
					</a>
				</div>
				<div>
					<p className="footer-heading">{t("app.footer.explore")}</p>
					<ul className="footer-list">
						{navItems.map((item) => (
							<li key={item.path}>
								<TransitionLink to={localePath(item.path)}>
									<RollText>{t(item.key)}</RollText>
								</TransitionLink>
							</li>
						))}
					</ul>
				</div>
				<div>
					<p className="footer-heading">{t("app.footer.product")}</p>
					<ul className="footer-list">
						<li>
							<a href={siteConfig.appUrl}>
								<RollText>{t("app.footer.openApp")}</RollText>
							</a>
						</li>
						<li>
							<a href={siteConfig.appUrl}>
								<RollText>{t("app.footer.install")}</RollText>
							</a>
						</li>
						<li>
							<button type="button" onClick={() => scroll.scrollTo(0)}>
								<RollText>{t("app.footer.backTop")}</RollText>
							</button>
						</li>
					</ul>
				</div>
			</div>
			<div className="footer-word" data-footer-word aria-hidden="true">
				{["Y", "u", "d", "a"].map((letter) => (
					<span key={letter} className="footer-letter-mask">
						<span data-footer-letter>{letter}</span>
					</span>
				))}
			</div>
			<div className="footer-bottom shell">
				<p>
					© {new Date().getFullYear()} {siteConfig.name}.{" "}
					{t("app.footer.rights")}
				</p>
				<div>
					<a href="#privacy">{t("app.footer.privacy")}</a>
					<a href="#terms">{t("app.footer.terms")}</a>
				</div>
			</div>
		</footer>
	);
}
