import { useEffect, useRef, useState } from "react";

interface ReasonReelCopy {
	eyebrow: string;
	title: string;
	hint: string;
	items: string[];
}

const cards = [1, 2, 3, 4, 5, 6, 7].map((n) => `/shots/reason-${n}.webp`);

/** Real recommendation cards in a sideways scroller, with a hint, a progress bar and mouse dragging. */
export function ReasonReel({ copy }: { copy: ReasonReelCopy }) {
	const track = useRef<HTMLDivElement>(null);
	const [progress, setProgress] = useState(0);
	const [moved, setMoved] = useState(false);

	useEffect(() => {
		const element = track.current;
		if (!element) return;
		let startX = 0;
		let startScroll = 0;
		let dragging = false;

		const onScroll = () => {
			const range = element.scrollWidth - element.clientWidth;
			setProgress(range > 0 ? element.scrollLeft / range : 0);
			if (element.scrollLeft > 8) setMoved(true);
		};
		const onDown = (event: PointerEvent) => {
			if (event.pointerType !== "mouse") return;
			dragging = true;
			startX = event.clientX;
			startScroll = element.scrollLeft;
			element.classList.add("is-dragging");
			element.setPointerCapture(event.pointerId);
		};
		const onMove = (event: PointerEvent) => {
			if (dragging) element.scrollLeft = startScroll - (event.clientX - startX);
		};
		const onUp = () => {
			dragging = false;
			element.classList.remove("is-dragging");
		};

		onScroll();
		element.addEventListener("scroll", onScroll, { passive: true });
		element.addEventListener("pointerdown", onDown);
		element.addEventListener("pointermove", onMove);
		element.addEventListener("pointerup", onUp);
		element.addEventListener("pointercancel", onUp);
		return () => {
			element.removeEventListener("scroll", onScroll);
			element.removeEventListener("pointerdown", onDown);
			element.removeEventListener("pointermove", onMove);
			element.removeEventListener("pointerup", onUp);
			element.removeEventListener("pointercancel", onUp);
		};
	}, []);

	return (
		<section className="reel" id="reasons">
			<div className="reel-head shell">
				<div className="reel-copy">
					<p className="eyebrow" data-reveal>
						{copy.eyebrow}
					</p>
					<h3 className="reel-title" data-reveal>
						{copy.title}
					</h3>
				</div>
				<p
					className={`reel-hint${moved ? " is-done" : ""}`}
					data-reveal
					aria-hidden="true"
				>
					<span className="reel-hint-arrow reel-hint-arrow--left" />
					{copy.hint}
					<span className="reel-hint-arrow reel-hint-arrow--right" />
				</p>
			</div>
			<div className="reel-track" ref={track} data-reveal>
				{cards.map((src, index) => (
					<figure key={src} className="reel-card">
						<img
							src={src}
							alt={copy.items[index]}
							loading="lazy"
							draggable={false}
							width={560}
							height={1149}
						/>
					</figure>
				))}
			</div>
			<div className="reel-bar shell" aria-hidden="true">
				<span style={{ transform: `scaleX(${0.18 + progress * 0.82})` }} />
			</div>
		</section>
	);
}
