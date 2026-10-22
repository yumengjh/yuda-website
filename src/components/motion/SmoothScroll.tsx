import Lenis from "lenis";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useRef,
} from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "../../lib/gsap";

type ScrollApi = {
	scrollTo: (
		target: number | string | HTMLElement,
		immediate?: boolean,
	) => void;
	stop: () => void;
	start: () => void;
};

const fallback: ScrollApi = {
	scrollTo: (target, immediate) => {
		if (typeof target === "number") {
			window.scrollTo({ top: target, behavior: immediate ? "auto" : "smooth" });
			return;
		}
		const element =
			typeof target === "string" ? document.querySelector(target) : target;
		element?.scrollIntoView({ behavior: immediate ? "auto" : "smooth" });
	},
	stop: () => {},
	start: () => {},
};

const ScrollContext = createContext<ScrollApi>(fallback);

/** Lenis drives wheel scrolling on desktop; touch keeps native momentum. */
export function SmoothScroll({ children }: { children: ReactNode }) {
	const api = useRef<ScrollApi>(fallback);

	useEffect(() => {
		if (prefersReducedMotion()) return;
		const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
		lenis.on("scroll", ScrollTrigger.update);
		const tick = (time: number) => lenis.raf(time * 1000);
		gsap.ticker.add(tick);
		gsap.ticker.lagSmoothing(0);
		api.current = {
			scrollTo: (target, immediate) =>
				lenis.scrollTo(target, {
					immediate,
					force: true,
					duration: 1.4,
					offset: typeof target === "number" ? 0 : -72,
				}),
			stop: () => lenis.stop(),
			start: () => lenis.start(),
		};
		const refresh = () => ScrollTrigger.refresh();
		window.addEventListener("load", refresh);
		return () => {
			window.removeEventListener("load", refresh);
			gsap.ticker.remove(tick);
			lenis.destroy();
			api.current = fallback;
		};
	}, []);

	const proxy = useRef<ScrollApi>({
		scrollTo: (target, immediate) => api.current.scrollTo(target, immediate),
		stop: () => api.current.stop(),
		start: () => api.current.start(),
	});

	return (
		<ScrollContext.Provider value={proxy.current}>
			{children}
		</ScrollContext.Provider>
	);
}

export function useSmoothScroll() {
	return useContext(ScrollContext);
}
