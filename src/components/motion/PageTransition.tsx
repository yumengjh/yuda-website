import {
	Link,
	type LinkProps,
	useRouter,
	useRouterState,
} from "@tanstack/react-router";
import {
	type AnchorHTMLAttributes,
	createContext,
	type MouseEvent,
	type ReactNode,
	useCallback,
	useContext,
	useRef,
} from "react";
import { useTranslation } from "react-i18next";
import { routePath } from "../../i18n/routing";
import {
	EASE_IN_OUT,
	gsap,
	prefersReducedMotion,
	ScrollTrigger,
} from "../../lib/gsap";
import { holdReveal, releaseReveal } from "../../lib/reveal-gate";
import { useSmoothScroll } from "./SmoothScroll";

type TransitionApi = { go: (to: string) => void };

const TransitionContext = createContext<TransitionApi>({ go: () => {} });

const pageLabelKeys: Record<string, string> = {
	"/": "app.nav.home",
	"/features": "app.nav.features",
	"/pricing": "app.nav.pricing",
	"/about": "app.nav.about",
};

export function PageTransitionProvider({ children }: { children: ReactNode }) {
	const router = useRouter();
	const scroll = useSmoothScroll();
	const { t } = useTranslation();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const curtain = useRef<HTMLDivElement>(null);
	const label = useRef<HTMLSpanElement>(null);
	const busy = useRef(false);

	const go = useCallback(
		async (to: string) => {
			if (busy.current) return;
			if (to === pathname) {
				scroll.scrollTo(0);
				return;
			}
			const root = curtain.current;
			if (!root || prefersReducedMotion()) {
				await router.navigate({ to });
				return;
			}
			busy.current = true;
			holdReveal();
			scroll.stop();
			const panels = root.querySelectorAll<HTMLElement>("[data-curtain-panel]");
			if (label.current) {
				label.current.textContent = t(
					pageLabelKeys[routePath(to)] ?? "app.nav.home",
				);
			}
			gsap.set(root, { visibility: "visible" });
			await gsap
				.timeline()
				.fromTo(
					panels,
					{ yPercent: 100 },
					{ yPercent: 0, duration: 0.8, ease: EASE_IN_OUT, stagger: 0.08 },
				)
				.fromTo(
					"[data-curtain-label] > *",
					{ yPercent: 120, opacity: 0 },
					{ yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.06 },
					"-=0.35",
				);
			await router.navigate({ to });
			scroll.scrollTo(0, true);
			window.scrollTo(0, 0);
			scroll.start();
			releaseReveal();
			requestAnimationFrame(() => ScrollTrigger.refresh());
			await gsap
				.timeline()
				.to("[data-curtain-label] > *", {
					yPercent: -120,
					opacity: 0,
					duration: 0.45,
					ease: "power2.in",
					stagger: 0.04,
				})
				.to(
					[...panels].reverse(),
					{ yPercent: -100, duration: 0.85, ease: EASE_IN_OUT, stagger: 0.08 },
					"-=0.15",
				);
			gsap.set(root, { visibility: "hidden" });
			busy.current = false;
		},
		[pathname, router, scroll, t],
	);

	return (
		<TransitionContext.Provider value={{ go }}>
			{children}
			<div ref={curtain} className="curtain" aria-hidden="true">
				<div
					className="curtain-panel curtain-panel--lilac"
					data-curtain-panel
				/>
				<div className="curtain-panel curtain-panel--ink" data-curtain-panel>
					<div className="curtain-label" data-curtain-label>
						<img src="/yuda-logo-192.png" alt="" width={56} height={43} />
						<span ref={label} className="curtain-title" />
					</div>
				</div>
			</div>
		</TransitionContext.Provider>
	);
}

export function usePageTransition() {
	return useContext(TransitionContext);
}

type TransitionLinkProps = Omit<
	AnchorHTMLAttributes<HTMLAnchorElement>,
	"href"
> & { to: string };

/** A router link that plays the curtain before the route changes. */
export function TransitionLink({ to, onClick, ...rest }: TransitionLinkProps) {
	const { go } = usePageTransition();
	function handleClick(event: MouseEvent<HTMLAnchorElement>) {
		onClick?.(event);
		if (
			event.defaultPrevented ||
			event.button !== 0 ||
			event.metaKey ||
			event.ctrlKey ||
			event.shiftKey ||
			event.altKey
		)
			return;
		event.preventDefault();
		void go(to);
	}
	return (
		<Link
			{...rest}
			to={to as LinkProps["to"]}
			onClick={handleClick}
			preload="intent"
		/>
	);
}
