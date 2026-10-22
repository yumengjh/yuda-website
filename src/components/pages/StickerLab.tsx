import { useRef } from "react";
import type { Messages } from "../../i18n/locales/zh";
import { Draggable, gsap, prefersReducedMotion, useGSAP } from "../../lib/gsap";
import { scoped } from "../motion/hooks";
import { Sticker, type StickerKind } from "../Sticker";

const pieces: {
	kind: StickerKind;
	left: string;
	top: string;
	rotate: number;
}[] = [
	{ kind: "cap", left: "8%", top: "10%", rotate: -10 },
	{ kind: "jacket", left: "34%", top: "6%", rotate: 4 },
	{ kind: "tee", left: "62%", top: "12%", rotate: -4 },
	{ kind: "jeans", left: "14%", top: "52%", rotate: 6 },
	{ kind: "skirt", left: "42%", top: "50%", rotate: -6 },
	{ kind: "sneaker", left: "68%", top: "58%", rotate: 8 },
	{ kind: "bag", left: "84%", top: "34%", rotate: 10 },
];

/** A tiny styling board: drag, toss, shuffle and tidy the garment stickers. */
export function StickerLab({ copy }: { copy: Messages["home"]["lab"] }) {
	const root = useRef<HTMLElement>(null);
	const board = useRef<HTMLDivElement>(null);

	const { contextSafe } = useGSAP(
		() => {
			const area = board.current;
			if (!root.current || !area) return;
			const q = scoped(root.current);
			let top = 10;
			Draggable.create(q("[data-drag]"), {
				bounds: area,
				inertia: true,
				edgeResistance: 0.75,
				zIndexBoost: false,
				onPress() {
					top += 1;
					gsap.set(this.target, { zIndex: top });
					gsap.to(this.target, { scale: 1.08, duration: 0.3 });
					area.dataset.touched = "true";
				},
				onRelease() {
					gsap.to(this.target, {
						scale: 1,
						duration: 0.5,
						ease: "back.out(3)",
					});
				},
			});
			if (!prefersReducedMotion()) {
				gsap.from(q("[data-drag]"), {
					y: -200,
					rotate: () => gsap.utils.random(-120, 120),
					opacity: 0,
					duration: 1.4,
					stagger: 0.07,
					ease: "bounce.out",
					scrollTrigger: { trigger: area, start: "top 75%" },
				});
			}
		},
		{ scope: root },
	);

	const shuffle = contextSafe(() => {
		const area = board.current;
		if (!area) return;
		for (const item of area.querySelectorAll<HTMLElement>("[data-drag]")) {
			const maxX = area.clientWidth - item.offsetLeft - item.offsetWidth;
			const maxY = area.clientHeight - item.offsetTop - item.offsetHeight;
			gsap.to(item, {
				x: gsap.utils.random(-item.offsetLeft, maxX),
				y: gsap.utils.random(-item.offsetTop, maxY),
				rotate: gsap.utils.random(-40, 40),
				duration: prefersReducedMotion() ? 0 : 1.1,
				ease: "expo.out",
				onComplete: () => Draggable.get(item)?.update(),
			});
		}
	});

	const tidy = contextSafe(() => {
		for (const item of board.current?.querySelectorAll<HTMLElement>(
			"[data-drag]",
		) ?? []) {
			gsap.to(item, {
				x: 0,
				y: 0,
				rotate: 0,
				duration: prefersReducedMotion() ? 0 : 1,
				ease: "elastic.out(1, 0.6)",
				onComplete: () => Draggable.get(item)?.update(),
			});
		}
	});

	return (
		<section ref={root} className="lab shell">
			<div className="lab-copy">
				<p className="eyebrow" data-reveal>
					{copy.eyebrow}
				</p>
				<h2 className="title" data-reveal>
					{copy.title}
				</h2>
				<p className="lead" data-reveal>
					{copy.body}
				</p>
				<div className="lab-actions" data-reveal>
					<button
						type="button"
						className="button button--primary"
						onClick={shuffle}
					>
						{copy.shuffle}
					</button>
					<button type="button" className="button button--ghost" onClick={tidy}>
						{copy.reset}
					</button>
				</div>
			</div>
			<div
				ref={board}
				className="lab-board"
				role="img"
				aria-label={copy.boardLabel}
				data-touched="false"
			>
				<span className="lab-hint" aria-hidden="true">
					{copy.hint}
				</span>
				{pieces.map((piece) => (
					<div
						key={piece.kind}
						className="lab-piece"
						data-drag
						data-cursor={copy.drag}
						style={{ left: piece.left, top: piece.top }}
					>
						<div style={{ rotate: `${piece.rotate}deg` }}>
							<Sticker kind={piece.kind} />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
