import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { EASE_IN_OUT, gsap, prefersReducedMotion } from "../../lib/gsap";
import { releaseReveal } from "../../lib/reveal-gate";
import { useSmoothScroll } from "./SmoothScroll";

const SEEN_KEY = "yuda-intro-seen";

function hasSeenIntro() {
	try {
		return window.sessionStorage.getItem(SEEN_KEY) === "1";
	} catch {
		return false;
	}
}

/** First-load cover. The full version plays once per tab session; later reloads only fade. */
export function Intro() {
	const { t } = useTranslation();
	const root = useRef<HTMLDivElement>(null);
	const counter = useRef<HTMLSpanElement>(null);
	const [done, setDone] = useState(false);
	const scroll = useSmoothScroll();

	useEffect(() => {
		const element = root.current;
		if (!element) return;
		const finish = () => {
			setDone(true);
			scroll.start();
		};
		if (prefersReducedMotion()) {
			releaseReveal();
			finish();
			return;
		}
		scroll.stop();
		if (hasSeenIntro()) {
			const tween = gsap.to(element, {
				opacity: 0,
				duration: 0.5,
				ease: "power2.out",
				delay: 0.1,
				onStart: releaseReveal,
				onComplete: finish,
			});
			return () => {
				tween.kill();
			};
		}
		try {
			window.sessionStorage.setItem(SEEN_KEY, "1");
		} catch {}
		const count = { value: 0 };
		const timeline = gsap
			.timeline({ onComplete: finish })
			.from("[data-intro-logo]", {
				scale: 0.6,
				rotate: -10,
				opacity: 0,
				duration: 1.1,
				ease: "back.out(1.6)",
			})
			.from(
				"[data-intro-meta]",
				{ yPercent: 100, opacity: 0, duration: 0.8, stagger: 0.08 },
				0.1,
			)
			.to(
				count,
				{
					value: 100,
					duration: 1.3,
					ease: "power3.inOut",
					onUpdate: () => {
						if (counter.current) {
							counter.current.textContent = String(
								Math.round(count.value),
							).padStart(3, "0");
						}
					},
				},
				0,
			)
			.to("[data-intro-logo]", {
				yPercent: -40,
				scale: 0.8,
				opacity: 0,
				duration: 0.7,
				ease: "power3.in",
			})
			.to("[data-intro-meta]", { opacity: 0, duration: 0.3 }, "<")
			.add(releaseReveal, "-=0.1")
			.to(
				element,
				{
					clipPath: "inset(0% 0% 100% 0%)",
					duration: 1,
					ease: EASE_IN_OUT,
				},
				"-=0.2",
			);
		return () => {
			timeline.kill();
		};
	}, [scroll]);

	if (done) return null;
	return (
		<div ref={root} className="intro" aria-hidden="true">
			<div className="intro-meta intro-meta--top">
				<span data-intro-meta>鱼搭 · Yuda</span>
				<span data-intro-meta>{t("intro.tagline")}</span>
			</div>
			<img
				data-intro-logo
				className="intro-logo"
				src="/yuda-logo-720.webp"
				alt=""
				width={360}
				height={278}
			/>
			<div className="intro-meta intro-meta--bottom">
				<span data-intro-meta>{t("intro.loading")}</span>
				<span data-intro-meta className="intro-counter">
					<span ref={counter}>000</span>
				</span>
			</div>
		</div>
	);
}
