import { type CSSProperties, useRef } from "react";
import { siteConfig } from "../../config/site";
import { gsap, prefersReducedMotion, useGSAP } from "../../lib/gsap";
import { useCopy } from "../LocaleProvider";
import {
	heroLines,
	scoped,
	useEntrance,
	useScrollEffects,
} from "../motion/hooks";
import { Magnetic } from "../motion/Magnetic";
import { useSmoothScroll } from "../motion/SmoothScroll";
import { Sticker, type StickerKind } from "../Sticker";
import { OotdLooks } from "./OotdLooks";
import { PromoFilm } from "./PromoFilm";
import { ReasonReel } from "./ReasonReel";
import { StickerLab } from "./StickerLab";
import { CtaBlock } from "./shared";

// Desktop positions keep the right half busy and the headline clear; phones use the m* pair.
const heroStickers: {
	kind: StickerKind;
	at: [string, string];
	mobile: [string, string];
	size: string;
	rotate: number;
	depth: number;
}[] = [
	{
		kind: "cap",
		at: ["60%", "18%"],
		mobile: ["4%", "12%"],
		size: "clamp(5rem, 11vw, 10rem)",
		rotate: -14,
		depth: 0.6,
	},
	{
		kind: "tee",
		at: ["80%", "9%"],
		mobile: ["74%", "10%"],
		size: "clamp(6rem, 14vw, 13rem)",
		rotate: 10,
		depth: 1,
	},
	{
		kind: "spark",
		at: ["73%", "4%"],
		mobile: ["58%", "5%"],
		size: "clamp(2.5rem, 5vw, 4.5rem)",
		rotate: 0,
		depth: 1.6,
	},
	{
		kind: "jeans",
		at: ["84%", "40%"],
		mobile: ["74%", "77%"],
		size: "clamp(6rem, 13vw, 12rem)",
		rotate: -8,
		depth: 0.8,
	},
	{
		kind: "sneaker",
		at: ["64%", "47%"],
		mobile: ["2%", "80%"],
		size: "clamp(6rem, 12vw, 11rem)",
		rotate: 8,
		depth: 1.2,
	},
	{
		kind: "bag",
		at: ["57%", "66%"],
		mobile: ["0%", "0%"],
		size: "clamp(3.5rem, 7vw, 6.5rem)",
		rotate: -6,
		depth: 1.8,
	},
	{
		kind: "fish",
		at: ["76%", "64%"],
		mobile: ["0%", "0%"],
		size: "clamp(3rem, 6vw, 5.5rem)",
		rotate: 12,
		depth: 1.4,
	},
];

export function HomePage() {
	const copy = useCopy().home;
	const scroll = useSmoothScroll();
	const root = useRef<HTMLElement>(null);

	useScrollEffects(root);

	useEntrance(root, (timeline, q) => {
		heroLines(timeline, q, 0.1);
		timeline
			.from(
				q("[data-hero-sticker]"),
				{
					scale: 0,
					rotate: () => gsap.utils.random(-90, 90),
					duration: 1.6,
					stagger: 0.06,
					ease: "back.out(1.7)",
				},
				0,
			)
			.from(
				q("[data-hero-fade]"),
				{ y: 40, opacity: 0, duration: 1.2, stagger: 0.08 },
				0.5,
			);
	});

	useGSAP(
		() => {
			const element = root.current;
			if (!element || prefersReducedMotion()) return;
			const q = scoped(element);
			const media = gsap.matchMedia();

			// Hero: stickers follow the pointer by depth and scatter as the page scrolls away.
			const hero = q("[data-hero]")[0];
			const layers = q("[data-depth]");
			const movers = layers.map((layer) => ({
				depth: Number(layer.dataset.depth),
				x: gsap.quickTo(layer, "x", { duration: 1.2, ease: "power3" }),
				y: gsap.quickTo(layer, "y", { duration: 1.2, ease: "power3" }),
			}));
			const onMove = (event: PointerEvent) => {
				const nx = event.clientX / window.innerWidth - 0.5;
				const ny = event.clientY / window.innerHeight - 0.5;
				for (const mover of movers) {
					mover.x(nx * 60 * mover.depth);
					mover.y(ny * 40 * mover.depth);
				}
			};
			hero?.addEventListener("pointermove", onMove);

			const heroScroll = gsap.timeline({
				scrollTrigger: {
					trigger: hero,
					start: "top top",
					end: "bottom top",
					scrub: true,
				},
			});
			heroScroll
				.to(
					q("[data-hero-title]"),
					{ yPercent: 35, scale: 0.92, opacity: 0.15, ease: "none" },
					0,
				)
				.to(
					q("[data-hero-copy]"),
					{ yPercent: 60, opacity: 0, ease: "none" },
					0,
				);
			for (const item of q("[data-hero-sticker]")) {
				const depth = Number(item.dataset.speed);
				heroScroll.to(
					item,
					{ y: -260 * depth, rotate: `+=${40 * (depth - 1)}`, ease: "none" },
					0,
				);
			}

			// Marquee: constant drift that speeds up and flips with scroll velocity.
			const rows = q("[data-marquee-track]").map((track, index) =>
				gsap
					.to(track, { xPercent: -50, duration: 28, ease: "none", repeat: -1 })
					.timeScale(index % 2 ? -1 : 1),
			);
			const marquee = q("[data-marquee]")[0];
			gsap.timeline({
				scrollTrigger: {
					trigger: marquee,
					start: "top bottom",
					end: "bottom top",
					onUpdate: (self) => {
						const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 220, 6);
						rows.forEach((row, index) => {
							const sign = (index % 2 ? -1 : 1) * self.direction;
							gsap.to(row, {
								timeScale: sign * boost,
								duration: 0.2,
								overwrite: true,
							});
							gsap.to(row, { timeScale: sign, duration: 1.4, delay: 0.2 });
						});
						gsap.to(q("[data-marquee-row]"), {
							skewX: -self.getVelocity() / 400,
							duration: 0.4,
							overwrite: true,
						});
						gsap.to(q("[data-marquee-row]"), {
							skewX: 0,
							duration: 1,
							delay: 0.3,
						});
					},
				},
			});

			// Process: horizontal track pinned on wide screens, stacked cards on phones.
			media.add("(min-width: 768px)", () => {
				const section = q("[data-process]")[0];
				const track = q("[data-process-track]")[0];
				if (!section || !track) return;
				const distance = () => track.scrollWidth - window.innerWidth;
				const slide = gsap.to(track, {
					x: () => -distance(),
					ease: "none",
					scrollTrigger: {
						trigger: section,
						start: "top top",
						end: () => `+=${distance()}`,
						pin: true,
						scrub: 1,
						invalidateOnRefresh: true,
					},
				});
				gsap.fromTo(
					q("[data-process-progress]"),
					{ scaleX: 0 },
					{
						scaleX: 1,
						ease: "none",
						scrollTrigger: {
							trigger: section,
							start: "top top",
							end: () => `+=${distance()}`,
							scrub: true,
							invalidateOnRefresh: true,
						},
					},
				);
				for (const panel of q("[data-process-panel]")) {
					const image = panel.querySelector("img");
					const number = panel.querySelector("[data-process-number]");
					gsap.fromTo(
						image,
						{ xPercent: -8, scale: 1.12 },
						{
							xPercent: 8,
							scale: 1,
							ease: "none",
							scrollTrigger: {
								trigger: panel,
								containerAnimation: slide,
								start: "left right",
								end: "right left",
								scrub: true,
							},
						},
					);
					gsap.from(number, {
						yPercent: 100,
						opacity: 0,
						scrollTrigger: {
							trigger: panel,
							containerAnimation: slide,
							start: "left 70%",
							toggleActions: "play none none reverse",
						},
					});
				}
			});

			// Reasons: the screenshot grows from a card to full-bleed while pinned.
			media.add("(min-width: 768px)", () => {
				const stage = q("[data-expand]")[0];
				if (!stage) return;
				const stageTimeline = gsap.timeline({
					scrollTrigger: {
						trigger: stage,
						start: "top top",
						end: "+=180%",
						pin: true,
						scrub: 1,
					},
				});
				stageTimeline
					.fromTo(
						q("[data-expand-media]"),
						{ clipPath: "inset(16% 24% 16% 24% round 28px)" },
						{ clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none" },
					)
					.fromTo(
						q("[data-expand-media] img"),
						{ scale: 1.3 },
						{ scale: 1, ease: "none" },
						0,
					)
					.from(
						q("[data-chip]"),
						{
							y: 80,
							opacity: 0,
							scale: 0.8,
							stagger: 0.12,
							ease: "back.out(2)",
						},
						0.45,
					);
				const scoreEl = q("[data-score]")[0];
				if (scoreEl) {
					const target = Number(scoreEl.dataset.score);
					const counter = { value: 0 };
					scoreEl.textContent = "0";
					stageTimeline.fromTo(
						counter,
						{ value: 0 },
						{
							value: target,
							duration: 0.9,
							ease: "none",
							onUpdate: () => {
								scoreEl.textContent = String(Math.round(counter.value));
							},
						},
						0.45,
					);
				}
				// The hint fades out as soon as the scroll takes over; chips keep drifting.
				stageTimeline
					.to(
						q("[data-expand-hint]"),
						{ opacity: 0, y: -14, duration: 0.25, ease: "none" },
						0.2,
					)
					.to(
						q("[data-chip]"),
						{
							y: (index: number) => (index % 2 ? -42 : 42),
							duration: 0.9,
							ease: "none",
						},
						1.35,
					);
			});

			return () => {
				hero?.removeEventListener("pointermove", onMove);
				media.revert();
			};
		},
		{ scope: root },
	);

	return (
		<main id="main" ref={root} className="page page--home">
			<section className="hero" data-hero>
				<div className="hero-stickers" aria-hidden="true">
					{heroStickers.map((item) => (
						<div
							key={item.kind}
							className="hero-sticker"
							data-hero-sticker
							data-speed={item.depth}
							style={
								{
									"--x": item.at[0],
									"--y": item.at[1],
									"--mx": item.mobile[0],
									"--my": item.mobile[1],
									width: item.size,
								} as CSSProperties
							}
						>
							<div data-depth={item.depth}>
								<div
									className="float"
									style={{
										rotate: `${item.rotate}deg`,
										animationDelay: `${-item.depth * 2}s`,
									}}
								>
									<Sticker kind={item.kind} />
								</div>
							</div>
						</div>
					))}
				</div>
				<div className="hero-inner shell">
					<p className="eyebrow" data-hero-fade>
						<span className="eyebrow-dot" />
						{copy.hero.eyebrow}
					</p>
					<h1 className="display hero-title" data-hero-title>
						{copy.hero.lines.map((line, index) => (
							<span
								key={line}
								className={`line-mask${index ? " line-mask--offset" : ""}`}
							>
								<span data-hero-line className={index ? "hollow" : undefined}>
									{line}
								</span>
							</span>
						))}
					</h1>
					<p className="hero-flow" data-hero-fade aria-hidden="true">
						( {copy.hero.flow} )
					</p>
					<div className="hero-copy" data-hero-copy>
						<p className="lead" data-hero-fade>
							{copy.hero.sub}
						</p>
						<div className="hero-actions" data-hero-fade>
							<Magnetic>
								<a
									className="button button--primary button--lg"
									href={siteConfig.appUrl}
								>
									{copy.hero.primary}
									<span className="button-arrow" aria-hidden="true">
										→
									</span>
								</a>
							</Magnetic>
							<button
								type="button"
								className="button button--ghost button--lg"
								onClick={() => scroll.scrollTo("#process")}
							>
								{copy.hero.secondary}
							</button>
						</div>
					</div>
				</div>
				<p className="hero-vertical" aria-hidden="true">
					YUDA — DIGITAL WARDROBE — 鱼搭
				</p>
				<div className="hero-foot shell" data-hero-fade>
					<span className="hero-badge">{copy.hero.badge}</span>
					<span className="scroll-cue">
						<span className="scroll-cue-line" aria-hidden="true" />
						{copy.hero.scroll}
					</span>
				</div>
			</section>

			<section
				className="marquee"
				data-marquee
				aria-label={copy.marquee.join(" · ")}
			>
				{[0, 1].map((row) => (
					<div
						key={row}
						className={`marquee-row marquee-row--${row}`}
						data-marquee-row
						aria-hidden="true"
					>
						<div className="marquee-track" data-marquee-track>
							{[0, 1].map((copyIndex) => (
								<div key={copyIndex} className="marquee-group">
									{(row ? [...copy.marquee].reverse() : copy.marquee).map(
										(word) => (
											<span key={word} className="marquee-item">
												{word}
												<Sticker
													kind={row ? "fish" : "spark"}
													outline={false}
													className="marquee-glyph"
												/>
											</span>
										),
									)}
								</div>
							))}
						</div>
					</div>
				))}
			</section>

			<section className="manifesto shell">
				<p className="manifesto-text" data-scrub-text>
					{copy.manifesto}
				</p>
			</section>

			<PromoFilm copy={copy.film} />

			<section id="process" className="process inverse" data-process>
				<div className="process-head shell">
					<p className="eyebrow">{copy.process.eyebrow}</p>
					<h2 className="title">{copy.process.title}</h2>
				</div>
				<div className="process-track" data-process-track>
					{copy.process.steps.map((step, index) => (
						<article
							key={step.title}
							className="process-panel"
							data-process-panel
							data-reveal
						>
							<div className="process-text">
								<span className="process-number-mask">
									<span className="process-number" data-process-number>
										0{index + 1}
									</span>
								</span>
								<p className="process-tag">{step.tag}</p>
								<h3 className="process-title">{step.title}</h3>
								<p className="process-body">{step.body}</p>
							</div>
							<figure className="frame process-frame" data-cursor={step.tag}>
								<div className="frame-bar" aria-hidden="true">
									<i />
									<i />
									<i />
								</div>
								<div className="frame-media">
									<img
										src={step.image}
										alt={step.title}
										loading="lazy"
										width={1100}
										height={687}
									/>
								</div>
							</figure>
						</article>
					))}
				</div>
				<div className="process-progress shell" aria-hidden="true">
					<span data-process-progress />
				</div>
			</section>

			<section className="expand-intro shell">
				<p className="eyebrow" data-reveal>
					{copy.expand.eyebrow}
				</p>
				<h2 className="title" data-reveal>
					{copy.expand.title}
				</h2>
				<p className="lead" data-reveal>
					{copy.expand.body}
				</p>
			</section>
			<section className="expand" data-expand>
				<div className="expand-media" data-expand-media>
					<img
						src="/shots/rec-explain.jpg"
						alt={copy.expand.title}
						loading="lazy"
						width={1100}
						height={687}
					/>
				</div>
				<ul className="expand-chips">
					<li className="chip chip--0" data-chip>
						{copy.expand.headline.label} ·{" "}
						<span
							className="chip-score"
							data-score={copy.expand.headline.score}
						>
							{copy.expand.headline.score}
						</span>{" "}
						{copy.expand.headline.unit}
					</li>
					{copy.expand.chips.map((chip, index) => (
						<li key={chip} className={`chip chip--${index + 1}`} data-chip>
							{chip}
						</li>
					))}
				</ul>
				<p className="expand-hint" data-expand-hint aria-hidden="true">
					{copy.expand.hint}
					<span className="expand-hint-arrow" />
				</p>
			</section>

			<ReasonReel copy={copy.reel} />

			<StickerLab copy={copy.lab} />

			<OotdLooks copy={copy.looks} />

			<section className="mobile-showcase shell">
				<div className="mobile-copy">
					<p className="eyebrow" data-reveal>
						{copy.mobile.eyebrow}
					</p>
					<h2 className="title" data-reveal>
						{copy.mobile.title}
					</h2>
					<p className="lead" data-reveal>
						{copy.mobile.body}
					</p>
				</div>
				<div className="phones">
					{[
						{ src: "/shots/phone-1.jpg", speed: "0.35" },
						{ src: "/shots/phone-2.jpg", speed: "-0.25" },
						{ src: "/shots/phone-3.jpg", speed: "0.5" },
					].map((phone, index) => (
						<div key={phone.src} className={`phone phone--${index}`}>
							<div className="phone-body" data-parallax={phone.speed}>
								<img
									src={phone.src}
									alt=""
									loading="lazy"
									width={342}
									height={736}
								/>
							</div>
						</div>
					))}
				</div>
			</section>

			<section className="promise shell">
				<div className="promise-head">
					<p className="eyebrow" data-reveal>
						{copy.promise.eyebrow}
					</p>
					<h2 className="title" data-reveal>
						{copy.promise.title}
					</h2>
				</div>
				<ol className="promise-list">
					{copy.promise.items.map((item, index) => (
						<li key={item.title} className="promise-row" data-reveal>
							<span
								className="promise-line"
								data-line-draw
								aria-hidden="true"
							/>
							<span className="promise-index">0{index + 1}</span>
							<h3 className="promise-title">{item.title}</h3>
							<p className="promise-body">{item.body}</p>
						</li>
					))}
				</ol>
			</section>

			<CtaBlock
				eyebrow={copy.cta.eyebrow}
				title={copy.cta.title}
				sub={copy.cta.sub}
				button={copy.cta.button}
				note={copy.cta.note}
				href={siteConfig.appUrl}
			/>
		</main>
	);
}
