import { useEffect, useRef, useState } from "react";
import { useDragScroll } from "../motion/useDragScroll";

interface OotdLooksCopy {
	eyebrow: string;
	title: string;
	body: string;
	note: string;
	all: string;
	hint: string;
	close: string;
	prev: string;
	next: string;
	items: { src: string; label: string; who: string }[];
}

/** Generated try-on previews: filter by wearer, drag or arrow through them, tap one to enlarge. */
export function OotdLooks({ copy }: { copy: OotdLooksCopy }) {
	const track = useRef<HTMLUListElement>(null);
	const dialog = useRef<HTMLDialogElement>(null);
	const [group, setGroup] = useState<string | null>(null);
	const [open, setOpen] = useState<number | null>(null);
	const { progress, moved } = useDragScroll(track);

	const groups = [...new Set(copy.items.map((item) => item.who))];
	const visible = group
		? copy.items.filter((item) => item.who === group)
		: copy.items;
	const current = open === null ? null : visible[open];

	useEffect(() => {
		const element = dialog.current;
		if (!element) return;
		if (open !== null && !element.open) element.showModal();
		if (open === null && element.open) element.close();
	}, [open]);

	// Switching the filter always starts again from the first look.
	// biome-ignore lint/correctness/useExhaustiveDependencies: the group is the trigger, not a value read inside
	useEffect(() => {
		track.current?.scrollTo({ left: 0 });
	}, [group]);

	function step(direction: 1 | -1) {
		const element = track.current;
		if (!element) return;
		const card = element.querySelector("li");
		const width = (card?.getBoundingClientRect().width ?? 240) + 16;
		element.scrollBy({ left: direction * width * 2, behavior: "smooth" });
	}

	function show(delta: 1 | -1) {
		if (open === null) return;
		setOpen((open + delta + visible.length) % visible.length);
	}

	return (
		<section className="looks" id="looks">
			<div className="looks-head shell">
				<p className="eyebrow" data-reveal>
					{copy.eyebrow}
				</p>
				<h2 className="title" data-reveal>
					{copy.title}
				</h2>
				<p className="lead" data-reveal>
					{copy.body}
				</p>
				<div className="looks-bar" data-reveal>
					<div className="looks-tabs" role="tablist" aria-label={copy.eyebrow}>
						{[null, ...groups].map((name) => (
							<button
								key={name ?? "all"}
								type="button"
								role="tab"
								aria-selected={group === name}
								className={`looks-tab${group === name ? " is-active" : ""}`}
								onClick={() => setGroup(name)}
							>
								{name ?? copy.all}
							</button>
						))}
					</div>
					<div className="looks-arrows">
						<p className={`looks-hint${moved ? " is-done" : ""}`}>
							{copy.hint}
						</p>
						<button
							type="button"
							className="looks-arrow"
							aria-label={copy.prev}
							onClick={() => step(-1)}
						>
							<span aria-hidden="true">←</span>
						</button>
						<button
							type="button"
							className="looks-arrow"
							aria-label={copy.next}
							onClick={() => step(1)}
						>
							<span aria-hidden="true">→</span>
						</button>
					</div>
				</div>
			</div>
			<ul className="looks-track" ref={track} data-reveal>
				{visible.map((item, index) => (
					<li key={item.src} className="look">
						<button
							type="button"
							className="look-open"
							onClick={() => setOpen(index)}
						>
							<img
								src={item.src}
								alt={`${item.who}：${item.label}`}
								loading="lazy"
								draggable={false}
								width={640}
								height={960}
							/>
							<span className="look-who">{item.who}</span>
							<span className="look-label">{item.label}</span>
						</button>
					</li>
				))}
			</ul>
			<div className="looks-progress shell" aria-hidden="true">
				<span style={{ transform: `scaleX(${0.12 + progress * 0.88})` }} />
			</div>
			<p className="looks-note shell">{copy.note}</p>

			<dialog
				ref={dialog}
				className="look-dialog"
				aria-label={current?.label}
				onClose={() => setOpen(null)}
				onClick={(event) => {
					if (event.target === dialog.current) setOpen(null);
				}}
				onKeyDown={(event) => {
					if (event.key === "ArrowRight") show(1);
					if (event.key === "ArrowLeft") show(-1);
				}}
			>
				{current ? (
					<figure className="look-figure">
						<img src={current.src} alt={`${current.who}：${current.label}`} />
						<figcaption>
							<span className="look-who">{current.who}</span>
							<span className="look-label">{current.label}</span>
						</figcaption>
					</figure>
				) : null}
				<button
					type="button"
					className="look-close"
					aria-label={copy.close}
					onClick={() => setOpen(null)}
				>
					<span aria-hidden="true">×</span>
				</button>
				<button
					type="button"
					className="look-step look-step--prev"
					aria-label={copy.prev}
					onClick={() => show(-1)}
				>
					<span aria-hidden="true">←</span>
				</button>
				<button
					type="button"
					className="look-step look-step--next"
					aria-label={copy.next}
					onClick={() => show(1)}
				>
					<span aria-hidden="true">→</span>
				</button>
			</dialog>
		</section>
	);
}
