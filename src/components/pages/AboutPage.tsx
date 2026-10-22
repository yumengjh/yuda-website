import { useRef } from "react";
import { siteConfig } from "../../config/site";
import { gsap, prefersReducedMotion, useGSAP } from "../../lib/gsap";
import { useCopy } from "../LocaleProvider";
import { scoped, useScrollEffects } from "../motion/hooks";
import { Sticker } from "../Sticker";
import { CtaBlock, PageHero } from "./shared";

export function AboutPage() {
	const copy = useCopy().about;
	const root = useRef<HTMLElement>(null);
	useScrollEffects(root);

	useGSAP(
		() => {
			const element = root.current;
			if (!element || prefersReducedMotion()) return;
			const q = scoped(element);

			// The logo turns and settles as it passes through the viewport.
			gsap.fromTo(
				q("[data-logo]"),
				{ rotate: -12, scale: 0.75, yPercent: 20 },
				{
					rotate: 6,
					scale: 1.05,
					yPercent: -20,
					ease: "none",
					scrollTrigger: {
						trigger: q("[data-logo-stage]")[0],
						start: "top bottom",
						end: "bottom top",
						scrub: true,
					},
				},
			);
			const stage = q("[data-logo-stage]")[0];
			const logo = q("[data-logo-tilt]")[0];
			let detach = () => {};
			if (stage && logo && window.matchMedia("(pointer: fine)").matches) {
				const rx = gsap.quickTo(logo, "rotationX", {
					duration: 0.8,
					ease: "power3",
				});
				const ry = gsap.quickTo(logo, "rotationY", {
					duration: 0.8,
					ease: "power3",
				});
				gsap.set(logo, { transformPerspective: 800 });
				const move = (event: PointerEvent) => {
					const box = stage.getBoundingClientRect();
					ry(((event.clientX - box.left) / box.width - 0.5) * 30);
					rx(-((event.clientY - box.top) / box.height - 0.5) * 30);
				};
				const leave = () => {
					rx(0);
					ry(0);
				};
				stage.addEventListener("pointermove", move);
				stage.addEventListener("pointerleave", leave);
				detach = () => {
					stage.removeEventListener("pointermove", move);
					stage.removeEventListener("pointerleave", leave);
				};
			}

			// Value words slide in opposite directions as the section scrolls by.
			q("[data-value-word]").forEach((word, index) => {
				gsap.fromTo(
					word,
					{ xPercent: index % 2 ? 18 : -18 },
					{
						xPercent: index % 2 ? -6 : 6,
						ease: "none",
						scrollTrigger: {
							trigger: word,
							start: "top bottom",
							end: "bottom top",
							scrub: true,
						},
					},
				);
			});

			// Each shortcut we refuse gets struck through.
			for (const text of q("[data-strike]")) {
				gsap.fromTo(
					text,
					{ "--strike": "0%" },
					{
						"--strike": "100%",
						ease: "none",
						scrollTrigger: {
							trigger: text,
							start: "top 80%",
							end: "top 50%",
							scrub: true,
						},
					},
				);
			}
			return detach;
		},
		{ scope: root },
	);

	return (
		<main id="main" ref={root} className="page page--about">
			<PageHero
				eyebrow={copy.hero.eyebrow}
				lines={copy.hero.lines}
				sub={copy.hero.sub}
			/>

			<section className="logo-stage" data-logo-stage aria-hidden="true">
				<Sticker
					kind="spark"
					className="logo-spark logo-spark--a"
					outline={false}
				/>
				<Sticker
					kind="spark"
					className="logo-spark logo-spark--b"
					outline={false}
				/>
				<div data-logo>
					<img
						data-logo-tilt
						src="/yuda-logo-720.webp"
						alt=""
						width={720}
						height={556}
						loading="lazy"
						className="logo-stage-image"
					/>
				</div>
			</section>

			<section className="story shell">
				<p className="manifesto-text" data-scrub-text>
					{copy.story}
				</p>
			</section>

			<section className="values">
				{copy.values.map((value) => (
					<div key={value.word} className="value-row">
						<div className="value-word" data-value-word>
							<span className="value-cjk">{value.word}</span>
							<span className="value-latin num">{value.latin}</span>
						</div>
						<p className="value-body shell" data-reveal>
							{value.body}
						</p>
					</div>
				))}
			</section>

			<section className="refuse inverse">
				<div className="shell">
					<p className="eyebrow" data-reveal>
						{copy.refuse.eyebrow}
					</p>
					<h2 className="title" data-reveal>
						{copy.refuse.title}
					</h2>
					<ul className="refuse-list">
						{copy.refuse.items.map((item) => (
							<li key={item} className="refuse-item" data-reveal>
								<span className="refuse-text" data-strike>
									{item}
								</span>
							</li>
						))}
					</ul>
				</div>
			</section>

			<CtaBlock
				title={copy.cta.title}
				button={copy.cta.button}
				href={siteConfig.appUrl}
			/>
		</main>
	);
}
