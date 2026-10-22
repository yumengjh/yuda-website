import type { RefObject } from "react";
import {
	gsap,
	prefersReducedMotion,
	ScrollTrigger,
	SplitText,
	useGSAP,
} from "../../lib/gsap";
import { onReveal } from "../../lib/reveal-gate";

const CJK = /[\u3400-\u9fff]/;

/** Query helper limited to one component's root. */
export function scoped(root: Element) {
	return (selector: string) => [
		...root.querySelectorAll<HTMLElement>(selector),
	];
}

const CLOSERS = /^[，。、；：！？）」』”’》〉…—,.;:!?)]$/;
const OPENERS = /^[（「『“‘《〈(]$/;

/**
 * Splits CJK text by character and Latin text by word, returning the animated units.
 * Punctuation is glued to its neighbour so line-breaking rules still hold.
 */
export function splitForLocale(element: Element): HTMLElement[] {
	if (!CJK.test(element.textContent ?? "")) {
		return SplitText.create(element, {
			type: "words",
			wordsClass: "split-unit",
		}).words as HTMLElement[];
	}
	const chars = SplitText.create(element, {
		type: "chars",
		charsClass: "split-unit",
	}).chars as HTMLElement[];
	const units: HTMLElement[] = [];
	let carry = "";
	for (const char of chars) {
		const text = char.textContent ?? "";
		const previous = units.at(-1);
		if (CLOSERS.test(text) && previous) {
			previous.textContent += text;
			char.remove();
		} else if (OPENERS.test(text)) {
			carry += text;
			char.remove();
		} else {
			if (carry) {
				char.textContent = carry + text;
				carry = "";
			}
			units.push(char);
		}
	}
	return units;
}

/**
 * Builds a paused entrance timeline inside `scope` and plays it once nothing
 * covers the page (intro or route curtain).
 */
export function useEntrance(
	scope: RefObject<HTMLElement | null>,
	build: (
		timeline: gsap.core.Timeline,
		q: (selector: string) => HTMLElement[],
	) => void,
) {
	useGSAP(
		() => {
			if (prefersReducedMotion() || !scope.current) return;
			const timeline = gsap.timeline({ paused: true });
			build(timeline, scoped(scope.current));
			const cancel = onReveal(() => timeline.play());
			return cancel;
		},
		{ scope },
	);
}

/** Masked character rise for `[data-hero-line]` headings. */
export function heroLines(
	timeline: gsap.core.Timeline,
	q: (selector: string) => HTMLElement[],
	at: gsap.Position = 0,
) {
	const lines = q("[data-hero-line]");
	const units = lines.flatMap(splitForLocale);
	timeline.from(
		units,
		{
			yPercent: 115,
			rotate: 8,
			duration: 1.3,
			stagger: 0.045,
			ease: "expo.out",
		},
		at,
	);
	return timeline;
}

/**
 * Declarative scroll effects shared by every page:
 * - `data-reveal`: rise and fade in once.
 * - `data-parallax="0.2"`: drift on scroll by the given speed.
 * - `data-scrub-text`: characters or words light up as the block scrolls past.
 * - `data-line-draw`: a border that draws from the left.
 */
export function useScrollEffects(scope: RefObject<HTMLElement | null>) {
	useGSAP(
		() => {
			if (prefersReducedMotion() || !scope.current) return;
			const q = scoped(scope.current);
			const reveals = q("[data-reveal]");
			gsap.set(reveals, { opacity: 0 });
			ScrollTrigger.batch(reveals, {
				start: "top 88%",
				once: true,
				onEnter: (batch) =>
					gsap.fromTo(
						batch,
						{ y: 60, opacity: 0 },
						{ y: 0, opacity: 1, duration: 1.2, stagger: 0.1, overwrite: true },
					),
			});

			for (const element of q("[data-parallax]")) {
				const speed = Number(element.dataset.parallax) || 0.2;
				gsap.fromTo(
					element,
					{ yPercent: -speed * 50 },
					{
						yPercent: speed * 50,
						ease: "none",
						scrollTrigger: {
							trigger: element.parentElement ?? element,
							start: "top bottom",
							end: "bottom top",
							scrub: true,
						},
					},
				);
			}

			for (const element of q("[data-scrub-text]")) {
				gsap.fromTo(
					splitForLocale(element),
					{ opacity: 0.14 },
					{
						opacity: 1,
						stagger: 0.1,
						ease: "none",
						scrollTrigger: {
							trigger: element,
							start: "top 80%",
							end: "bottom 45%",
							scrub: true,
						},
					},
				);
			}

			for (const element of q("[data-line-draw]")) {
				gsap.from(element, {
					scaleX: 0,
					transformOrigin: "left center",
					duration: 1.6,
					ease: "expo.inOut",
					scrollTrigger: { trigger: element, start: "top 90%", once: true },
				});
			}
		},
		{ scope },
	);
}
