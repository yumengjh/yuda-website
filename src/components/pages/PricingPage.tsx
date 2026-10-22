import { useEffect, useId, useRef, useState } from "react";
import { siteConfig } from "../../config/site";
import { gsap, prefersReducedMotion, useGSAP } from "../../lib/gsap";
import { useCopy } from "../LocaleProvider";
import { scoped, useScrollEffects } from "../motion/hooks";
import { Tilt } from "../motion/Tilt";
import { CtaBlock, PageHero } from "./shared";

type Billing = "monthly" | "yearly";

/** Counts from the previous value to the new one whenever `value` changes. */
function AnimatedNumber({ value }: { value: number }) {
	const element = useRef<HTMLSpanElement>(null);
	const shown = useRef(value);
	useEffect(() => {
		const target = element.current;
		if (!target) return;
		const state = { value: shown.current };
		const tween = gsap.to(state, {
			value,
			duration: prefersReducedMotion() ? 0 : 0.9,
			ease: "expo.out",
			onUpdate: () => {
				shown.current = state.value;
				target.textContent = String(Math.round(state.value));
			},
		});
		return () => {
			tween.kill();
		};
	}, [value]);
	return <span ref={element}>{value}</span>;
}

function FaqItem({ q, a }: { q: string; a: string }) {
	const [open, setOpen] = useState(false);
	const panel = useRef<HTMLDivElement>(null);
	const id = useId();
	useEffect(() => {
		const element = panel.current;
		if (!element) return;
		gsap.to(element, {
			height: open ? "auto" : 0,
			opacity: open ? 1 : 0,
			duration: prefersReducedMotion() ? 0 : 0.6,
			ease: "expo.out",
		});
	}, [open]);
	return (
		<li className="faq-item" data-open={open} data-reveal>
			<h3>
				<button
					type="button"
					className="faq-question"
					aria-expanded={open}
					aria-controls={id}
					onClick={() => setOpen((value) => !value)}
				>
					<span>{q}</span>
					<span className="faq-icon" aria-hidden="true" />
				</button>
			</h3>
			<div
				ref={panel}
				id={id}
				className="faq-answer"
				style={{ height: 0, opacity: 0 }}
			>
				<p>{a}</p>
			</div>
		</li>
	);
}

export function PricingPage() {
	const all = useCopy();
	const copy = all.pricing;
	const [billing, setBilling] = useState<Billing>("monthly");
	const root = useRef<HTMLElement>(null);
	const switcher = useRef<HTMLFieldSetElement>(null);
	useScrollEffects(root);

	// Slide the pill under the selected billing option.
	useEffect(() => {
		const container = switcher.current;
		const active = container?.querySelector<HTMLElement>(
			`[data-billing="${billing}"]`,
		);
		const pill = container?.querySelector<HTMLElement>("[data-pill]");
		if (!active || !pill) return;
		gsap.to(pill, {
			x: active.offsetLeft - 4,
			width: active.offsetWidth,
			duration: prefersReducedMotion() ? 0 : 0.7,
			ease: "expo.out",
		});
	}, [billing]);

	useGSAP(
		() => {
			if (!root.current || prefersReducedMotion()) return;
			const q = scoped(root.current);
			gsap.from(q("[data-plan]"), {
				y: 120,
				rotationX: -25,
				opacity: 0,
				transformPerspective: 1000,
				transformOrigin: "50% 100%",
				duration: 1.4,
				stagger: 0.12,
				scrollTrigger: { trigger: q("[data-plans]")[0], start: "top 80%" },
			});
		},
		{ scope: root },
	);

	return (
		<main id="main" ref={root} className="page page--pricing">
			<PageHero
				eyebrow={copy.hero.eyebrow}
				lines={copy.hero.lines}
				sub={copy.hero.sub}
			>
				<fieldset ref={switcher} className="billing">
					<legend className="sr-only">
						{copy.billing.monthly} / {copy.billing.yearly}
					</legend>
					<span className="billing-pill" data-pill aria-hidden="true" />
					{(["monthly", "yearly"] as const).map((option) => (
						<button
							key={option}
							type="button"
							data-billing={option}
							aria-pressed={billing === option}
							onClick={() => setBilling(option)}
						>
							{copy.billing[option]}
							{option === "yearly" ? (
								<em className="billing-save">{copy.billing.save}</em>
							) : null}
						</button>
					))}
				</fieldset>
			</PageHero>

			<section className="plans shell" data-plans>
				{copy.plans.map((plan) => {
					const price = billing === "monthly" ? plan.monthly : plan.yearly;
					const featured = Boolean(plan.badge);
					return (
						<div key={plan.name} className="plan-wrap" data-plan>
							<Tilt
								className={`plan${featured ? " plan--featured" : ""}`}
								max={5}
							>
								<div className="plan-head">
									<h2 className="plan-name">{plan.name}</h2>
									{plan.badge ? (
										<span className="plan-badge">{plan.badge}</span>
									) : null}
								</div>
								<p className="plan-tagline">{plan.tagline}</p>
								<p className="plan-price">
									{price === 0 ? (
										<span className="plan-amount">{copy.billing.free}</span>
									) : (
										<>
											<span className="plan-currency">¥</span>
											<span className="plan-amount">
												<AnimatedNumber value={price} />
											</span>
											<span className="plan-unit">
												{billing === "monthly"
													? copy.billing.perMonth
													: copy.billing.perYear}
											</span>
										</>
									)}
									<span className="plan-draft">{copy.draft}</span>
								</p>
								<a
									className={`button ${featured ? "button--primary" : "button--ghost"} plan-cta`}
									href={siteConfig.appUrl}
								>
									{plan.cta}
								</a>
								<ul className="plan-features">
									{plan.features.map((feature) => (
										<li key={feature}>{feature}</li>
									))}
								</ul>
							</Tilt>
						</div>
					);
				})}
			</section>

			<section className="compare shell">
				<h2 className="title" data-reveal>
					{copy.compare.title}
				</h2>
				<div className="compare-scroll" data-reveal>
					<table className="compare-table">
						<thead>
							<tr>
								<th scope="col">{copy.compare.feature}</th>
								{copy.plans.map((plan) => (
									<th key={plan.name} scope="col">
										{plan.name}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{copy.compare.rows.map((row) => (
								<tr key={row.label}>
									<th scope="row">{row.label}</th>
									{row.values.map((value, index) => (
										<td
											key={`${row.label}-${copy.plans[index]?.name}`}
											data-empty={value === "—"}
										>
											{value}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			<section className="faq shell">
				<h2 className="title" data-reveal>
					{copy.faq.title}
				</h2>
				<ul className="faq-list">
					{copy.faq.items.map((item) => (
						<FaqItem key={item.q} q={item.q} a={item.a} />
					))}
				</ul>
			</section>

			<CtaBlock
				title={all.home.cta.title}
				sub={all.home.cta.sub}
				button={all.home.cta.button}
				note={all.home.cta.note}
				href={siteConfig.appUrl}
			/>
		</main>
	);
}
