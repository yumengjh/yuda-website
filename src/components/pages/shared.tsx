import { type ReactNode, useRef } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "../../lib/gsap";
import {
	heroLines,
	scoped,
	splitForLocale,
	useEntrance,
} from "../motion/hooks";
import { Magnetic } from "../motion/Magnetic";
import { TransitionLink } from "../motion/PageTransition";
import { Sticker } from "../Sticker";

/** Inner-page opening: eyebrow, masked two-line display title, lead, optional aside. */
export function PageHero({
	eyebrow,
	lines,
	sub,
	children,
}: {
	eyebrow: string;
	lines: string[];
	sub: string;
	children?: ReactNode;
}) {
	const root = useRef<HTMLElement>(null);
	useEntrance(root, (timeline, q) => {
		heroLines(timeline, q, 0);
		timeline
			.from(
				q("[data-hero-fade]"),
				{ y: 30, opacity: 0, duration: 1.1, stagger: 0.08 },
				0.35,
			)
			.from(
				q("[data-hero-rule]"),
				{
					scaleX: 0,
					transformOrigin: "left",
					duration: 1.6,
					ease: "expo.inOut",
				},
				0.2,
			);
	});
	return (
		<section ref={root} className="page-hero shell">
			<p className="eyebrow" data-hero-fade>
				<span className="eyebrow-dot" />
				{eyebrow}
			</p>
			<h1 className="display page-hero-title">
				{lines.map((line, index) => (
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
			<span className="page-hero-rule" data-hero-rule aria-hidden="true" />
			<div className="page-hero-foot">
				<p className="lead" data-hero-fade>
					{sub}
				</p>
				{children ? <div data-hero-fade>{children}</div> : null}
			</div>
		</section>
	);
}

/** Closing call to action with an orbiting sticker ring and a magnetic round button. */
export function CtaBlock({
	eyebrow,
	title,
	sub,
	button,
	note,
	href,
	internal = false,
}: {
	eyebrow?: string;
	title: string;
	sub?: string;
	button: string;
	note?: string;
	href: string;
	internal?: boolean;
}) {
	const root = useRef<HTMLElement>(null);
	useGSAP(
		() => {
			if (!root.current || prefersReducedMotion()) return;
			const q = scoped(root.current);
			const units = q("[data-cta-line]").flatMap(splitForLocale);
			gsap.from(units, {
				yPercent: 115,
				rotate: 6,
				duration: 1.3,
				stagger: 0.04,
				scrollTrigger: { trigger: root.current, start: "top 70%" },
			});
			gsap.from(q("[data-cta-fade]"), {
				y: 40,
				opacity: 0,
				duration: 1.2,
				stagger: 0.1,
				delay: 0.4,
				scrollTrigger: { trigger: root.current, start: "top 70%" },
			});
			gsap.to(q("[data-orbit]"), {
				rotate: 360,
				duration: 40,
				ease: "none",
				repeat: -1,
			});
		},
		{ scope: root },
	);
	const buttonContent = (
		<>
			<span>{button}</span>
			<span aria-hidden="true">↗</span>
		</>
	);
	return (
		<section ref={root} className="cta inverse">
			<div className="cta-orbit" data-orbit aria-hidden="true">
				{(["tee", "cap", "jeans", "spark", "sneaker", "jacket"] as const).map(
					(kind, index) => (
						<span
							key={kind}
							className="cta-orbit-item"
							style={{ rotate: `${index * 60}deg` }}
						>
							<Sticker kind={kind} />
						</span>
					),
				)}
			</div>
			<div className="cta-inner shell">
				{eyebrow ? (
					<p className="eyebrow" data-cta-fade>
						{eyebrow}
					</p>
				) : null}
				<h2 className="display cta-title">
					<span className="line-mask">
						<span data-cta-line>{title}</span>
					</span>
				</h2>
				{sub ? (
					<p className="cta-sub num" data-cta-fade>
						{sub}
					</p>
				) : null}
				<div data-cta-fade className="cta-action">
					<Magnetic strength={0.45}>
						{internal ? (
							<TransitionLink to={href} className="orb-button" data-cursor="">
								{buttonContent}
							</TransitionLink>
						) : (
							<a href={href} className="orb-button" data-cursor="">
								{buttonContent}
							</a>
						)}
					</Magnetic>
				</div>
				{note ? (
					<p className="cta-note" data-cta-fade>
						{note}
					</p>
				) : null}
			</div>
		</section>
	);
}
