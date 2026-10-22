import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { siteConfig } from "../config/site";
import { routePath } from "../i18n/routing";
import { EASE_IN_OUT, gsap, prefersReducedMotion } from "../lib/gsap";
import LanguageToggle from "./LanguageToggle";
import { useLocalePath } from "./LocaleProvider";
import { TransitionLink } from "./motion/PageTransition";
import { useSmoothScroll } from "./motion/SmoothScroll";
import ThemeToggle from "./ThemeToggle";

export const navItems = [
	{ path: "/", key: "app.nav.home" },
	{ path: "/features", key: "app.nav.features" },
	{ path: "/pricing", key: "app.nav.pricing" },
	{ path: "/about", key: "app.nav.about" },
] as const;

/** Text that rolls up to a duplicate of itself on hover. */
export function RollText({ children }: { children: string }) {
	return (
		<span className="roll">
			<span>{children}</span>
			<span className="roll-copy" aria-hidden="true">
				{children}
			</span>
		</span>
	);
}

export default function Header() {
	const { t } = useTranslation();
	const localePath = useLocalePath();
	const scroll = useSmoothScroll();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const current = routePath(pathname);
	const header = useRef<HTMLElement>(null);
	const menu = useRef<HTMLDivElement>(null);
	const [open, setOpen] = useState(false);

	// Hide while scrolling down, return on the way up; tint once the page leaves the top.
	useEffect(() => {
		const element = header.current;
		if (!element) return;
		let last = window.scrollY;
		let hidden = false;
		const onScroll = () => {
			const y = window.scrollY;
			element.dataset.scrolled = String(y > 24);
			const shouldHide = y > 240 && y > last && !open;
			if (shouldHide !== hidden) {
				hidden = shouldHide;
				gsap.to(element, {
					yPercent: hidden ? -110 : 0,
					duration: 0.6,
					ease: "power3.out",
				});
			}
			last = y;
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, [open]);

	useEffect(() => {
		const element = menu.current;
		if (!element) return;
		const reduced = prefersReducedMotion();
		if (open) {
			scroll.stop();
			gsap.set(element, { visibility: "visible" });
			gsap
				.timeline()
				.fromTo(
					element,
					{ clipPath: "circle(0% at calc(100% - 2.5rem) 2rem)" },
					{
						clipPath: "circle(150% at calc(100% - 2.5rem) 2rem)",
						duration: reduced ? 0 : 0.9,
						ease: EASE_IN_OUT,
					},
				)
				.fromTo(
					element.querySelectorAll("[data-menu-item]"),
					{ yPercent: 110, opacity: 0 },
					{
						yPercent: 0,
						opacity: 1,
						duration: reduced ? 0 : 0.8,
						stagger: 0.06,
					},
					"-=0.45",
				);
			const onKey = (event: KeyboardEvent) => {
				if (event.key === "Escape") setOpen(false);
			};
			window.addEventListener("keydown", onKey);
			return () => window.removeEventListener("keydown", onKey);
		}
		scroll.start();
		gsap.to(element, {
			clipPath: "circle(0% at calc(100% - 2.5rem) 2rem)",
			duration: reduced ? 0 : 0.6,
			ease: "power3.inOut",
			onComplete: () => {
				gsap.set(element, { visibility: "hidden" });
			},
		});
	}, [open, scroll]);

	return (
		<>
			<a className="skip-link" href="#main">
				{t("app.skip")}
			</a>
			<header
				ref={header}
				className="site-header"
				data-scrolled="false"
				data-menu={open}
			>
				<nav className="site-nav" aria-label="Primary">
					<TransitionLink
						to={localePath("/")}
						className="brand"
						aria-label={siteConfig.name}
					>
						<img
							src="/yuda-logo-192.png"
							alt=""
							width={40}
							height={31}
							className="brand-logo"
						/>
						<span className="brand-word">{t("app.brand")}</span>
					</TransitionLink>
					<div className="nav-links">
						{navItems.slice(1).map((item) => (
							<TransitionLink
								key={item.path}
								to={localePath(item.path)}
								className="nav-link"
								aria-current={current === item.path ? "page" : undefined}
							>
								<RollText>{t(item.key)}</RollText>
							</TransitionLink>
						))}
					</div>
					<div className="nav-controls">
						<LanguageToggle />
						<ThemeToggle />
						<a className="nav-cta" href={siteConfig.appUrl}>
							<RollText>{t("app.cta")}</RollText>
						</a>
						<button
							type="button"
							className="menu-button"
							aria-expanded={open}
							aria-controls="mobile-menu"
							aria-label={open ? t("app.nav.close") : t("app.nav.menu")}
							onClick={() => setOpen((value) => !value)}
						>
							<span data-open={open} />
						</button>
					</div>
				</nav>
			</header>
			<div
				ref={menu}
				id="mobile-menu"
				className="mobile-menu"
				aria-hidden={!open}
				inert={!open}
			>
				<ul>
					{navItems.map((item, index) => (
						<li key={item.path} className="mobile-menu-row">
							<TransitionLink
								data-menu-item
								to={localePath(item.path)}
								onClick={() => setOpen(false)}
								aria-current={current === item.path ? "page" : undefined}
							>
								<span className="mobile-menu-index">0{index + 1}</span>
								{t(item.key)}
							</TransitionLink>
						</li>
					))}
				</ul>
				<div className="mobile-menu-foot" data-menu-item>
					<a className="button button--primary" href={siteConfig.appUrl}>
						{t("app.cta")}
					</a>
					<div className="mobile-menu-toggles">
						<LanguageToggle />
						<ThemeToggle />
					</div>
				</div>
			</div>
		</>
	);
}
