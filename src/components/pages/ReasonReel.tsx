import { useRef } from "react";
import { useDragScroll } from "../motion/useDragScroll";

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
	const { progress, moved } = useDragScroll(track);

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
							height={1170}
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
