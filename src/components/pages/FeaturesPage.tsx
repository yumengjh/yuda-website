import { useRef } from "react";
import {
	gsap,
	prefersReducedMotion,
	ScrollTrigger,
	useGSAP,
} from "../../lib/gsap";
import { useCopy, useLocalePath } from "../LocaleProvider";
import { scoped, useScrollEffects } from "../motion/hooks";
import { Tilt } from "../motion/Tilt";
import { CtaBlock, PageHero } from "./shared";

export function FeaturesPage() {
	const copy = useCopy().features;
	const localePath = useLocalePath();
	const root = useRef<HTMLElement>(null);
	useScrollEffects(root);

	useGSAP(
		() => {
			const element = root.current;
			if (!element) return;
			const q = scoped(element);
			const media = gsap.matchMedia();

			// The sticky stage follows whichever module sits in the middle of the viewport.
			media.add("(min-width: 1024px)", () => {
				const images = q("[data-stage-image]");
				const modules = q("[data-module]");
				const digit = q("[data-stage-digit]")[0];
				const reduced = prefersReducedMotion();
				let current = 0;
				let zIndex = 1;
				gsap.set(images, { clipPath: "inset(100% 0% 0% 0%)" });
				gsap.set(images[0], { clipPath: "inset(0% 0% 0% 0%)" });
				const activate = (index: number) => {
					if (index === current) return;
					const forward = index > current;
					const next = images[index];
					current = index;
					modules.forEach((module, i) => {
						module.dataset.active = String(i === index);
					});
					gsap.set(next, { zIndex: ++zIndex });
					gsap.fromTo(
						next,
						{
							clipPath: forward
								? "inset(100% 0% 0% 0%)"
								: "inset(0% 0% 100% 0%)",
						},
						{
							clipPath: "inset(0% 0% 0% 0%)",
							duration: reduced ? 0 : 1.1,
							ease: "expo.inOut",
						},
					);
					gsap.fromTo(
						next.querySelector("img"),
						{ scale: 1.25 },
						{ scale: 1, duration: reduced ? 0 : 1.4, ease: "expo.out" },
					);
					if (digit) {
						gsap.fromTo(
							digit,
							{ yPercent: forward ? 100 : -100, opacity: 0 },
							{
								yPercent: 0,
								opacity: 1,
								duration: reduced ? 0 : 0.7,
								onStart: () => {
									digit.textContent = `0${index + 1}`;
								},
							},
						);
					}
				};
				modules[0].dataset.active = "true";
				const triggers = modules.map((module, index) =>
					ScrollTrigger.create({
						trigger: module,
						start: "top 55%",
						end: "bottom 55%",
						onToggle: (self) => self.isActive && activate(index),
					}),
				);
				return () => {
					for (const trigger of triggers) trigger.kill();
					for (const module of modules) delete module.dataset.active;
				};
			});
			return () => media.revert();
		},
		{ scope: root },
	);

	return (
		<main id="main" ref={root} className="page page--features">
			<PageHero
				eyebrow={copy.hero.eyebrow}
				lines={copy.hero.lines}
				sub={copy.hero.sub}
			/>

			<section className="modules shell">
				<div className="modules-list">
					{copy.modules.map((module) => (
						<article key={module.title} className="module" data-module>
							<span className="module-tag num">{module.tag}</span>
							<h2 className="module-title" data-reveal>
								{module.title}
							</h2>
							<p className="lead" data-reveal>
								{module.body}
							</p>
							<ul className="module-points">
								{module.points.map((point) => (
									<li key={point} data-reveal>
										{point}
									</li>
								))}
							</ul>
							<figure className="frame module-inline" data-reveal>
								<div className="frame-media">
									<img
										src={module.image}
										alt={module.title}
										loading="lazy"
										width={1100}
										height={687}
									/>
								</div>
							</figure>
						</article>
					))}
				</div>
				<div className="modules-stage" aria-hidden="true">
					<div className="modules-sticky">
						<div className="stage-counter">
							<span className="stage-digit-mask">
								<span className="num" data-stage-digit>
									01
								</span>
							</span>
							<span className="stage-total">/ 0{copy.modules.length}</span>
						</div>
						<div className="frame stage-frame">
							<div className="frame-bar">
								<i />
								<i />
								<i />
							</div>
							<div className="stage-images">
								{copy.modules.map((module) => (
									<div
										key={module.image}
										className="stage-image"
										data-stage-image
									>
										<img
											src={module.image}
											alt=""
											loading="lazy"
											width={1100}
											height={687}
										/>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="tech shell">
				<div className="section-head">
					<p className="eyebrow" data-reveal>
						{copy.tech.eyebrow}
					</p>
					<h2 className="title" data-reveal>
						{copy.tech.title}
					</h2>
				</div>
				<div className="tech-grid">
					{copy.tech.items.map((item, index) => (
						<div key={item.title} data-reveal>
							<Tilt className="tech-card">
								<span className="tech-index num">0{index + 1}</span>
								<h3 className="tech-title">{item.title}</h3>
								<p className="tech-body">{item.body}</p>
							</Tilt>
						</div>
					))}
				</div>
			</section>

			<CtaBlock
				title={copy.cta.title}
				button={copy.cta.button}
				href={localePath("/pricing")}
				internal
			/>
		</main>
	);
}
